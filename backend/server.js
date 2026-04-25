import { router } from "./src/routes/product.api.route.js"; // Importación y conexión con el router
import express from "express";
import cors from "cors";
// PUNTO DE ENTRADA QUE AYUDA A CONFIGURAR EXPRESS
const app = express();

app.use(cors());
app.use(express.json());
// Uso del router de productos con el prefijo api
app.use("/api", router);

// Ruta raíz GET que devuelve el texto requerido
app.get("/", (req, res) => {
  res.send("e-commerce app práctica 4");
});

const PORT = process.env.PORT || 3100; // constante para que siempre se levante el servidor en el puerto 3100
// Servidor levantado en el puerto 3100
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});