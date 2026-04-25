import shortid from "shortid";
import { getAllProducts, getProductById, getCart, saveCart, saveProducts } from "../repositories/product.repository.js"; // Importa las funciones del repositorio para la lectura y escritura de los objetos
// CAPA SERVICE PARA LA LÓGICA DEL NEGOCIO
// GET /api/products
const getProductsService = async (query, isAdmin) => { // Manejo para la obtención de los productos
  let products = await getAllProducts();

  // Filtros correspondientes a la rúbrica
  for (const key in query) {
    if (key !== "min" && key !== "max" && key !== "page" && key !== "limit") { // Ignora ahora page y limit en los filtros, para evitar problemas con lo mostrado en index.html
      products = products.filter(p =>
        p[key]?.toString().toLowerCase().includes(query[key].toLowerCase())
      );
    }
  }

  // Capacidad de filtro por precio a partir de un mínimo y un máximo
  const min = query.min ? Number(query.min) : null;
  const max = query.max ? Number(query.max) : null;

  if (min !== null) {
    products = products.filter(p => p.pricePerUnit >= min);
  }

  if (max !== null) {
    products = products.filter(p => p.pricePerUnit <= max);
  }

  // Restricción para ocultar el stock si quien hace uso de este GET NO es admin
  if (!isAdmin) {
    products = products.map(({ stock, ...rest }) => rest);
  }

  // PAGINACIÓN 
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || products.length;

  const start = (page - 1) * limit;
  const end = start + limit;

  const paginatedProducts = products.slice(start, end);

  return {
    data: paginatedProducts,
    total: products.length,
    page,
    totalPages: Math.ceil(products.length / limit)
  };

  //return products;
};
// GET /api/products/:id
const getProductByIdService = async (id, isAdmin) => { // Service para la obtención del Producto por su ID
  const product = await getProductById(id);

  if (!product) { // Validación de que exista el producto con la ID buscada gracias al uso de la función importada y usada en la variable product
    return null;
  }

  // Oculta, de nuevo, el stock si no es admin
  if (!isAdmin) {
    const { stock, ...rest } = product;
    return rest;
  }

  return product; // Retorna el producto encontrado si todo bien
};
// POST /api/products/cart
const addToCartService = async (ids, userName) => { // Servicio para que se añadan los productos seleccionados al carrito

  // Se valida que sea un arreglo la solicitud ingresada
  if (!Array.isArray(ids)) {
    return { 
      error: "El body debe ser un arreglo", 
      status: 400 
    };
  }

  const products = await getAllProducts(); // Uso de la función para obtener los productos existentes

  // Se validan las IDs
  for (const id of ids) {
    const exists = products.find(p => p.id.toString() === id.toString()); // Búsqueda por ID con el método find, con toString() para asegurar qeu sean del mismo tipo

    if (!exists) { // Validación si no existe que devuelve un error 404
      return {
        error: `Producto con ID ${id} no encontrado`,
        status: 404
      };
    }
  }

  // Obtener carrito actual
  let cart = await getCart();

  // Eliminación del carrito previo del usuario
  cart = cart.filter(c => c.user !== userName);

  // Creación de un nuevo carrito con solo las propiedades del nombre de usuario y el arreglo con las ID's de los productos en el cart
  cart.push({
    user: userName, 
    cart: ids
  });

  await saveCart(cart);

  // Retorno de productos encontrados al buscarles
  const foundProducts = products.filter(p =>
    ids.includes(p.id.toString())
  );

  return { success: true, products: foundProducts };
};
// GET /api/products/cart
const getCartByUserService = async (userName) => { // Servicio para obtener un carrito a partir del nombre de usuario
  const cart = await getCart();

  // Busca el carrito del usuario
  const userCart = cart.find(item => item.user === userName);

  // Si no tiene carrito devuelve el siguiente formato:
  if (!userCart) {
    return {
      user: userName,
      products: [],
      total: 0
    };
  }
  // De otro modo... Se obtienen todos los productos existentes
  const products = await getAllProducts();

  // Se obtienen los productos completos para regresarlos como una lista
  const productsDetailed = products // Busca por ID cada uno completo sin incluir su atributo stock
    .filter(p => userCart.cart.includes(p.id.toString())).map(p => { const { stock, ...withoutStock } = p;
      return withoutStock; // Retorna el producto sin el atributo stock
    });

  // Se calcula el costo total del carrito
  const total = productsDetailed.reduce((acc, p) => acc + p.pricePerUnit,0);

  return { // Al final, si todo bien, retorna un objeto con esta estructura:
    user: userName,
    products: productsDetailed,
    total
  };
};


