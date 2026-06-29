import type {Product} from "../../../types/product";
import type {ICategory} from "../../../types/categoria";
import categorias from "../../../data/categorias.json";
import productos from "../../../data/productos.json"
//import { getProductos } from "../../../data/data";
//import { getCategories } from "../../../data/data";
import {addProductToCart, getCart} from "../../../utils/utils";
import {verificarUsuario} from "../../../main";
import type {ElementoCarrito} from "../../../types/elementosCarrito.ts";
import {getUSer} from "../../../utils/localStorage.ts";
import type {IUsuario} from "../../../types/usuario.ts";

verificarUsuario("USUARIO")


const gridElements = document.getElementById("grid-productos") as HTMLElement;
const getCategoriasBtn = document.getElementById("categorias-container") as HTMLElement
const inputBuscar = document.getElementById("buscador") as HTMLInputElement;
const selectorOrden = document.getElementById("selector-orden") as HTMLSelectElement;
const cartBadge = document.getElementById("cart-badge") as HTMLElement;
const totalEncontrados = document.getElementById("totalEncontrados") as HTMLElement;
const menuToggleBtn = document.getElementById("menu-toggle") as HTMLButtonElement;
const barraLateral = document.querySelector(".barra_lateral") as HTMLElement;
const username = document.getElementById("user") as HTMLElement;

const user = getUSer();
const parseUser: IUsuario = JSON.parse(user);
username.innerHTML = `${parseUser.nombre} ${parseUser.apellido}`


console.log(inputBuscar);

const todosProductos: Product[] = productos;
const todasCategorias: ICategory[] = categorias;


const botonDesactivado = (container: HTMLButtonElement) => {
    container.disabled = true;
    container.innerText = "Sin stock";
    container.style.backgroundColor = "rgba(22, 6, 6, 0.35)";
    container.style.pointerEvents = "none";
}

const botonActivado = (container: HTMLButtonElement) => {
    const textoOriginal = container.innerText;
    const coloOrOriginal = container.style.backgroundColor;
    container.innerText = "Agregado";
    container.style.backgroundColor = "rgba(6, 78, 18, 0.59)";
    container.style.pointerEvents = "none";
    setTimeout(() => {

        container.innerText = textoOriginal;
        container.style.backgroundColor = coloOrOriginal;
        container.style.pointerEvents = "auto";
    }, 300);
}
//Array de ElementosCarrito
const carrito: ElementoCarrito[] = getCart();

const actualizarBadgeCarrito = () => {
    if (!cartBadge) return;
    const totalItems = carrito.reduce((acumulador, item) => acumulador + item.cantidad, 0);
    cartBadge.innerText = totalItems.toString();
};
actualizarBadgeCarrito();

const productosEncontrados = (producto: Product[]) => {
    totalEncontrados.innerText = ""
    totalEncontrados.innerText = "Cantidad de productos encontrados: " + String(producto.length)
}


//Mensaje de eror generico
export const mensajeError = (mensaje: string, container: HTMLElement) => {
    //container.innerHTML = "";
    const mensajeError = document.createElement("h2");
    mensajeError.innerText = mensaje;
    container.appendChild(mensajeError);
}


const actualizarStock = (producto: Product): number => {
    const productoExistente = carrito.find(item => item.producto.id === producto.id);
    return producto.stock - (productoExistente?.cantidad ?? 0);

}
//Cargar productos al main
const cargarProductos = (producto: Product[]) => {
    gridElements.innerHTML = "";
    if (producto.length > 0) {
        const fragmento = document.createDocumentFragment();
        producto.forEach((p) => {
            if (p.disponible == true) {
                const tarjeta = document.createElement("article")
                tarjeta.classList.add("tarjetas")
                tarjeta.innerHTML = `
                    <img src="${p.imagen}" alt="${p.descripcion}">
                    <div class="info">
                        <span class="tag">${p.categoria.nombre}</span>
                        <h4 class="nombreProducto">${p.nombre}</h4>
                        <p>${p.descripcion}</p>
                        <div class="precio-accion">
                            <span class="precio">$${p.precio}</span>
                            <button class="btn-agregar">+ Agregar</button>
                        </div></div>`

                //Agregar al carrito a cada elemento creado se le agrega un event listener al boton de agregar
                const botonAgregar = tarjeta.querySelector(".btn-agregar") as HTMLButtonElement;

                const abrirDescripcion = tarjeta.querySelector(".nombreProducto") as HTMLElement

                abrirDescripcion.addEventListener("click", () => {
                    window.location.href = `../productDetail/detalle.html?id=${p.id}`;

                });

                //ESTILO BOTON AGREGAR
                botonAgregar.addEventListener("click", () => {
                    //verifica el stock y si es mayor a 0 lo agrega al carrito se le pasa el boton para agregarle el estilo de desactivado si no tiene mas stock
                    agregarCarrito(p, botonAgregar);
                    //Cada bez que se clieckea se llama a la funcion que hace que se descarive temporalmetne la funcion de comprar para desactivar clicks seguidos
                    botonActivado(botonAgregar);
                    // agregarAlCarrito(p);
                });
                const stockDisponible = actualizarStock(p)
                if (stockDisponible === 0) {
                    botonDesactivado(botonAgregar)
                }
                fragmento.appendChild(tarjeta);
            }
        })
        gridElements.appendChild(fragmento);
    } else {
        mensajeError("No se encontraron productos", gridElements);
    }
}
//LLAMADA A FUNCION
cargarProductos(todosProductos);
//Cargar Categorias al aside
const cargarCategorias = (categorias: ICategory[]) => {

    //getCategoriasBtn.innerHTML = "";
    categorias.forEach((c) => {
        const botonCategoria = document.createElement("button")
        botonCategoria.classList.add("cat-btn")
        botonCategoria.innerText = `${c.nombre}`
        getCategoriasBtn.appendChild(botonCategoria);
    })
}
cargarCategorias(todasCategorias);

