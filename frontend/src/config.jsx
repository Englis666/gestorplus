/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

const API_URL = "http://localhost/"; // Dependiendo el entorno, puede ser localhost o la URL de producción
// En producción, puedes usar una variable de entorno para definir la URL
// Por ejemplo, en un archivo .env puedes definir REACT_APP_API_URL=http://api.example.com
// Y luego en este archivo puedes usar:
// const API_URL = process.env.REACT_APP_API_URL || "http://localhost";
// En este caso, si no se encuentra la variable de entorno, se usará localhost por defecto
// Esto es útil para evitar hardcodear la URL en el código y poder cambiarla fácilmente según el entorno
// Puedes usar esta URL en tu aplicación para hacer peticiones a la API
export default API_URL;
