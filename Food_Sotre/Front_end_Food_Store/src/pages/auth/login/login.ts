
import { navigate } from "../../../utils/navigate";
import usuarios from "../../../data/usuarios.json";

const form = document.getElementById("form") as HTMLFormElement;
const inputEmail = document.getElementById("email") as HTMLInputElement;
const inputPassword = document.getElementById("password") as HTMLInputElement;
const errorMensaje = document.getElementById("error") as HTMLDivElement;
//const selectRol = document.getElementById("rol") as HTMLSelectElement;

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  errorMensaje.innerHTML = ""
  const valueEmail = inputEmail.value;
  const valuePassword = inputPassword.value;
  //const valueRol = selectRol.value as Rol;


const usuarioEncontrado = usuarios.find(
    (user) => user.mail === valueEmail && user.password === valuePassword
  );
if(!usuarioEncontrado){
    const mensajeError = document.createElement("h2")
                mensajeError.textContent = "Usuario no existe"
                mensajeError.style.color = "#f00"
                errorMensaje?.appendChild(mensajeError)
    }
else{
    sessionStorage.setItem("usuarioLogueado", JSON.stringify(usuarioEncontrado));
    if(usuarioEncontrado.rol=="USUARIO"){
        navigate("/src/pages/store/home/home.html")
        }
    else if(usuarioEncontrado.rol=="ADMIN"){
        navigate("/src/pages/admin/home/home.html")
            }
    }



  /*const localData = localStorage.getItem("users");
  const usuariosTotales: IUser[] = localData ? JSON.parse(localData) : [];

  const usuarioEncontrado = usuariosTotales.find(usuario =>
    usuario.email === valueEmail && usuario.password === valuePassword
  );
  if (usuarioEncontrado){
    usuarioEncontrado.loggedIn=true
    //si lo encuentra lo setea en userData y lo reemplaza
    localStorage.setItem("userData", JSON.stringify(usuarioEncontrado));
    if(usuarioEncontrado.role==="client"){
      navigate("/src/pages/client/home/home.html");
    }
    else{
      navigate("/src/pages/admin/home/home.html")
    }
    
  }
  else {
    const mensajeError = document.createElement("h2")
    mensajeError.textContent = "Usuario no existe"
    mensajeError.style.color = "#f00"
    errorMensaje?.appendChild(mensajeError)

  }*/




});
