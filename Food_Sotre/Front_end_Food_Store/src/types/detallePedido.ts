import type {Product} from "./product.ts";

export interface IDetallePedido{
    cantidad: number;
    subtotal: number;
    producto:Product
}
