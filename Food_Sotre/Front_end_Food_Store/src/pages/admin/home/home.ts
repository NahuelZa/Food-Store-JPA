import {verificarUsuario} from "../../../main";
import type {Product} from "../../../types/product.ts";
import productos from "../../../data/productos.json"
import type {ICategory} from "../../../types/categoria.ts";
import categorias from "../../../data/categorias.json";
import type {IPedido} from "../../../types/pedido.ts";
import pedidos from "../../../data/pedidos.json"

verificarUsuario("ADMIN")

const productoTodos: Product[] = productos
const categoriasTodas: ICategory[] = categorias
const pedidosTodos: IPedido[] = pedidos

const barraLateral = document.querySelector(".sidebar-menu") as HTMLDivElement;
const contenedorGeneral = document.querySelector(".main-content") as HTMLElement;


const cargarDashboard = () => {
    contenedorGeneral.innerHTML = "";
    console.log("contenedorGeneral.innerHTML");
    contenedorGeneral.innerHTML = `
    <h2 class="page-title">Panel de Administración</h2>
        <section class="metrics-grid">
            <div class="card card-purple">
                <div class="card-header">
                    <span>📁 Categorías</span>
                </div>
                <div class="card-value" id="count-categorias">${categoriasTodas.length}</div>
                <button class="btn-manage" data-target="categorias">Gestionar</button>
            </div>
            <div class="card card-pink">
                <div class="card-header">
                    <span>🍔 Productos</span>
                </div>
                <div class="card-value" id="count-productos">${productoTodos.length}</div>
                <button class="btn-manage" data-target="productos" >Gestionar</button>
            </div>
            <div class="card card-blue">
                <div class="card-header">
                    <span>📦 Pedidos</span>
                </div>
                <div class="card-value" id="count-pedidos">${pedidosTodos.length}</div>
                <button class="btn-manage"data-target="pedidos">Gestionar</button>
            </div>
            <div class="card card-green">
                <div class="card-header">
                    <span>✅ Disponibles</span>
                </div>
                <div class="card-value" id="count-disponibles">${productoTodos.filter(producto => producto.disponible).length}</div>
                <p class="card-subtitle">Productos activos</p>
            </div>
        </section>
        <section class="summary-section">
            <h3 class="section-subtitle">📊 Resumen Rápido</h3>
            <div class="summary-grid">
                <div class="summary-card bar-green">
                    <span class="summary-label">🔥 Ingresos Totales</span>
                    <div class="summary-value text-green" id="total-ingresos">$ ${pedidosTodos.reduce((acumulador, sumaTotal) => acumulador + sumaTotal.total, 0)}</div>
                </div>
                <div class="summary-card bar-orange">
                    <span class="summary-label">⏳ Pedidos Pendientes</span>
                    <div class="summary-value text-orange" id="pedidos-pendientes">${pedidosTodos.filter(pedido => pedido.estado === "PENDIENTE").length}</div>
                </div>
                <div class="summary-card bar-blue">
                    <span class="summary-label">👨‍🍳 En Preparación</span>
                    <div class="summary-value text-blue" id="pedidos-preparacion">${pedidosTodos.filter(pedido => pedido.estado === "EN_PREPARACION").length}</div>
                </div>
                <div class="summary-card bar-green-light">
                    <span class="summary-label">✅ Completados</span>
                    <div class="summary-value text-green-light" id="pedidos-completados">${pedidosTodos.filter(pedido => pedido.estado === "ENTREGADO").length}</div>
                </div>
            </div>
        </section>;`
    const botonTarjetas = contenedorGeneral.querySelectorAll(".btn-manage") as NodeListOf<HTMLButtonElement>;
    botonTarjetas.forEach((boton) => {
        boton.addEventListener("click", (e) => {
            const opcion = e.currentTarget as HTMLButtonElement;
            const target = opcion.dataset.target;
            switch (target) {
                case "categorias":
                    cargarCategorias()
                    break;
                case "pedidos":
                    cargarPedidos(pedidosTodos);
                    break;
                case "productos":
                    cargarProductos()
                    break;
                default:
                    console.warn("Objetivo no reconocido");
            }
        });
    });
};


