package com.tp.jpa;

import com.tp.jpa.model.enums.EstadoPedido;
import com.tp.jpa.model.*;
import com.tp.jpa.model.enums.FormaPago;
import com.tp.jpa.model.enums.Rol;
import com.tp.jpa.repository.CategoriaRepository;
import com.tp.jpa.repository.PedidoRepository;
import com.tp.jpa.repository.ProductoRepository;
import com.tp.jpa.repository.UsuarioRepository;

import java.util.List;
import java.util.Locale;
import java.util.Optional;
import java.util.Scanner;

/**
 * Clase principal: menú de consola del sistema Food Store.
 * Orden de uso natural: Categorías -> Productos -> Usuarios -> Pedidos.
 */
public class Main {

    private static final Scanner scanner = new Scanner(System.in);

    private static final CategoriaRepository categoriaRepository = new CategoriaRepository();
    private static final ProductoRepository productoRepository = new ProductoRepository();
    private static final UsuarioRepository usuarioRepository = new UsuarioRepository();
    private static final PedidoRepository pedidoRepository = new PedidoRepository();

    public static void main(String[] args) {
        boolean salir = false;
        while (!salir) {
            System.out.println();
            System.out.println("===== FOOD STORE - MENÚ PRINCIPAL =====");
            System.out.println("1. Gestionar Categorías");
            System.out.println("2. Gestionar Productos");
            System.out.println("3. Gestionar Usuarios");
            System.out.println("4. Gestionar Pedidos");
            System.out.println("5. Reportes");
            System.out.println("0. Salir");
            System.out.print("Opcion: ");
            String op = scanner.nextLine().trim();
            switch (op) {
                case "1":
                    menuCategorias();
                    break;
                case "2":
                    menuProductos();
                    break;
                case "3":
                    menuUsuarios();
                    break;
                case "4":
                    menuPedidos();
                    break;
                case "5":
                    menuReportes();
                    break;
                case "0":
                    salir = true;
                    break;
                default:
                    System.out.println("Opcion invalida");
            }
        }

        System.out.println("Aplicacion finalizada");
    }

    // ── Submenús ─────────────────────────────────────────────────

