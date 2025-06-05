/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

const API_URL =
  process.env.NODE_ENV === "production" ? "/api/" : "http://localhost/api/";

export default API_URL;
