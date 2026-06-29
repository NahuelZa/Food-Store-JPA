import type {Product} from "../../../types/product.ts";
import productos from "../../../data/productos.json"
import {addProductToCart, getCart, removeProduct} from "../../../utils/utils.ts";
import type {ElementoCarrito} from "../../../types/elementosCarrito.ts";
import {verificarUsuario} from "../../../main.ts";

verificarUsuario("USUARIO")
// 1. Leemos el ID que viaja en la barra de direcciones (?id=X)
const parametrosURL = new URLSearchParams(window.location.search);
const idUrl = parametrosURL.get("id");
const productoEncontrado = productos.find(p => p.id === parseInt(idUrl));
const productosEnCarrito: ElementoCarrito[] = getCart()
// @ts-ignore
const itemEspecifico = productosEnCarrito.find(item => item.producto.id === productoEncontrado.id);
// @ts-ignore
//si no existe item en carrito entonces es 0
const stockDisponible = productoEncontrado.stock - (itemEspecifico?.cantidad ?? 0);


const contenedor = document.getElementById("contenedor") as HTMLDivElement;

 const cargarProductoDetalle = (producto: Product) => {

    contenedor.innerHTML = ` 
 <div class="detalle-imagen">
    <img src="${producto.imagen}" alt="${producto.descripcion}">
  </div>

  <div class="detalle-info">
    <span class="categoria-tag">${producto.categoria.nombre}</span>
    <h2 class="producto-titulo">${producto.nombre}</h2>
    <span class="producto-precio">$ ${producto.precio}</span>

    <div class="stock-badge">
      <span class="punto-verde"></span>
      Disponible (Stock: ${stockDisponible})
    </div>

    <p class="producto-descripcion">
      ${producto.descripcion}
    </p>
<div class="seccion-cantidad">
      <label>Cantidad:</label>
      <div class="control-cantidad">
        <button type="button" class="btn-cant" id="btn-menos">-</button>
        <span class="cantidad">1</span>
        <button type="button" class="btn-cant" id="btn-mas">+</button>
      </div>
    </div>

    <div class="acciones-container">
      <button class="btn-principal-carrito">
        🛒 Agregar al Carrito
      </button>
      <a href="../home/home.html" class="btn-volver">
        ← Volver
      </a>
    </div>`

    const btnRestarProducto = contenedor.querySelector("#btn-menos") as HTMLButtonElement;
    const btnSumarProducto = contenedor.querySelector("#btn-mas") as HTMLButtonElement;
    const cantidadProducto = contenedor.querySelector(".cantidad") as HTMLSpanElement;
    const controlesItem = contenedor.querySelector(".control-cantidad") as HTMLDivElement;
    const botonComprar = contenedor.querySelector(".btn-principal-carrito") as HTMLButtonElement;
    let cantidadSeleccionada = 1;

    if (stockDisponible == 0) {
        controlesItem.innerHTML = "No hay stock disponible"
        botonComprar.style.display = "none";
    }
    controlesItem.addEventListener("click", (E: MouseEvent) => {
            if (E.target === btnRestarProducto) {
                if (cantidadSeleccionada > 1) {
                    cantidadSeleccionada--;
                    cantidadProducto.innerText = cantidadSeleccionada.toString();
                }
            } else if (E.target === btnSumarProducto && stockDisponible > cantidadSeleccionada) {
                cantidadSeleccionada++;
                cantidadProducto.innerText = cantidadSeleccionada.toString();

            }


        }
    )

    botonComprar.addEventListener("click", () => {
        if(itemEspecifico){
            itemEspecifico.cantidad += cantidadSeleccionada;
        }
        else{
            productosEnCarrito.push({
                producto: producto,
                cantidad: cantidadSeleccionada
            });
        }
        productoEncontrado.stock-=cantidadSeleccionada;
        addProductToCart(productosEnCarrito)
        alert(`¡Se agregaron ${cantidadSeleccionada} unidad(es) al carrito!`)
            window.location.href = `../home/home.html`;


    })


}
if (idUrl) {
    if (productoEncontrado) {
        // 3. Si existe, llamamos a la función para pintar el HTML
        cargarProductoDetalle(productoEncontrado);
    } else {
        if (contenedor) contenedor.innerHTML = "<h2>El producto solicitado no existe.</h2>";
    }
} else {
    if (contenedor) contenedor.innerHTML = "<h2>No se especificó ningún producto.</h2>";
}










