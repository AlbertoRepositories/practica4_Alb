import { getProductsService, getProductByIdService, addToCartService, getCartByUserService, createProductService, updateProductService, deleteProductService } from "../services/product.service.js"; // Importación de la capa Service y sus métodos
// CAPA CONTROLLER que maneja las solicitudes
const getProducts = async (req, res) => { // GET api/products
  try {
    const isAdmin = req.isAdmin || false; // Chequeo de si el usuario es admin o no para proceder
    // Con el proceso de si incluirá lo que regrese con el stock o no
    const products = await getProductsService(req.query, req.isAdmin);

    res.status(200).json(products); // Si todo bien, código 200 OK y devuelve la lista de productos
    
  } catch (error) {
    console.error(error);

    res.status(500).json({ // De otro modo, mensaje 500 de error si no se pudieron obtener los productos
      mensaje: "Error al obtener productos"
    });
  }
};

const getProductById = async (req, res) => { // GET /api/products/:id
  try {
    const { id } = req.params; // Requisito que se dé una ID como parámetro en la solicitud
    const isAdmin = req.isAdmin || false; // Comprobación de admin

    const product = await getProductByIdService(id, isAdmin); // Si todo bien, ejecuta el service proceso

    if (!product) { // Si no encuentra el producto, mensaje 404 de error:
      return res.status(404).json({
        mensaje: "No existe un producto con ese ID"
      });
    }

    res.status(200).json(product); // Todo bien, mensaje 200 OK

  } catch (error) { // Try/catch hecho para mostrar en pantalla el error específico si no había un resultado esperado mientras probaba
    console.error(error);

    res.status(500).json({ // Si hay algún error inesperado, mensaje 500 de error
      mensaje: "Error al obtener producto"
    });
  }
};

const addToCart = async (req, res) => { // POST /api/products/cart
  try {
    const userName = req.userName; // Requiere la solicitud un body para las IDs y el nombre de usuario
    const ids = req.body;

    const result = await addToCartService(ids, userName);

    if (result.error) { // Si hay un error, regresará el tipo de error correspondiente gracias al service
      return res.status(result.status).json({
        mensaje: result.error
      });
    }

    res.status(202).json({ // Mensaje 202 de éxito al guardar los productos
      mensaje: "Productos agregados al carrito",
      productos: result.products
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error en inesperado en carrito"
    });
  }
};
// GET /api/products/cart
const getCartByUser = async (req, res) => {
  try {
    const userName = req.userName; // Se recibe como parámetro el nombre del usuario

    const cart = await getCartByUserService(userName); // Hace el proceso service

    res.status(200).json(cart); // Si todo bien devuelve 200 OK con detalle del carrito con total

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al obtener carrito"
    });
  }
};
// POST /api/products
const createProduct = async (req, res) => {
  try {
    const result = await createProductService(req.body); // Hace el proceso service

    if (result.error) { // Muestra el error 400 si faltan campos, se hace este proceso en service
      return res.status(result.status).json({
        mensaje: result.error
      });
    }
    // Mensaje 201 si se logró crear bien y muestra el nombre del producto creado en el mensaje
    res.status(201).json({
      mensaje: `Producto ${result.product.title} creado exitosamente`
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al crear producto"
    });
  }
};
// PUT /api/products/:id
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params; // Recibe la id como parámetro

    const result = await updateProductService(id, req.body); // Proceso en service

    // Errores controlados, ya sea de falta de campos o que no encontró el producto con esa ID, proceso de service
    if (result.error) {
      return res.status(result.status).json({
        mensaje: result.error
      });
    }

    // Si hay éxito, mensaje de producto actualizado con su nombre mostrado
    res.status(200).json({
      mensaje: `Producto ${result.product.title} actualizado correctamente`
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al actualizar producto"
    });
  }
};
// DELETE /api/products/:id 
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params; // Recibir ID del producto a eliminar

    const result = await deleteProductService(id); // Service

    if (result.error) { // Muestra error correspondiente
      return res.status(result.status).json({
        mensaje: result.error
      });
    }

    res.status(200).json({ // Si todo bien, mensaje del producto eliminado con su nombre mostrado
      mensaje: `Producto ${result.product.title} eliminado correctamente`
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      mensaje: "Error al eliminar producto"
    });
  }
};
// Exportación de estos métodos en esta capa
export { getProducts, getProductById, addToCart, getCartByUser, createProduct, updateProduct, deleteProduct };