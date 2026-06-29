import type {Product} from "./product.ts";

export interface ElementoCarrito {
    producto: Product;
    cantidad: number;
}