const cargarProductos = () => {
    contenedorGeneral.innerHTML = "";
    contenedorGeneral.innerHTML = `
        <h2 class="page-title">Gestión de Productos</h2>

    <div class="table-container">
    <table class="admin-table">
    <thead>
        <tr>
            <th class="col-prod-id">ID</th>
        <th class="col-prod-img">Imagen</th>
        <th class="col-prod-nom">Nombre</th>
        <th class="col-prod-desc">Descripción</th>
        <th class="col-prod-precio">Precio</th>
        <th class="col-prod-cat">Categoría</th>
        <th class="col-prod-stock">Stock</th>
        <th class="col-prod-est">Estado</th>
    </tr>
    </thead>
    <tbody>
    
    ${productoTodos.map((producto) => `
    <tr>
        <td>${producto.id}</td>
        <td><img src="${producto.imagen}" alt="${producto.nombre}" class="product-thumb"></td>
        <td class="font-medium">${producto.nombre}</td>
        <td>${producto.descripcion}</td>
        <td>$${producto.precio}</td>
        <td>${producto.categoria.nombre}</td>
        <td>${producto.stock}</td>
        <td>
            ${producto.disponible
        ? '<span class="status-badge badge-disponible">Disponible</span>'
        : '<span class="status-badge badge-no-disponible">No disponible</span>'
    }
        </td>
    </tr>
`).join('')}
    
    
    <tr>
       
    </tbody>
    </table>
    </div>`
}


const cargarCategorias = () => {
    contenedorGeneral.innerHTML = "";
    contenedorGeneral.innerHTML = `
        <h2 class="page-title">Gestión de Categorías</h2>

        <div class="table-container">
            <table class="admin-table">
                <thead>
                <tr>
                    <th class="col-id">ID</th>
                    <th class="col-nombre">Nombre</th>
                    <th class="col-descripcion">Descripción</th>
                </tr>
                </thead>
                <tbody>
                ${categoriasTodas.map((categoria) => `
                    <tr>
                        <td>${categoria.id}</td>
                    <td>${categoria.nombre}</td>
                    <td>${categoria.descripcion}</td>
                    </tr>`
    ).join('')}
                </tbody>
            </table>
        </div>`
}

const cargarPedidos = (pedidos: IPedido[]) => {
    contenedorGeneral.innerHTML = "";
    contenedorGeneral.innerHTML = `
        <div class="orders-header">
            <h2 class="page-title">Gestión de Pedidos</h2>
            <select class="filter-select" id="filtro-pedidos">
                <option value="TODOS">Todos</option>
                <option value="PENDIENTE">Pendiente</option>
                <option value="EN_PREPARACION">En Preparación</option>
                <option value="ENTREGADO">Entregado</option>
                <option value="CANCELADO">Cancelado</option>
            </select>
        </div>

        <div class="orders-list">
            ${pedidos.map((pedidos) => `            
            <div class="order-card">
                <div class="order-card-top">
                    <div class="order-meta">
                        <h3>Pedido #${pedidos.id}</h3>
                        <p class="order-client">Cliente: ${pedidos.usuarioDto.nombre} ${pedidos.usuarioDto.apellido}</p>
                        <p class="order-date">${pedidos.fecha}</p>
                    </div>
                    <span class="badge ${pedidos.estado}">${pedidos.estado}</span>
                </div>
                <div class="order-card-bottom">
                    <span class="order-count">${pedidos.detalles.length} producto(s)</span>
                    <span class="order-total">$ ${pedidos.total}</span>
                </div>
            </div>
            
            `).join("")}
            </div>      
`;

    const selectFiltro = document.getElementById("filtro-pedidos") as HTMLSelectElement;
    selectFiltro.addEventListener("change", () => {
        const valorSeleccionado = selectFiltro.value;
        console.log(valorSeleccionado);
        if (valorSeleccionado === "TODOS") {
            // Si eligen todos, volvemos a pasar la lista completa
            cargarPedidos(pedidosTodos);
        } else {
            // Filtramos comparando estrictamente el valor del select con el estado del objeto
            const pedidosFiltrados = pedidosTodos.filter(p => p.estado === valorSeleccionado);
            cargarPedidos(pedidosFiltrados);
        }
        const nuevoSelect = document.getElementById("filtro-pedidos") as HTMLSelectElement;
        if (nuevoSelect) nuevoSelect.value = valorSeleccionado;

    });


}


barraLateral.addEventListener("click", (e) => {
    const elemento = e.target as HTMLElement;
    if (elemento.classList.contains("menu-item")) {
        barraLateral.querySelector(".menu-item.active")?.classList.remove("active");
        elemento.classList.add("active");
        const opcion = elemento.innerText;

        if (opcion.includes("Dashboard")) {
            cargarDashboard()
            //console.log(elemento);
        }
        if (opcion.includes("Categorías")) {
            cargarCategorias()
        }
        if (opcion.includes("Productos")) {
            cargarProductos()
        }
        if (opcion.includes("Pedidos")) {
            cargarPedidos(pedidosTodos)
        }

    }


})
cargarDashboard()