import type {IPedido} from "../../../types/pedido.ts";
import pedidos from "../../../data/pedidos.json"
import type {ElementoCarrito} from "../../../types/elementosCarrito.ts";
import {getCart} from "../../../utils/utils.ts";
import {verificarUsuario} from "../../../main.ts";
import {getUSer} from "../../../utils/localStorage.ts";
import type {IUser} from "../../../types/IUser.ts";
import type {IUsuario} from "../../../types/usuario.ts";

verificarUsuario("USUARIO")
const pedidosTodos: IPedido[] = pedidos as IPedido[];


const contenedorLista = document.getElementById("lista-pedidos") as HTMLDivElement;
const modal = document.getElementById("modal-detalle") as HTMLDivElement;
const modalBody = document.getElementById("modal-body") as HTMLDivElement;
const selectFiltro = document.getElementById("filtro-estado") as HTMLSelectElement;
const cartBadge = document.getElementById("badge") as HTMLElement;
const username = document.getElementById("user") as HTMLElement;

const user = getUSer();
const parseUser: IUsuario = JSON.parse(user);
username.innerHTML = `${parseUser.nombre} ${parseUser.apellido}`


const carrito: ElementoCarrito[] = getCart();

const actualizarBadgeCarrito = () => {
    if (!cartBadge) return;
    const totalItems = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
    cartBadge.innerText = totalItems.toString();
};
actualizarBadgeCarrito()


const cargarPedidos = (pedidos: IPedido[]) => {
    contenedorLista.innerHTML = "";

    pedidos.forEach(pedido => {
        if (pedido.usuarioDto.id === parseUser.id) {
            const article = document.createElement("article");
            article.className = "tarjeta-pedido";


            const descripcionesItems = pedido.detalles.map(detallePedido => `• ${detallePedido.producto.nombre} (x${detallePedido.cantidad})`);

            // Dividimos la lista en dos columnas simples para simular el diseño(generado con IA)
            const mitad = Math.ceil(descripcionesItems.length / 2);
            const col1 = descripcionesItems.slice(0, mitad).join("<br>");
            const col2 = descripcionesItems.slice(mitad).join("<br>");

            article.innerHTML = `
            <div class="tarjeta-header">
                <h3>Pedido #${pedido.id}</h3>
                <span class="status-badge ${pedido.estado}">${pedido.estado}</span>
            </div>
            <div class="fecha">📅 ${pedido.fecha}</div>
            
            <div class="resumen-productos">
                <div>${col1}</div>
                <div>${col2}</div>
            </div>
            
            <div class="tarjeta-footer">
                <span>📦 ${pedido.detalles.length} producto(s)</span>
                <span class="total-precio">$${pedido.total.toFixed(2)}</span>
            </div>
        `;


            article.addEventListener("click", () => abrirModal(pedido));

            contenedorLista.appendChild(article);

        }

    });
};


const abrirModal = (pedido: IPedido) => {

    // Generar el HTML de los productos
    const htmlProductos = pedido.detalles.map(p => `
        <div class="modal-item">
            <div class="item-info">
                <strong>${p.producto.nombre}</strong>
                <small>Cantidad: ${p.cantidad} × $${p.producto.precio.toFixed(2)}</small>
            </div>
            <div class="item-subtotal">$${p.subtotal.toFixed(2)}</div>
        </div>
    `).join("");

    modalBody.innerHTML = `
        <div class="modal-top">
            <span class="status-badge ${pedido.estado}" style="margin-bottom:10px; display:inline-block;">${pedido.estado}</span>
            <div class="fecha" style="justify-content:center;">📅 ${pedido.fecha}</div>
        </div>

        <div class="modal-section">
            <h4>📍 Información de Entrega</h4>
            <p><strong>Teléfono:</strong> ${pedido.usuarioDto.celular}</p>
            <p><strong>Método de pago:</strong> 🏦 ${pedido.formaPago}</p>
        </div>

        <div class="modal-section">
            <h4>🛍️ Productos</h4>
            ${htmlProductos}
            <div class="modal-total">
                <span>Total:</span>
                <span>$${pedido.total.toFixed(2)}</span>
            </div>
        </div>

        <div class="alerta-procesando">
            ⏳ <strong>Tu pedido está siendo procesado</strong><br>
            <small>Te notificaremos cuando sea confirmado.</small>
        </div>
    `;

    // Activar clase CSS para mostrar
    modal.classList.add("active");
};


modal.addEventListener("click", (e) => {
    // Cierra el modal si se clickea en el fondo oscuro (fuera de la caja blanca)
    if (e.target === modal) {
        modal.classList.remove("active");
    }
});

selectFiltro.addEventListener("change", () => {
    const valor = selectFiltro.value.toUpperCase();
    if (valor === "TODOS") {
        cargarPedidos(pedidosTodos);
    } else {
        const filtrados = pedidosTodos.filter(p => p.estado === valor);
        cargarPedidos(filtrados);
    }
});


cargarPedidos(pedidosTodos);