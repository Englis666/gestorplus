# Creado por Englis Alexander Barros Osuna Desarrolador de software

# README Para estudios de Estilos y Componentes

Este archivo README está diseñado para estudiar los principales estilos y clases que utilicé en los componentes del front-end de mi aplicación. A continuación se describen los detalles de cómo estructuré y diseñé los componentes usando **Bootstrap** y estilos personalizados.

---

# GestorPlus Frontend

Este proyecto es el **frontend de GestorPlus**, una plataforma moderna para la gestión de talento humano y procesos administrativos en empresas.  
Desarrollado en **React**, utiliza componentes reutilizables, estilos personalizados y librerías populares para ofrecer una experiencia de usuario ágil, responsiva y profesional.

---

## Instalación y uso

1. **Instala las dependencias:**

   ```sh
   npm install
   ```

2. **Ejecuta la aplicación:**

   ```sh
   npm start
   ```

   Este comando ejecuta la aplicación en modo de desarrollo.\
   La página se recargará automáticamente cada vez que realices cambios.\
   También podrás ver cualquier error de lint en la consola.

3. **Corre las pruebas:**

   ```sh
   npm test
   ```

   Este comando lanza el corredor de pruebas en modo interactivo.

---

# Principales dependencias

Bootstrap: npm install bootstrap
Axios: npm install axios
React Router Dom: npm install react-router-dom
Material Icons: npm install @material-icons/font
Chart.js y react-chartjs-2: npm install chart.js react-chartjs-2
jsPDF: npm install jspdf
react-big-calendar y moment: npm install react-big-calendar moment
animate.css: npm install animate.css

---

---

## Estilos para estudiar

En este documento, te explicaré los principales estilos y clases que utilicé para construir la interfaz de usuario en los diferentes componentes de la aplicación. Están organizados para que puedas estudiarlos y entender cómo se integran con el diseño responsivo.

### 1. `NavbarClosed` (Componente del Navbar)

Este componente es el menú lateral de la aplicación. Lo diseñé para ser completamente responsivo usando las clases de **Bootstrap**.

#### Estilos y clases:

- **Clases de Bootstrap**:

  - `col-12 col-md-3 col-lg-2`: Hice que el menú ocupe el 100% del ancho en pantallas pequeñas, el 25% en pantallas medianas, y el 16.6% en pantallas grandes.
  - `d-flex align-items-center`: Usé Flexbox para centrar los elementos del menú verticalmente.
  - `text-dark`: Apliqué un color oscuro al texto para asegurar que fuera legible.
  - `text-decoration-none`: Eliminé los subrayados de los enlaces para tener un diseño más limpio.
  - `bg-light`: Usé esta clase para resaltar el fondo de un enlace cuando está activo o al pasar el ratón sobre él.

- **Estilos personalizados**:
  - `boxShadow`: Añadí una sombra difusa alrededor del menú para darle un diseño más elevado y moderno.
  - `transition`: Apliqué una transición suave cuando el usuario interactúa con los enlaces del menú.
  - `borderTopRightRadius`, `borderBottomRightRadius`: Redondeé las esquinas del menú para darle un toque más amigable y moderno.

# Libreria animate.css

Con esta libreria es facil animar las cosas la clase para animacion es

- `animate_animated animate_fadeInDown`

---

### 2. `TablaEmpleado` (Componente de Tabla)

El componente **TablaEmpleado** muestra las notificaciones de los empleados de manera responsiva.

#### Estilos y clases:

- **Clases de Bootstrap**:

  - `table-responsive`: Usé esta clase para que la tabla sea responsiva y se pueda desplazar horizontalmente en pantallas pequeñas.
  - `table-striped`: Apliqué rayas alternas en las filas de la tabla para mejorar la legibilidad.
  - `table-bordered`: Añadí bordes alrededor de la tabla y sus celdas para mejorar la claridad visual.
  - `table-hover`: La clase `table-hover` cambia el color de fondo de las filas cuando el ratón pasa sobre ellas.

- **Estilos personalizados**:
  - `maxHeight: "300px"`: Limité la altura del contenedor de la tabla para evitar que se extendiera demasiado.
  - `boxShadow`: Añadí una sombra al contenedor para darle un efecto de elevación.
  - `overflow: "auto"`: Permití el desplazamiento tanto vertical como horizontal en la tabla cuando el contenido excede el tamaño.
  - `borderBottom: "1px solid #fff"`: Le puse un borde inferior blanco a las filas para mejorar la estética y claridad.

---

### 3. `Estadisticas` (Componente de Estadísticas)

El componente **Estadisticas** muestra información visual con tarjetas. Estas tarjetas tienen un diseño atractivo y moderno.

### 4. `Calendario y moment` (Componente de CalendarioDeEntrevistas)

El componente **CalendarioDeEntrevistas** que esta en las vistas de admin y recursos humanos en la vista **Citas.jsx** usa una dependencia de react que es **npm install react-big-calendar moment** eso significa que son dos

## Calendario Usos{

npm:
react-big-calendar: Para el calendario.
moment: Para manejar fechas y horas.

## Estilos personalizados para los eventos:

Se usa eventPropGetter para aplicar estilos personalizados a los eventos del calendario (color azul, bordes redondeados, etc.).

Se usa tooltipAccessor para mostrar el título del evento como un tooltip al pasar el cursor sobre él.

## };

#### Estilos y clases:

- **Clases de Bootstrap**:

  - `container-fluid`: Utilicé esta clase para que el contenedor ocupe todo el ancho disponible.
  - `row`: Para organizar los elementos de forma flexible y responsiva.
  - `col-12 col-md-5 col-lg-6`: Hice que las tarjetas tengan un ancho proporcional según el tamaño de la pantalla (100% en pantallas pequeñas, 41.6% en pantallas medianas y 50% en pantallas grandes).
  - `card`: Esta clase crea las tarjetas, que son los contenedores de la información visual.
  - `d-flex justify-content-center`: Usé estas clases para centrar las tarjetas dentro de su contenedor.

- **Estilos personalizados**:
  - `borderRadius: "2rem"`: Redondeé las esquinas de las tarjetas para que se vean más suaves y modernas.
  - `boxShadow: "0px 4px 8px rgba(5, 2, 2, 0.3)"`: Añadí una sombra sutil a las tarjetas para que se vean elevadas sobre el fondo.
  - `padding: "1.4rem"`: Puse un relleno en las tarjetas para que el contenido no toque los bordes.
  - `height: "11rem"`, `width: "11rem"`: Definí un tamaño fijo para las tarjetas para que se mantuvieran proporcionales y bien alineadas.

# Licencia

Este frontend es propiedad de CodeAdvance.
Queda prohibida su copia, redistribución o uso no autorizado sin el consentimiento expreso de los autores.
Consulta el archivo LICENCIA en la raíz del proyecto para más detalles.