getCategoriasBtn.addEventListener("click", (e) => {
    // e.target es el elemento exacto que tocaste
    getCategoriasBtn.querySelector(".cat-btn.activo")?.classList.remove("activo");
    const elemento = e.target as HTMLElement;
    if (elemento.classList.contains("cat-btn")) {
        elemento.classList.add("activo");

        const nombreCategoria = elemento.innerText;
        if (nombreCategoria === "Todos los productos") {
            cargarProductos(todosProductos);
            productosEncontrados(todosProductos);
            return;
        }
        // filtro los productos recorro sus categoriasy me fijo si alguna de las categorias se llama igual a la categoria que toque
        const filtrados: Product[] = todosProductos.filter(p =>
            p.categoria.nombre === nombreCategoria);
        cargarProductos(filtrados);
        productosEncontrados(filtrados);
    }

});
//Ordenamiento
const ordenarProductos = (criterio: string, lista: Product[]): Product[] => {
    // Copiamos el array para no mutar la fuente original con el .sort()
    const listaOrdenada = [...lista];

    switch (criterio) {
        case "nombre-az":
            return listaOrdenada.sort((a, b) => a.nombre.localeCompare(b.nombre));

        case "nombre-za":
            return listaOrdenada.sort((a, b) => b.nombre.localeCompare(a.nombre));

        case "precio-asc":
            return listaOrdenada.sort((a, b) => a.precio - b.precio);

        case "precio-desc":
            return listaOrdenada.sort((a, b) => b.precio - a.precio);

        default:
            // Si es "predeterminado", los ordena por su ID original
            return listaOrdenada.sort((a, b) => a.id - b.id);
    }
};


selectorOrden.addEventListener("change", () => {
    const criterio = selectorOrden.value;
    const productosOrdenados = ordenarProductos(criterio, todosProductos);
    cargarProductos(productosOrdenados);
});


inputBuscar.addEventListener("input", () => {
    //console.log(e.target.value);
    const busqueda = inputBuscar.value.toLowerCase().trim();
    //(pokemon) => { ... }
    //Es una arrow function. Por cada elemento del arreglo, JavaScript "toma" ese objeto y lo nombra temporalmente pokemon para poder trabajar con sus propiedades.
    const resultado = todosProductos.filter((producto) => {
        const coincideNombre = producto.nombre.toLowerCase().includes(busqueda);
        const coincideDescripcion = producto.descripcion.toLowerCase().includes(busqueda);
        return coincideNombre || coincideDescripcion;

    })
    //se va a llamar la funcion mostrarPokemones por cada letra que escribas
    cargarProductos(resultado);
    productosEncontrados(resultado);
})


//BOTON AGREGAR AL CARRITO
export const agregarCarrito = (producto: Product, container: HTMLButtonElement) => {
    const productoExistente = carrito.find(item => item.producto.id === producto.id);
    let stockDisponible = actualizarStock(producto)
    if (productoExistente) {
        if (stockDisponible > 0) {
            productoExistente.cantidad += 1;
            addProductToCart(carrito);
            actualizarBadgeCarrito();
            stockDisponible = producto.stock - (productoExistente?.cantidad ?? 0);
            if (stockDisponible === 0) {
                botonDesactivado(container);
            }
        } else {
            botonDesactivado(container);

        }
    } else {
        carrito.push({producto, cantidad: 1});
        addProductToCart(carrito);
        actualizarBadgeCarrito();
    }
    //estilo del boton al agregar al carrito


}


menuToggleBtn.addEventListener("click", (e) => {
    // Evitamos que el click se propague al body inmediatamente
    e.stopPropagation();

    // Intercambia la clase: si la tiene la saca, si no la tiene la pone
    barraLateral.classList.toggle("activo");
});

//Cerrar el menú si el usuario toca la pantalla afuera de la barra
document.addEventListener("click", (e) => {
    const objetivo = e.target as HTMLElement;

    // Si el menú está abierto y el click no fue dentro del menú  lo cerramos
    if (barraLateral.classList.contains("activo") &&
        !barraLateral.contains(objetivo)) {
        barraLateral.classList.remove("activo");
    }
});

// Si seleccionan una categoría en móvil, cerramos el menú automáticamente
getCategoriasBtn.addEventListener("click", (e) => {
    const elemento = e.target as HTMLElement;
    if (elemento.classList.contains("cat-btn")) {
        // Cerramos el menú para que el usuario vea los productos filtrados de inmediato
        barraLateral.classList.remove("activo");
    }
});



