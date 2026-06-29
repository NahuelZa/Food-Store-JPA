import {addProductToCart, getCart, removeCart, removeProduct} from "../../../utils/utils.ts";
import type {ElementoCarrito} from "../../../types/elementosCarrito.ts";
import {verificarUsuario} from "../../../main.ts";
import {getUSer} from "../../../utils/localStorage.ts";
import type {IUsuario} from "../../../types/usuario.ts";


verificarUsuario("USUARIO")

const carritoContainer = document.getElementById("carrito-container") as HTMLDivElement;
const subtotalElement = document.getElementById("subtotal") as HTMLSpanElement;
const totalElement = document.getElementById("total") as HTMLSpanElement;
const username = document.getElementById("user") as HTMLElement;

const user=getUSer();
const parseUser: IUsuario = JSON.parse(user);
username.innerHTML=`${parseUser.nombre} ${parseUser.apellido}`



//FUNCIONES
    const actualizarPrecio = () => {
    const productos = getCart();
    const total = productos.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);
    subtotalElement.innerText = `$${total}`;
    totalElement.innerText = `$${total}`;
}
   

const mensajeError = (mensaje: string, container: HTMLElement) => {
    //container.innerHTML = "";
    const mensajeError = document.createElement("h2");
    mensajeError.innerText = mensaje;
    container.appendChild(mensajeError);
}

const botonvaciar = document.getElementById("vaciar-carrito") as HTMLButtonElement;
    botonvaciar.addEventListener("click", () => {
    removeCart();// Elimina el carrito del localStorage
    CargarCarrito([]);

})



//CARGAR ELEMENTOS DEL CARRITO
const CargarCarrito = (producto: ElementoCarrito[]) => {
    
    carritoContainer.innerHTML = "";
    if (getCart().length > 0) {
        const fragmento = document.createDocumentFragment();
        producto.forEach((p) => {
            const tarjeta = document.createElement("article");
            tarjeta.classList.add("tarjetas");
            tarjeta.innerHTML = `<div class="producto">
                        <div class="img-container">
                            <img src="${p.producto.imagen}" alt="${p.producto.descripcion}">
                        </div>
                        <div class="info-producto">
                            <h3>${p.producto.nombre}</h3>
                            <p>Precio: $${p.producto.precio}</p>
                        </div>
                    </div>

                    <div class="controles-item">
                        <div class="selector-cantidad">
                            <button class="btn-menos">-</button>
                            <span class="cantidad">${p.cantidad}</span>
                            <button class="btn-mas">+</button>
                        </div>
                        <button class="btn-eliminar">Eliminar</button>
                    </div>`
            fragmento.appendChild(tarjeta);


            //FUNCION DE BOTONES AGREGAR QUITAR Y ELIMINAR
            const btnRestarProducto = tarjeta.querySelector(".btn-menos") as HTMLButtonElement;
            const btnSumarProducto = tarjeta.querySelector(".btn-mas") as HTMLButtonElement;
            const cantidadProducto = tarjeta.querySelector(".cantidad") as HTMLSpanElement;
            const controlesItem = tarjeta.querySelector(".controles-item") as HTMLDivElement;
            const btnEliminarProducto = tarjeta.querySelector(".btn-eliminar") as HTMLButtonElement;

            let stockDisponible = p.producto.stock - (p?.cantidad ?? 0);

            controlesItem.addEventListener("click", (E: MouseEvent) => {
                    stockDisponible = p.producto.stock - (p?.cantidad ?? 0);

                if (E.target === btnRestarProducto) {
                    if (p.cantidad > 1) {
                        p.cantidad--;
                        addProductToCart(producto);
                        cantidadProducto.innerText = p.cantidad.toString();
                        actualizarPrecio();
                    }
                } else if (E.target === btnSumarProducto && stockDisponible > 0) {
                    p.cantidad++;
                    addProductToCart(producto);
                    cantidadProducto.innerText = p.cantidad.toString();
                    actualizarPrecio();
                }
                else if (E.target === btnEliminarProducto) {                                        
                    removeProduct(p.producto.id);          
                    tarjeta.remove();
                    actualizarPrecio();
                    //CargarCarrito(getCart());
                    if (carritoContainer.innerHTML === "") {
                        
                        mensajeError("El carrito esta vacio", carritoContainer);
                    }
                }
                
            }
            )
        });
        carritoContainer.appendChild(fragmento);
    } else {
        mensajeError("El carrito esta vacio", carritoContainer);
    }
    

actualizarPrecio();

}

CargarCarrito(getCart());






    