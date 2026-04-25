import { Router } from "express"; // Creación del router de productos con el prefijo api
import { getProducts, getProductById, addToCart, getCartByUser, createProduct, updateProduct, deleteProduct } from "../controller/product.controller.js";
import { validateAdmin } from "../middlewares/validateAdmin.middleware.js";
import { validateUser } from "../middlewares/validateUser.middleware.js";
// DEFINE LOS ENDPOINTS Y EL CONTROLLER CORRESPONDIENTE
const router = Router();

// Endpoint de prueba con uso de middleware
// Primero van las rutas específicas, las de carrito requieren un usuario
router.get("/products/cart", validateUser, getCartByUser);
// Y luego las generales
router.get("/products", validateAdmin, getProducts);
router.get("/products/:id", validateAdmin, getProductById);
router.post("/products/cart", validateUser, addToCart);
// Rutas para el uso de post, delete y put con la validación de solo admin
router.post("/products", validateAdmin, createProduct);
router.put("/products/:id", validateAdmin, updateProduct);

router.delete("/products/:id", validateAdmin, deleteProduct);

export { router };