    private static void menuCategorias() {
        int opcionSubCat = -1;
        while (opcionSubCat != 0) {
            System.out.println("\n--- SUBMENU CATEGORÍAS ---");
            System.out.println("1. Alta");
            System.out.println("2. Baja Logica");
            System.out.println("3. Modificacion");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Opcion: ");
            try {
                opcionSubCat = Integer.parseInt(scanner.nextLine());
                switch (opcionSubCat) {
                    case 1:
                        altaCategoria();
                        break;
                    case 2:
                        bajaCategoria();
                        break;
                    case 3:
                        modificacionCategoria();
                        break;
                    case 4:
                        listadoCategorias();
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("Opcion invalida");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error de entrada");
            }
        }
    }

    private static void altaCategoria() {
        System.out.println("Alta de Nueva Categoria");

        System.out.print("Nombre: ");
        String nombre = scanner.nextLine().trim();

        if (nombre.isEmpty() || nombre.matches("^\\d.*")) {
            System.out.println("ERROR: El nombre no puede estar vacio ni comenzar con numeros");
            return;
        }

        System.out.print("Descripcion: ");
        String descripcion = scanner.nextLine().trim();


        Categoria nuevaCategoria = Categoria.builder()
                .nombre(nombre)
                .descripcion(descripcion)
                .eliminado(false)
                .build();


        try {
            categoriaRepository.guardar(nuevaCategoria);

            System.out.println("Categoria guardada con exito");
            System.out.println("ID generado: " + nuevaCategoria.getId());
        } catch (Exception e) {
            System.out.println("Error : " + e.getMessage());
            e.printStackTrace();
        }
    }

    private static List<Categoria> listadoCategorias() {
        List<Categoria> list = categoriaRepository.listarActivos();
        if (list.isEmpty()) {
            System.out.println("No exiten categorias. Ingrese nuevas: ");
            altaCategoria();
            list = categoriaRepository.listarActivos();
            if (list.isEmpty()) return list;
        }

        System.out.println("LISTADO DE CATEGORIAS");
        for (Categoria c : list) {
            System.out.println("ID: " + c.getId() +
                    " | Nombre: " + c.getNombre() +
                    " | Descripcion: " + c.getDescripcion());
        }

        return list;
    }

    private static void bajaCategoria() {
        System.out.println("Baja de Categoria");
        System.out.println("Categorias disponibles: ");
        List<Categoria> categorias = listadoCategorias();
        if (categorias.isEmpty()) return;
        System.out.print("Ingrese el ID de la categoria a dar de baja: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            boolean eliminado = categoriaRepository.eliminarLogico(id);
            if (eliminado) {
                System.out.println("Categoria con ID " + id + " dada de baja correctamente");
            } else {
                System.out.println("ERROR: No se encontro una categoria activa con ese ID");
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: El ID debe ser un numero valido");
        } catch (Exception e) {
            System.out.println("Error inesperado: " + e.getMessage());
        }
    }

    private static void modificacionCategoria() {
        System.out.println("Modificacion de Categoria");
        List<Categoria> lista = listadoCategorias();
        if (lista.isEmpty()) {
            System.out.println("No existen categorias para modificar");
            return;
        }
        System.out.print("Ingrese el ID de la categoria a modificar: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Categoria> categoriaOpt = categoriaRepository.buscarPorId(id);
            if (categoriaOpt.isEmpty() || categoriaOpt.get().isEliminado()) {
                System.out.println("ERROR: Categoria no encontrada o inactiva");
                return;
            }
            Categoria categoria = categoriaOpt.get();
            System.out.println("Valores actuales -> Nombre: " + categoria.getNombre() +
                    " | Descripcion: " + categoria.getDescripcion());
            System.out.print("Nuevo Nombre (Enter para conservar): ");
            String nNombre = scanner.nextLine().trim();
            System.out.print("Nueva Descripcion (Enter para conservar): ");
            String nDesc = scanner.nextLine().trim();
            if (!nNombre.isEmpty()) {
                categoria.setNombre(nNombre);
            }
            if (!nDesc.isEmpty()) {
                categoria.setDescripcion(nDesc);
            }
            categoriaRepository.guardar(categoria);
            System.out.println("Modificacion completada con exito");
        } catch (NumberFormatException e) {
            System.out.println("ERROR: ID no valido");
        } catch (Exception e) {
            System.out.println("Ocurrio un error: " + e.getMessage());
        }
    }


    //PRODUCTOS
    private static void menuProductos() {
        int opcion = -1;
        while (opcion != 0) {
            System.out.println("\nMENU PRODUCTOS ");
            System.out.println("1. Alta");
            System.out.println("2. Baja Logica");
            System.out.println("3. Modificacion");
            System.out.println("4. Listado");
            System.out.println("0. Volver");
            System.out.print("Opcion: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                switch (opcion) {
                    case 1:
                        altaProducto();
                        break;
                    case 2:
                        bajaProducto();
                        break;
                    case 3:
                        modificacionProducto();
                        break;
                    case 4:
                        listadoProductos();
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("Opcion invalida");
                }
            } catch (NumberFormatException e) {
                System.out.println("Ingrese valor valido");
            }
        }
    }

    private static void altaProducto() {
        System.out.println("Alta de Producto");
        List<Categoria> categorias = listadoCategorias();
        if (categorias.isEmpty()) return;
        System.out.print("Ingrese ID de Categoria: ");
        try {
            Long catId = Long.parseLong(scanner.nextLine());
            Optional<Categoria> categoriaOpt = categoriaRepository.buscarConProductos(catId);
            if (categoriaOpt.isEmpty() || categoriaOpt.get().isEliminado()) {
                System.out.println("Categoria no encontrada o inactivo");
                return;
            }
            Categoria categoria = categoriaOpt.get();
            System.out.print("Nombre Producto: ");
            String nombre = scanner.nextLine().trim();
            System.out.print("Descripcion: ");
            String desc = scanner.nextLine().trim();
            System.out.print("Precio (> 0): ");
            Double precio = Double.parseDouble(scanner.nextLine().trim());
            System.out.print("Stock (>= 0): ");
            Integer stock = Integer.parseInt(scanner.nextLine());
            System.out.print("Disponible? (S/N): ");
            String disp = scanner.nextLine().trim();
            Boolean disponible = disp.equalsIgnoreCase("S");
            if (precio <= 0 || stock < 0 || nombre.isEmpty()) {
                System.out.println("ERROR: Datos invalidos");
                return;
            }
            Producto nuevoProducto = Producto.builder()
                    .nombre(nombre)
                    .descripcion(desc)
                    .precio(precio)
                    .stock(stock)
                    .disponible(disponible)
                    .imagen("Imagen.jpg")
                    .build();
            categoria.getProductos().add(nuevoProducto);

            categoriaRepository.guardar(categoria);

            System.out.println("Producto creado con exito en la categoria: " + categoria.getNombre());

        } catch (NumberFormatException e) {
            System.out.println("ERROR: Ingrese datos numericos validos");
        } catch (Exception e) {
            System.out.println("Error al guardar: " + e.getMessage());
        }
    }


    private static List<Object[]> listadoProductos() {
        List<Object[]> resultados = productoRepository.listarProductosConCategoria();
        System.out.println("PRODUCTOS ACTIVOS");
        if (resultados.isEmpty()) {
            System.out.println("No se encontraron productos activos");
            return resultados;
        }
        for (Object[] fila : resultados) {
            Producto p = (Producto) fila[0];
            Categoria c = (Categoria) fila[1];

            System.out.println("ID: " + p.getId() +
                    " | Nombre: " + p.getNombre() +
                    " | Precio: $" + p.getPrecio() +
                    " | Stock: " + p.getStock() +
                    " | Disponible: " + (p.getDisponible() ? "Si" : "No") +
                    " | Categoria: " + c.getNombre());
        }
        return resultados;
    }

    private static void bajaProducto() {
        System.out.println("Baja Logica de Producto");
        listadoProductos();
        System.out.print("Ingrese el ID del Producto a dar de baja: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            boolean eliminado = productoRepository.eliminarLogico(id);
            if (eliminado) {
                System.out.println("Producto con ID " + id + " dado de baja correctamente");
            } else {
                System.out.println("ERROR: No se encontro un producto activo con ese ID");
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: El ID debe ser un valor numerico");
        } catch (Exception e) {
            System.out.println("Ocurrio un error inesperado: " + e.getMessage());
        }
    }


    private static void modificacionProducto() {
        System.out.println("Modificacion de Producto");
        List<Object[]> lista = listadoProductos();
        if (lista.isEmpty()) {
            System.out.println("No hay productos disponibles para modificar");
            return;
        }
        System.out.print("ID de Producto a modificar: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Producto> productoOpt = productoRepository.buscarPorId(id);
            if (productoOpt.isEmpty() || productoOpt.get().isEliminado()) {
                System.out.println("ERROR: Producto no encontrado o inactivo");
                return;
            }
            Producto p = productoOpt.get();
            System.out.println("Actuales -> Nombre: " + p.getNombre() +
                    " | Precio: $" + p.getPrecio() +
                    " | Stock: " + p.getStock());

            boolean valido = false;
            while (!valido) {
                System.out.print("Nuevo nombre (Enter para conservar): ");
                String nombreInput = scanner.nextLine().trim();
                if (!nombreInput.isEmpty()) {
                    if (nombreInput.length() <= 1) {
                        System.out.println("Ingrese nombre vaildo");
                        continue;
                    }
                    p.setNombre(nombreInput);
                }
                System.out.print("Nuevo precio (Enter para conservar): ");
                String precioInput = scanner.nextLine().trim();
                if (!precioInput.isEmpty()) {
                    try {
                        Double nuevoPrecio = Double.parseDouble(precioInput);
                        if (nuevoPrecio <= 0) {
                            System.out.println("El precio debe ser mayor a 0");
                            continue;
                        }
                        p.setPrecio(nuevoPrecio);
                    } catch (NumberFormatException e) {
                        System.out.println("Precio invalido");
                        continue;
                    }
                }
                System.out.print("Nuevo stock (Enter para conservar): ");
                String stockInput = scanner.nextLine().trim();
                if (!stockInput.isEmpty()) {
                    try {
                        Integer nuevoStock = Integer.parseInt(stockInput);
                        if (nuevoStock < 0) {
                            System.out.println("El stock debe ser >= 0");
                            continue;
                        }
                        p.setStock(nuevoStock);
                    } catch (NumberFormatException e) {
                        System.out.println("Stock invalido");
                        continue;
                    }
                }
                productoRepository.guardar(p);
                valido = true;
                System.out.println("Producto actualizado exitosamente!");
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: ID invalido");
        } catch (Exception e) {
            System.out.println("Error al actualizar: " + e.getMessage());
        }
    }

    //MENU USUARIOS
    private static void menuUsuarios() {
        int opcion = -1;
        while (opcion != 0) {
            System.out.println("\nMENU USUARIOS ");
            System.out.println("1. Alta");
            System.out.println("2. Baja Logica");
            System.out.println("3. Modificacion");
            System.out.println("4. Listado");
            System.out.println("5. Buscar por mail");
            System.out.println("0. Volver");
            System.out.print("Opcion: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                switch (opcion) {
                    case 1:
                        altaUsuario();
                        break;
                    case 2:
                        bajaUsuario();
                        break;
                    case 3:
                        modificacionUsuario();
                        break;
                    case 4:
                        listadoUsuarios();
                        break;
                    case 5:
                        buscarPorMail();
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("Opcion invalida");
                }
            } catch (NumberFormatException e) {
                System.out.println("Ingrese valor valido");
            }
        }
    }

    private static void altaUsuario() {
        System.out.println("Alta de Usuario");
        try {
            System.out.print("Ingrese nombre: ");
            String nombre = scanner.nextLine().trim();
            System.out.print("Ingrese apellido: ");
            String apellido = scanner.nextLine().trim();
            System.out.print("Ingrese mail: ");
            String mail = scanner.nextLine().trim();
            if (usuarioRepository.buscarPorMail(mail).isPresent()) {
                System.out.println("ERROR: Ya existe un usuario registrado con el mail: " + mail);
                return;
            }
            System.out.print("Ingrese celular: ");
            String celular = scanner.nextLine().trim();
            System.out.print("Ingrese contraseña: ");
            String contrasena = scanner.nextLine().trim();
            Rol rolSeleccionado = null;
            while (rolSeleccionado == null) {
                System.out.println("Opciones de rol:");
                int contador = 1;
                for (Rol rol : Rol.values()) {
                    System.out.println(contador + " - " + rol);
                    contador++;
                }
                System.out.print("Ingrese numero de rol: ");
                try {
                    int entrada = Integer.parseInt(scanner.nextLine());
                    if (entrada >= 1 && entrada <= Rol.values().length) {
                        rolSeleccionado = Rol.values()[entrada - 1];
                    } else {
                        System.out.println("Error: El numero debe estar entre 1 y " + Rol.values().length );
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Error: Entrada no valida. Ingrese un numero");
                }
            }

            if (nombre.isEmpty() || apellido.isEmpty() || mail.isEmpty() || contrasena.isEmpty()) {
                System.out.println("ERROR: Restricciones de validacion no superadas");
                return;
            }

            Usuario nuevoUsuario = Usuario.builder()
                    .nombre(nombre)
                    .apellido(apellido)
                    .mail(mail)
                    .celular(celular)
                    .contraseña(contrasena)
                    .rol(rolSeleccionado)
                    .build();

            usuarioRepository.guardar(nuevoUsuario);
            System.out.println("Usuario creado con exito onc ID: " + nuevoUsuario.getId());

        } catch (Exception ex) {
            System.out.println("Error inesperado al crear el usuario: " + ex.getMessage());
        }
    }

    private static List<Usuario> listadoUsuarios() {
        List<Usuario> list = usuarioRepository.listarActivos();
        if (list.isEmpty()) {
            System.out.println("No existen usuarios activos en la base de datos");
            return list;
        }
        System.out.println("LISTADO DE USUARIOS");
        for (Usuario user : list) {
            System.out.println("ID: " + user.getId() +
                    " | Nombre: " + user.getNombre() + " " + user.getApellido() +
                    " | Mail: " + user.getMail() +
                    " | Rol: " + user.getRol());
        }
        return list;
    }


    private static void bajaUsuario() {
        System.out.println("\nBaja Logica de Usuario");
        List<Usuario> lista = listadoUsuarios();
        if (lista.isEmpty()) {
            return;
        }
        System.out.print("Ingrese el ID del Usuario a dar de baja: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            boolean eliminado = usuarioRepository.eliminarLogico(id);
            if (eliminado) {
                System.out.println("Usuario con ID " + id + " dado de baja correctamente");
            } else {
                System.out.println("ERROR: No se encontro un usuario activo con ese ID");
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: El ID debe ser un valor numerico");
        } catch (Exception e) {
            System.out.println("error al intentar eliminar: " + e.getMessage());
        }
    }

    private static void modificacionUsuario() {
        System.out.println("\nModificacion de Usuario");
        List<Usuario> lista = listadoUsuarios();
        if (lista.isEmpty()) {
            return;
        }
        System.out.print("ID de Usuario a modificar: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Usuario> usuarioOpt = usuarioRepository.buscarPorId(id);
            if (usuarioOpt.isEmpty() || usuarioOpt.get().isEliminado()) {
                System.out.println("ERROR: Usuario no encontrado o inactivo");
                return;
            }
            Usuario u = usuarioOpt.get();
            System.out.println("Actuales -> Nombre: " + u.getNombre() +
                    " | Apellido: " + u.getApellido() +
                    " | Celular: " + u.getCelular() +
                    " | Mail: " + u.getMail());

            boolean valido = false;
            while (!valido) {
                System.out.print("Nuevo nombre (Enter para conservar): ");
                String nombreInput = scanner.nextLine().trim();
                if (!nombreInput.isEmpty()) u.setNombre(nombreInput);

                System.out.print("Nuevo Apellido (Enter para conservar): ");
                String apellidoInput = scanner.nextLine().trim();
                if (!apellidoInput.isEmpty()) u.setApellido(apellidoInput);

                System.out.print("Nuevo Celular (Enter para conservar): ");
                String celularInput = scanner.nextLine().trim();
                if (!celularInput.isEmpty()) u.setCelular(celularInput);

                System.out.print("Nuevo Mail (Enter para conservar): ");
                String mailInput = scanner.nextLine().trim();
                if (!mailInput.isEmpty()) u.setMail(mailInput);

                System.out.print("Nueva Contrasena: ");
                String passInput = scanner.nextLine().trim();
                if (!passInput.isEmpty()) {
                    u.setContraseña(passInput);
                } else {
                    System.out.println("La contrasnña es obligatoria");
                    continue;
                }
                usuarioRepository.guardar(u);
                valido = true;
                System.out.println("Usuario actualizado correctamente!");
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: ID invalido");
        } catch (Exception e) {
            System.out.println("Error al actualizar: " + e.getMessage());
        }
    }

    private static void buscarPorMail() {
        System.out.print("\nIngrese el mail del usuario a buscar: ");
        String mailInput = scanner.nextLine().trim();
        Optional<Usuario> usuarioOpt = usuarioRepository.buscarPorMail(mailInput);
        if (usuarioOpt.isPresent()) {
            Usuario u = usuarioOpt.get();
            System.out.println("ID: " + u.getId() +
                    " | Nombre: " + u.getNombre() +
                    " | Apellido: " + u.getApellido() +
                    " | Celular: " + u.getCelular() +
                    " | Mail: " + u.getMail() +
                    " | Rol: " + u.getRol());
        } else {
            System.out.println("No se encontoo ningun usuario activo con el mail: " + mailInput);
        }
    }

    private static void menuPedidos() {
        int opcion = -1;
        while (opcion != 0) {
            System.out.println("\n===== MENU PEDIDOS =====");
            System.out.println("1. Alta");
            System.out.println("2. Baja Logica");
            System.out.println("3. Modificar estado");
            System.out.println("4. Listado");
            System.out.println("5. Buscar pedidos por Usuario");
            System.out.println("6. Buscar pedidos por Estado");
            System.out.println("0. Volver");
            System.out.print("Opcion: ");
            try {
                opcion = Integer.parseInt(scanner.nextLine());
                switch (opcion) {
                    case 1:
                        altaPedido();
                        break;
                    case 2:
                        bajaPedido();
                        break;
                    case 3:
                        cambiarEstado();
                        break;
                    case 4:
                        listadoPedidos();
                        break;
                    case 5:
                        buscarPedidoPorUsuario();
                        break;
                    case 6:
                        buscarPedidoPorEstado();
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("Opcion invalida");
                }
            } catch (NumberFormatException e) {
                System.out.println("Ingrese un valor valido numerico");
            }
        }
    }


    private static void altaPedido() {
        System.out.println("\nAlta de Pedido");
        List<Usuario> usuarios = listadoUsuarios();
        if (usuarios.isEmpty()) return;
        System.out.print("Ingrese ID de Usuario: ");
        Long userId = Long.parseLong(scanner.nextLine());
        Optional<Usuario> usuarioOpt = usuarioRepository.buscarConPedidos(userId);
        if (usuarioOpt.isEmpty()) {
            System.out.println("Usuario no encontrado");
            return;
        }
        Usuario usuario = usuarioOpt.get();

        FormaPago formaPago = null;
        while (formaPago == null) {
            System.out.println("Opciones de pago:");
            for (int i = 0; i < FormaPago.values().length; i++) {
                System.out.println((i + 1) + " - " + FormaPago.values()[i]);
            }
            System.out.print("Ingrese opcion: ");
            try {
                int op = Integer.parseInt(scanner.nextLine());
                if (op >= 1 && op <= FormaPago.values().length) formaPago = FormaPago.values()[op - 1];
            } catch (NumberFormatException e) {
                System.out.println("Opcion invalida");
            }
        }

        Pedido nuevoPedido = Pedido.builder()
                .formaPago(formaPago)
                .build();

        boolean terminar = false;
        while (!terminar) {
            List<Object[]> lista = listadoProductos();
            if (lista.isEmpty()) {
                return;
            }
            System.out.print("ID de producto a agregar: ");
            Long prodId = Long.parseLong(scanner.nextLine());

            Optional<Producto> producto = productoRepository.buscarPorId(prodId);
            if (producto.isPresent()) {
                Producto p = producto.get();
                System.out.print("Cantidad: ");
                int cantidad = Integer.parseInt(scanner.nextLine());

                if (p.getStock() >= cantidad) {
                    nuevoPedido.addDetallePedido(cantidad, p);
                    p.setStock(p.getStock() - cantidad);
                    productoRepository.guardar(p);
                    System.out.println("item agregado");
                } else {
                    System.out.println("Stock insuficiente");
                }
            }
            System.out.print("¿Agregar otro item? (S/N): ");
            if (scanner.nextLine().equalsIgnoreCase("N")) terminar = true;
        }
        usuario.addPedido(nuevoPedido);
        usuarioRepository.guardar(usuario);
        System.out.println("Pedido creado exitosamente con total: $" + nuevoPedido.getTotal());
    }

    private static void listadoPedidos() {
        List<Pedido> lista = pedidoRepository.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No existen pedidos registrados en la base de datos");
            return;
        }
        System.out.println("\nLISTADO DE PEDIDOS");
        for (Pedido p : lista) {
            System.out.println("ID: " + p.getId() +
                    " | Fecha: " + p.getFecha() +
                    " | Estado: " + p.getEstado() +
                    " | Forma de Pago: " + p.getFormaPago() +
                    " | Total: " + p.getTotal());
        }
    }


    private static void bajaPedido() {
        System.out.println("\nBaja Logica");
        List<Pedido> lista = pedidoRepository.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No existen pedidos registrados en la base de datos");
            return;
        }
        System.out.print("Ingrese ID  ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            boolean eliminado = pedidoRepository.eliminarLogico(id);
            if (eliminado) {
                System.out.println("Pedido con ID " + id + " dado de baja correctamente");
            } else {
                System.out.println("ERROR: No se encontro un pedido activo con ese ID");
            }
        } catch (NumberFormatException e) {
            System.out.println("ERROR: El ID debe ser un valor numerico");
        } catch (Exception e) {
            System.out.println("error inesperado al intentar dar de baja: " + e.getMessage());
        }
    }

    private static void cambiarEstado() {
        System.out.println("\nCambio de Estado de Pedidos");
        List<Pedido> lista = pedidoRepository.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No existen pedidos registrados en la base de datos");
            return;
        }
        System.out.print("Ingrese ID del Pedido: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            Optional<Pedido> pedidoOpt = pedidoRepository.buscarPorId(id);
            if (pedidoOpt.isEmpty() || pedidoOpt.get().isEliminado()) {
                System.out.println("ERROR: Pedido no encontrado o inactivo");
                return;
            }
            Pedido p = pedidoOpt.get();
            System.out.println("Estado actual: " + p.getEstado());
            EstadoPedido nuevoEstado = null;
            while (nuevoEstado == null) {
                System.out.println("Opciones de Estado:");
                int contador = 1;
                for (EstadoPedido estado : EstadoPedido.values()) {
                    System.out.println(contador + " - " + estado);
                    contador++;
                }
                System.out.print("Ingrese nuevo Estadoo: ");
                try {
                    int entrada = Integer.parseInt(scanner.nextLine());
                    if (entrada >= 1 && entrada <= EstadoPedido.values().length) {
                        nuevoEstado = EstadoPedido.values()[entrada - 1];
                    } else {
                        System.out.println("Error: El numero debe estar entre 1 y " + EstadoPedido.values().length);
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Error: Entrada no valida");
                }
            }
            p.setEstado(nuevoEstado);
            pedidoRepository.guardar(p);
            System.out.println("Estado actualizado correctamente");

        } catch (NumberFormatException e) {
            System.out.println("ERROR: El ID debe ser un numero");
        } catch (Exception e) {
            System.out.println("Error al actualizar estado: " + e.getMessage());
        }
    }

    private static void buscarPedidoPorUsuario() {
        System.out.println("\nBusqueda de Pedidos por Usuario");
        List<Usuario> lista = usuarioRepository.listarActivos();
        if (lista.isEmpty()) {
            System.out.println("No existen usuarios registrados en la base de datos");
            return;
        }
        System.out.print("Ingrese ID del Usuario para ver sus pedidos: ");
        try {
            Long id = Long.parseLong(scanner.nextLine());
            List<Pedido> pedidos = pedidoRepository.buscarPorUsuario(id);
            if (pedidos.isEmpty()) {
                System.out.println("Este usuario no tiene pedidos activos");
                return;
            }

            System.out.println("\nPedidos encontrados para el usuario ID " + id + ":");
            for (Pedido p : pedidos) {
                System.out.println("ID: " + p.getId() +
                        " | Fecha: " + p.getFecha() +
                        " | Estado: " + p.getEstado() +
                        " | Total: " + p.getTotal());
            }

        } catch (NumberFormatException e) {
            System.out.println("ERROR: El ID debe ser un valor numerico");
        } catch (Exception e) {
            System.out.println("Error al recuperar los pedidos: " + e.getMessage());
        }
    }

    private static void buscarPedidoPorEstado() {
        System.out.println("\nPedidos por Estado");
        EstadoPedido estadoSeleccionado = null;
        while (estadoSeleccionado == null) {
            System.out.println("Opciones de Estado:");
            int contador = 1;
            for (EstadoPedido estado : EstadoPedido.values()) {
                System.out.println(contador + " - " + estado);
                contador++;
            }

            System.out.print("Ingrese el numero de estado: ");
            try {
                int entrada = Integer.parseInt(scanner.nextLine());
                if (entrada >= 1 && entrada <= EstadoPedido.values().length) {
                    estadoSeleccionado = EstadoPedido.values()[entrada - 1];
                } else {
                    System.out.println("ERROR: El numero debe estar entre 1 y " + EstadoPedido.values().length);
                }
            } catch (NumberFormatException e) {
                System.out.println("ERROR: Entrada no valida");
            }
        }

        List<Pedido> pedidos = pedidoRepository.buscarPorEstado(estadoSeleccionado);
        if (pedidos.isEmpty()) {
            System.out.println("No se encontraron pedidos con el estado: " + estadoSeleccionado);
        } else {
            System.out.println("\nPedidos en estado " + estadoSeleccionado + ":");
            for (Pedido p : pedidos) {
                System.out.println("ID: " + p.getId() +
                        " | Fecha: " + p.getFecha() +
                        " | Total: $" + p.getTotal());
            }
        }
    }

    private static void menuReportes() {
        int opcionSubCat = -1;
        while (opcionSubCat != 0) {
            System.out.println("\n--- SUBMENU REPORTES ---");
            System.out.println("1. Productos por Categoria");
            System.out.println("2. Pedidos por usuario");
            System.out.println("3. Pedidos por Estado");
            System.out.println("4. Total Facturado");
            System.out.println("0. Volver");
            System.out.print("Opcion: ");
            try {
                opcionSubCat = Integer.parseInt(scanner.nextLine());
                switch (opcionSubCat) {
                    case 1:
                        productosPorCategoria();
                        break;
                    case 2:
                        pedidosPoorUsuario();
                        break;
                    case 3:
                        pedidosPoorEstado();
                        break;
                    case 4:
                        totalFacturado();
                        break;
                    case 0:
                        break;
                    default:
                        System.out.println("Opcion invalida");
                }
            } catch (NumberFormatException e) {
                System.out.println("Error de entrada");
            }
        }
    }

    private static void productosPorCategoria() {
        System.out.println("\nusqueda de Productos por Categoria");
        List<Categoria> categorias = listadoCategorias();
        if (categorias.isEmpty()) {
            System.out.println("No hay categorias disponibles");
            return;
        }
        System.out.print("Ingrese ID de la categoria: ");
        try {
            Long catId = Long.parseLong(scanner.nextLine());
            List<Producto> productos = productoRepository.buscarPorCategoria(catId);
            if (productos.isEmpty()) {
                System.out.println("No se encontraron productos disponibles en esta categoria");
                return;
            }

            System.out.println("\nProductos encontrados:");
            for (Producto p : productos) {
                System.out.println("ID: " + p.getId() +
                        " | Nombre: " + p.getNombre() +
                        " | Precio: $" + p.getPrecio() +
                        " | Stock: " + p.getStock());
            }

        } catch (NumberFormatException e) {
            System.out.println("ERROR: El ID debe ser un valor numerico");
        } catch (Exception e) {
            System.out.println("Ocurrio un error al buscar los productos: " + e.getMessage());
        }
    }

    public static void pedidosPoorUsuario() {
        buscarPedidoPorUsuario();
    }

    public static void pedidosPoorEstado() {
        buscarPedidoPorEstado();
    }

    public static void totalFacturado() {
        List<Pedido> pedidos = pedidoRepository.buscarPorEstado(EstadoPedido.TERMINADO);
        if (pedidos.isEmpty()) {
            System.out.println("No hay pedidos en estado TERMINADO para calcular el total");
            return;
        }
        double total = pedidos.stream()
                .mapToDouble(Pedido::getTotal)
                .sum();

        System.out.println("Total facturado: " + String.format(Locale.US, "$%.2f", total));
    }
}


