document.addEventListener("DOMContentLoaded", loadCart);
// Archivo JS correspondiente para las funciones del carrito HTML

// Primero inicia cargando los datos del carrito actual con una función
function loadCart() {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || [];
  // Usando sessionStorage para obtener los items agregados desde la página index
  console.log("CARRITO:", cart);

  renderCart(cart);
}
// Luego hace el render del carrito en sí, con la plantilla HTML para que se vean visualmente de forma adecuada
function renderCart(cart) {
  const container = document.getElementById("cart-container");

  container.innerHTML = "";

  cart.forEach(item => {
    const productHTML = `
      <div class="d-flex align-items-center m-3">

        <img src="${item.imageUrl}" width="120">

        <div class="m-3 flex-fill">
          <h5>${item.title}</h5>
          <p>$ ${item.price}</p>

          <div class="btn-group">
            <button class="btn btn-outline-secondary minus-btn" data-id="${item.id}">-</button>
            <button class="btn btn-light">${item.quantity}</button>
            <button class="btn btn-outline-secondary plus-btn" data-id="${item.id}">+</button>
          </div>
        </div>

        <button class="btn btn-danger delete-btn" data-id="${item.id}">
          🗑
        </button>

      </div>
    `;

    container.innerHTML += productHTML;
  });
  // Y además muestra el cálculo del total del precio
  calculateTotal(cart);
}
// Función para calcular el total del precio de todos los productos añadidos en el carrito más el coste del envío
function calculateTotal(cart) {
  let subtotal = 0; // Primero calcula solo el total de los productos, es decir, el subtotal

  cart.forEach(item => {
    subtotal += item.price * item.quantity; // Calculando el precio x cantidad
  });

  const envio = 599;
  const total = subtotal + envio; // Calcula el envío

  const container = document.getElementById("cart-total");
  // Añade visualmente el cálculo en la parte correspondiente del HTML
  container.innerHTML = `
    <div class="card p-4 shadow h-100 text-center justify-content-center">

      <h4>Total de la transacción a efectuar:</h4>
      <hr>
      
      ${cart.map(item => `
        <p>${item.title} x ${item.quantity} = $ ${item.price * item.quantity}</p>
      `).join("")}
        
      <p>Subtotal: $ ${subtotal}</p>
      <p>Envío: $ ${envio}</p>

      <hr>
      <h5>Total: $ ${total}</h5>

      <button class="btn btn-primary w-100 mt-3">
        Pagar
      </button>

      <button class="btn btn-outline-danger w-100 mt-2">
        Cancelar
      </button>

    </div>
  `;
}
// Eventos que suceden al hacer click en eventos
document.addEventListener("click", (e) => {
  const cart = JSON.parse(sessionStorage.getItem("cart")) || []; // Lee lo almacenado en el sessionStorage

  // SUMAR PRODUCTOS DE UN TIPO
  if (e.target.classList.contains("plus-btn")) {
    const id = e.target.dataset.id;

    const item = cart.find(p => p.id == id);
    // Funcionalidad de edición para confirmar cambios
    if(confirm("¿Deseas aumentar la cantidad?")){
        item.quantity++;
        updateCart(cart);
    }
    
  }

  // RESTAR PRODUCTOS DE UN TIPO
  if (e.target.classList.contains("minus-btn")) {
    const id = e.target.dataset.id;

    const item = cart.find(p => p.id == id);
    // Funcionalidad de edición para confirmar cambios
    if (confirm("¿Deseas disminuir la cantidad?")) {
        if (item.quantity > 1) {
            item.quantity--;
            updateCart(cart);
        }
    }
  }

  // ELIMINAR PRODUCTOS DE UN TIPO
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.dataset.id;
    // Funcionalidad de edición para confirmar cambios
    if (confirm("¿Deseas eliminar este producto?")) {
        const newCart = cart.filter(p => p.id != id);
        updateCart(newCart);
    }
  }

});
// Función para actualizar el carrito con cada cambio hecho
function updateCart(cart) {
  sessionStorage.setItem("cart", JSON.stringify(cart)); // Guarda en el sessionStorage, para sobrevivir los refresh
  renderCart(cart);
}