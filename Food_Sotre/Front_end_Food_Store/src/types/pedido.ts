
import type {IUsuario} from "./usuario.ts";
import type {IDetallePedido} from "./detallePedido.ts";

export interface IPedido {
    id: number;
    fecha: string;
    estado: "PENDIENTE" | "EN_PREPARACION" | "ENTREGADO"| "CANCELADO";
    formaPago: "TARJETA" | "EFECTIVO" | "TRANSFERENCIA";
    total: number;
    detalles: IDetallePedido[];
    usuarioDto:IUsuario;
}