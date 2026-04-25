import { getProducts } from "./api.js";
// Archivo JS para agregar funcionamientos a la página INDEX HTML y cargar la info del backend en el frontend


const container = document.getElementById("product-container");
// Renderizar productos funcionales en el index HTML
function renderProducts(products) {

  container.innerHTML = "";
  // Recibe los productos y renderiza cada uno como una card siguiendo la plantilla HTML con los atributos del producto correspondientes
  products.forEach(product => {
    const card = `
      <div class="col">
        <div class="card shadow-lg m-3">
          
          <img src="${product.imageUrl}" 
               alt="${product.title}" 
               class="card-img-top">

          <div class="card-body">
            <h5 class="card-title mb-3 text-center text-danger">
              ${product.title}
            </h5>

            <h6 class="card-subtitle mb-3 text-center text-body-secondary">
              $ ${product.pricePerUnit}
            </h6>

            <p class="card-text text-center">
              ${product.description || "Sin descripción"}
            </p>

            <p class="text-center small text-muted">
              ${product.category || ""}
            </p>
          </div>

          <div class="card-footer d-grid">
            <button 
              class="btn-sm bg-success btn-outline-dark add-btn"
              data-id="${product.id}">
              Añadir
            </button>
          </div>

        </div>
      </div>
    `;

    container.innerHTML += card;
  });

  // Lee y selecciona la id del producto cuyo botón de añadir se le hace click para agregarlo al carrito
  document.querySelectorAll(".add-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;

      const product = products.find(p => p.id == id);

      addToCart(product);
    });
  });
}
// Función para hacer el render de la paginación dependiendo de los productos que hayan y limitando la cantidad de productos visibles
// por página y siendo capaz de dividir todos los productos de forma adecuada en números de páginas visibles e interactuables
function renderPagination(response) {
  const container = document.getElementById("pagination");

  container.innerHTML = "";

  for (let i = 1; i <= response.totalPages; i++) {
    container.innerHTML += `
      <li class="page-item ${i === response.page ? "active" : ""}">
        <button class="page-link" data-page="${i}">
          ${i}
        </button>
      </li>
    `;
  }
}
// Función para añadir productos al carrito a partir de la ID del producto
function addToCart(product) {
  let cart = JSON.parse(sessionStorage.getItem("cart")) || [];

  const existing = cart.find(p => p.id === product.id);
  // Si ya había un producto así en el carrito, se suma 1 a la cantidad presente en el carrito
  if (existing) {
    existing.quantity += 1;
  } else { // Sino, se crea el producto en el carrito
    cart.push({
      id: product.id,
      title: product.title,
      price: product.pricePerUnit,
      imageUrl: product.imageUrl,
      quantity: 1
    });
  }
  // Se guarda el item en el sessionStorage
  sessionStorage.setItem("cart", JSON.stringify(cart));

  console.log("Carrito:", cart);
}
// Carga los productos correspondientes según la página activa dentro de la paginación
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-link")) {
    const page = parseInt(e.target.dataset.page);
    loadProducts(page);
  }
});

// Cargar productos al iniciar  
async function loadProducts(page = 1) {
  const response = await getProducts(page, 4); // Delimita a 4 productos por página
  // Mensaje de prueba para estar seguro de que todo esté bien
  console.log("RESPUESTA COMPLETA:", response);

  const products = response.data;
  // Mensaje de consola para enseñar los productos
  console.log("PRODUCTOS EXTRAÍDOS:", products);
  // Renderiza todo
  renderProducts(products);
  renderPagination(response);
}

loadProducts();