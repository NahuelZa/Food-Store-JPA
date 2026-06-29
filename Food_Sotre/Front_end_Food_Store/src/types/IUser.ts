import type { Rol } from "./Rol";

export interface IUser {
  email: string;
  loggedIn: boolean;
  rol: Rol;
  password:string;
}
