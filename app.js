import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getDatabase, ref, set, push, onValue, remove } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBKWyP-wl3XXyCwLVOF-AWEGbMhpTj7j4w",
  authDomain: "remodelacionesmz.firebaseapp.com",
  databaseURL: "https://remodelacionesmz-default-rtdb.firebaseio.com/",
  projectId: "remodelacionesmz",
  storageBucket: "remodelacionesmz.appspot.com",
  messagingSenderId: "517202804629",
  appId: "1:517202804629:web:2ad27774863cec7787009c",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";  // Si no está autenticado, redirigir al login
  } else {
    loadOrders();  // Cargar los pedidos solo si el usuario está autenticado
  }
});

// Elementos del DOM
const orderList = document.getElementById("orderList");
const addOrderButton = document.getElementById("addOrder");
const orderNameInput = document.getElementById("orderName");
const orderQuantityInput = document.getElementById("orderQuantity");
const orderStatusSelect = document.getElementById("orderStatus");

let orders = [];

// Función para cargar los pedidos
function loadOrders() {
  const user = auth.currentUser;
  if (user) {
    const userOrdersRef = ref(db, 'orders/' + user.uid);
    onValue(userOrdersRef, (snapshot) => {
      const data = snapshot.val();
      orders = [];
      for (let id in data) {
        orders.push({ id, ...data[id] });
      }
      updateUI();  // Actualiza la interfaz de usuario con los pedidos
    });
  }
}

// Función para agregar un nuevo pedido
    async function addOrder() {
        const user = auth.currentUser;
        const name = orderNameInput.value;
        const quantity = orderQuantityInput.value ? parseInt(orderQuantityInput.value) : 1;  // Si no se ingresa cantidad, se asigna 1 por defecto
        const status = orderStatusSelect.value;
        const date = new Date().toLocaleString();
    
        if (!name) {
        alert("Por favor, ingresa el nombre del pedido.");
        return;
        }
    
        const newOrder = { name, quantity, status, date };
    
        // Verificar si el usuario está autenticado
        if (user) {
        const newOrderRef = push(ref(db, 'orders/' + user.uid));
        set(newOrderRef, newOrder);  // Agregar el pedido al usuario
        }
    }

// Función para eliminar un pedido
async function deleteOrder(id) {
  const user = auth.currentUser;
  if (user) {
    const orderRef = ref(db, 'orders/' + user.uid + '/' + id);
    remove(orderRef);  // Eliminar el pedido
  }
}

function updateUI() {
    if (orders.length === 0) {
      orderList.innerHTML = "<li>No tienes pedidos.</li>";
    } else {
      orderList.innerHTML = orders
        .map(
          order => ` 
          <li class="${getUrgencyClass(order.status)}">
            ${order.date} - ${order.name} 
            <strong> Cantidad: ${order.quantity || 'N/A'} </strong>  <!-- Muestra 'N/A' si no se proporciona cantidad -->
            <button onclick="deleteOrder('${order.id}')" class="delete-btn">
              <i class="fas fa-trash-alt"></i>
            </button>
          </li>`
        )
        .join("");
    }
  }
  
  // Función para obtener la clase de urgencia según el estado
  function getUrgencyClass(status) {
    switch (status) {
      case 'pending':
        return 'urgent';  // Urgente
      case 'in-progress':
        return 'very-urgent';  // Muy Urgente
      case 'completed':
        return 'necessary';  // Necesario
      default:
        return '';
    }
  }
  

// Event listener para agregar pedidos
addOrderButton.addEventListener("click", addOrder);

// Cargar los pedidos al inicio
loadOrders();

// Hacer que deleteOrder sea global para los botones
window.deleteOrder = deleteOrder;

// Elemento del botón de cerrar sesión
const logoutButton = document.getElementById("logoutButton");

// Función para cerrar sesión
function logout() {
  const user = auth.currentUser;
  if (user) {
    auth.signOut()
      .then(() => {
        console.log("Sesión cerrada exitosamente.");
        window.location.href = "login.html";  // Redirigir al login
      })
      .catch((error) => {
        console.error("Error al cerrar sesión:", error);
      });
  }
}

// Event listener para el botón de cerrar sesión
logoutButton.addEventListener("click", logout);