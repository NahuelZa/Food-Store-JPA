# Food-Store - Sistema de Gestión de Pedidos de Comida
Proyecto final para Programacion III

Este proyecto consiste en el desarrollo del **Trabajo Final Integrador** para la **Tecnicatura Universitaria en Programación (UTN)**. Se trata de un sistema enfocado en un negocio de comidas, diseñado para gestionar de manera eficiente categorías, productos, usuarios y el flujo completo de pedidos a través de una arquitectura backend limpia y robusta basada en una interfaz de consola interactiva.

## Tecnologías y Herramientas Utilizadas
* **Lenguaje de Programación:** Java 17 / 25
* **Framework Principal:** Spring Boot 
* **Persistencia y ORM:** JPA / Hibernate
* **Base de Datos:** H2 Database 
* **Gestor de Dependencias:** Gradle
  
## Prerrequisitos

* Antes de comenzar, asegúrate de tener instalado en tu equipo:
* Java Development Kit (JDK): Versión 17 o superior.

## Configuración de la Base de Datos (H2)
spring.application.name=demo-config
server.port=8090

# Configuración para archivo local H2
* spring.datasource.url=jdbc:h2:file:./data/jpa_db
* spring.datasource.driverClassName=org.h2.Driver
* spring.datasource.username=sa
* spring.datasource.password=

# Consola Web de H2
* spring.h2.console.enabled=true
* spring.h2.console.path=/h2-console

# Configuración JPA
* spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
* spring.jpa.show-sql=true
* spring.jpa.properties.hibernate.format_sql=true
* spring.jpa.hibernate.ddl-auto=update

## Inicializarcion del Proyecto

# Clonar el proyecto
git clone [https://github.com/NahuelZa/Food-Store.git](https://github.com/NahuelZa/Food-Store.git)

Para levantar el servidor de desarrollo del backend utilizando un IDE (como IntelliJ IDEA o Eclipse), sigue estos pasos:

1. **Acceder al directorio raíz** del repositorio clonado.
2. **Abrir la carpeta del proyecto** desde el IDE seleccionando la ruta y dirigirse a la clase principal navegando por la estructura de carpetas:
   ```text
   Back_end Food Store/plantilla-foodstore-jpa/src/main/java/com/tp/jpa/Main.java
  Ejecutar el método main
  
  En caso de que el IDE no reconozca gradle automaticamente hacer click derecho en el build.gradle y seleccionar 
  * Load Gradle Project (o Link Gradle Project)
  
**Para el Front End**
* Dirigirse al directorio del Front-end en la terminal del IDE
 ```text
\Food_Sotre\Front_end_Food_Store
 ```
Ejecutar "pnpm dev" en consola para iniciar el localhost
