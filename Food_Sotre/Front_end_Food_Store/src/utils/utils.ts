import type {ElementoCarrito} from "../types/elementosCarrito.ts";


export const addProductToCart = (carrito: ElementoCarrito[]) => {
  const parseProduct = JSON.stringify(carrito);
  localStorage.setItem("cart", parseProduct);
};
export const getCart = (): ElementoCarrito[] => {
  const data = localStorage.getItem("cart");
  // Si hay datos, los convertimos a objeto; si no, devolvemos un array vacío
  return data ? JSON.parse(data) : [];
};
export const removeCart = () => {
  localStorage.removeItem("cart");
};
export const removeProduct = (id: number) => {
  const carrito = getCart();
  const updatedCart = carrito.filter((item) => item.producto.id !== id);
  addProductToCart(updatedCart);
}

