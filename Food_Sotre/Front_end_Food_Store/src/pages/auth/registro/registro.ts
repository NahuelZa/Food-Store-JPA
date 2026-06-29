import type { IUser } from "../../../types/IUser";


const form = document.getElementById("reg_form") as HTMLFormElement;
const errorMensaje = document.getElementById("Error") as HTMLDivElement

form.addEventListener("submit", (e: SubmitEvent) => {
  e.preventDefault();
  const data = new FormData(form)
  const email = data.get("email") as string
  const password = data.get("password") as string
  errorMensaje.innerHTML = "";



  if (email && password) {
    const usuario: IUser = {
      email: email,
      role: "admin",
      loggedIn: false,
      password: password,

    }
    //Obtener datos de local Storage y agregar nuevos
    const localData = localStorage.getItem("users");
    //"Buscá en el disco si hay usuarios. Si hay, traelos y convertilos en una lista de verdad; si no hay nada, dame una lista vacía para empezar a trabajar".
    const usuariosTotales: IUser[] = localData ? JSON.parse(localData) : [];
    //verifico si el usuario existe con el mail
    if (!usuariosTotales.some(usuario => usuario.email === email)) {
      usuariosTotales.push(usuario);
      //  Guardamos la lista completa actualizada
      const parseUser = JSON.stringify(usuariosTotales)
      localStorage.setItem("users", parseUser);
      const mensajeexito = document.createElement("h2")
      mensajeexito.textContent = "Usuario exitosamente registrado"
      mensajeexito.style.color = "rgb(0, 209, 28)"
      errorMensaje?.appendChild(mensajeexito)
      form.reset();
    }
    else{
      const mensajeError = document.createElement("h2")
      mensajeError.textContent = "Usuario ya existe"
      mensajeError.style.color = "#f00"
      errorMensaje?.appendChild(mensajeError)

    }
    //  Empujamos el nuevo usuario al array de la lista



    //errorMensaje?.classList.remove("--errorMensaje") 
  }
  else {
    const mensajeError = document.createElement("h2")
    mensajeError.textContent = "No ingreso todos los campos"
    mensajeError.style.color = "#f00"
    errorMensaje?.appendChild(mensajeError)
    //errorMensaje?.classList.add("--errorMensaje")

  }

})
