import type {Rol} from "./Rol.ts";

export interface IUsuario {
    id: number,
    nombre: string,
    apellido: string,
    mail: string,
    celular: string,
    rol: Rol
}