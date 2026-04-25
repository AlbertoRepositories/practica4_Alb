// Obtener productos con paginación
export async function getProducts(page = 1, limit = 4) {
  try {
    // Uso de fetch para cargar los productos y la paginación con un límite de productos por página en el enlace local del servidor
    // para la página
    const response = await fetch(`http://localhost:3100/api/products?page=${page}&limit=${limit}`);

    if (!response.ok) { // Mensaje de error si no hay respuesta
      throw new Error("Error al obtener productos");
    }

    return await response.json();

  } catch (error) { // Catch para otros errores
    console.error("Error en getProducts:", error);
    return [];
  }
}