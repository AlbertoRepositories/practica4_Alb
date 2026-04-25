import fs from "fs/promises"; // CAPA REPOSITORY PARA LA LECTURA Y ESCRITURA JSON (importa fs/promises para el uso de async y await que son los encargador de leer y escribir JSONs)
import path from "path"; // Usado para que se haga un mejor manejo de las rutas para que se pueda leer y escribir, pues estaba teniendo fallos
import { fileURLToPath } from "url";

// Procedimiento con los métodos de path y url para manejar de una manera muy segura el manejo de rutas
const __filename = fileURLToPath(import.meta.url); // Primero se importa la URL del archivo actual
const __dirname = path.dirname(__filename); // Y con dirname se quita el nombre del archivo para dejar solo la carpeta

// Para así, con el dirname; el nombre del directorio, tener la ruta correcta hacia products.json
const filePath = path.join(__dirname, "../../products.json");

// Funciones
const getAllProducts = async () => { // Lectura de products.json para convertirlo de texto a objetos JS
  const data = await fs.readFile(filePath, "utf-8");
  return JSON.parse(data);
};

const getProductById = async (id) => { // Método de lectura de los productos para luego buscar uno en específico por ID
  const data = await fs.readFile(filePath, "utf-8");
  const products = JSON.parse(data);

  return products.find(p => p.id === id); // Devuelve el objeto con la propiedad ID que coincida exactamente con la ID buscada
};

const saveCart = async (cart) => { // Sirve para escribir o guardar el carrito creado en cart.json
  await fs.writeFile(
    path.join(__dirname, "../../cart.json"),
    JSON.stringify(cart, null, 2)
  );
};

const getCart = async () => { // Lee el carrito desde el archivo de cart.json
  const data = await fs.readFile(
    path.join(__dirname, "../../cart.json"),
    "utf-8"
  );
  return JSON.parse(data); // Y lo devuelve parseado
};

const saveProducts = async (products) => { // Sobreescribe los productos existentes a partir de cualquier cambio generado
  await fs.writeFile(filePath, JSON.stringify(products, null, 2));
};
// Exportación de estas funciones para que puedan ser usadas en otras capas
export { getAllProducts, getProductById, getCart, saveCart, saveProducts };