// Servicio para la creación de productos nuevos con una plantilla donde deja propiedades o campos OBLIGATORIOS que deben contener
const createProductService = async (data) => { // POST /api/products
  const requiredFields = [
    "imageUrl",
    "title",
    "description",
    "unit",
    "category",
    "pricePerUnit",
    "stock"
  ];

  // Se valida si hay campos faltantes
  const missingFields = requiredFields.filter(field => !data[field]);

  if (missingFields.length > 0) { // Y por ende, si los hay, que haya al menos 1 campo faltante, devolverá
    return {
      error: `Faltan campos obligatorios: ${missingFields.join(", ")}`, // Un mensaje correspondiente indicando los campos faltantes
      status: 400
    };
  }

  const products = await getAllProducts();

  // Se le genera un ID automáticamente al producto usando shortid
  const newProduct = { // Y se crea el producto nuevo con los datos en los campos que corresponden
    id: shortid.generate(),
    imageUrl: data.imageUrl,
    title: data.title,
    description: data.description,
    unit: data.unit,
    category: data.category,
    pricePerUnit: Number(data.pricePerUnit),
    stock: Number(data.stock)
  };

  products.push(newProduct); // Se hace el push para que se añada el producto al JSON con los productos

  await saveProducts(products); // Se escriben los cambios

  return { // Y se retorna la indicación de que el producto nuevo se creó exitosamente
    success: true,
    product: newProduct
  };
};

const updateProductService = async (id, data) => { // Servicio para la actualización de los productos PUT /api/products/:id
  const products = await getAllProducts();

  // Se busca por índice del producto
  const index = products.findIndex(p => p.id.toString() === id.toString());

  // Si no existe el producto con el ID dado
  if (index === -1) {
    return {
      error: "Producto no encontrado", // Mensaje 404 de error
      status: 404
    };
  }

  // Campos requeridos
  const requiredFields = [
    "imageUrl",
    "title",
    "description",
    "unit",
    "category",
    "pricePerUnit",
    "stock"
  ];

  // De nuevo se validan los campos faltantes
  const missingFields = requiredFields.filter(field => !data[field]);

  if (missingFields.length > 0) { // Si alguno obligatorio falta, devuelve mensaje genérico 400 de error
    return {
      error: `Faltan campos obligatorios.`,
      status: 400
    };
  }

  // De otro modo, se actualiza el producto (sin cambiarle el id)
  const updatedProduct = {
    id: products[index].id, // Ayuda a mantener el mismo ID gracias a index
    imageUrl: data.imageUrl,
    title: data.title,
    description: data.description,
    unit: data.unit,
    category: data.category,
    pricePerUnit: Number(data.pricePerUnit),
    stock: Number(data.stock)
  };

  products[index] = updatedProduct; // Se usa la función del repositorio para actualizar el producto

  // Y se guardan los cambios
  await saveProducts(products);

  return { // Devolviendo éxito
    success: true,
    product: updatedProduct
  };
};

const deleteProductService = async (id) => { // Service para el DELETE /api/products/:id
  const products = await getAllProducts(); // Se obtienen los productos

  // Busca el producto por la ID dada
  const index = products.findIndex(p => p.id.toString() === id.toString());

  // Si no existe, mensaje 404 de error
  if (index === -1) {
    return {
      error: "Producto no encontrado",
      status: 404
    };
  }

  // Se guarda el nombre del producto antes de borrarlo con index
  const deletedProduct = products[index];

  // Se elimina el producto del arreglo
  products.splice(index, 1);

  // Se guardan los cambios
  await saveProducts(products);

  return {
    success: true,
    product: deletedProduct
  };
};
// Exportación de estos métodos service
export { getProductsService, getProductByIdService, addToCartService, getCartByUserService, createProductService, updateProductService, deleteProductService };