import { logout } from "../src/utils/auth";
import type { IUser } from "../src/types/IUser";
import type { Rol } from "./types/Rol.ts";
import { getUSer } from "./utils/localStorage.ts";
import { navigate } from "./utils/navigate";



export const verificarUsuario = (rolRequerido: Rol) => {
    const user = getUSer()
    if (!user) {
        console.log("no existe en local");
        navigate("/src/pages/auth/login/login.html");
        return;
    } else {
        const parseUser: IUser = JSON.parse(user);
        if(parseUser.rol==="ADMIN") {
            return;
        }
        if (parseUser.rol !== rolRequerido) {

            if (parseUser.rol === "USUARIO"  ) {

                navigate("/src/pages/store/home/home.html")
                return
            }
            else {
                navigate("/src/pages/admin/home/home.html");
                return
            }
        }


    }
}

//El loguount funciona porque al ejecutar un import se tiene que leer todo el archivo y
// al leerlo se lee esta parte y se asigna el boton por eso es importante usar ? al inicio de 
//buttonLogout?.addEventListener ya que si en login necesito esta funcion pero no existe logout no explota
const buttonLogout = document.getElementById(
    "logoutButton"
) as HTMLButtonElement;

buttonLogout?.addEventListener("click", () => {
    console.log("holaa");
    logout();
});
