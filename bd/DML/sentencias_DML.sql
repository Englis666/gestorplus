/* ************************************************************************************* */
/* -------------------------- DATA MANIPULATION LANGUAGE ------------------------------- */
/* ***************************************************************************************
        ____  __  __ _        ____ _____ ____ _____ ___  ____  ____  _    _   _ ____
        |  _ \|  \/  | |      / ___| ____/ ___|_   _/ _ \|  _ \|  _ \| |  | | | / ___|
        | | | | |\/| | |     | |  _|  _| \___ \ | || | | | |_) | |_) | |  | | | \___ \
        | |_| | |  | | |___  | |_| | |___ ___) || || |_| |  _ <|  __/| |__| |_| |___) |
        |____/|_|  |_|_____|  \____|_____|____/ |_| \___/|_| \_\_|   |_____\___/|____/

/* ***************************************DML UNA TABLA *********************************  */ */

/* 01. Insertar un usuario (una tabla) */
INSERT INTO usuario (num_doc, nombres, apellidos, email, tipodDoc, password, estado, hojadevida_idHojadevida, rol_idrol)
VALUES (1001, 'Juan', 'Pérez', 'juan.perez@email.com', 'CC', '1234segura', 1, 1, 2);

/* 02. Actualizar el correo de un usuario (una tabla) */
UPDATE usuario
SET email = 'juan.perez@nuevo.com'
WHERE num_doc = 1001;

/* 03. Eliminar un usuario (una tabla) */
DELETE FROM usuario
WHERE num_doc = 1001;

/* 04. Consultar todos los usuarios activos (una tabla) */
SELECT * FROM usuario
WHERE estado = 1;

/* 05. Consultar usuarios y su rol (multitabla) */
SELECT u.num_doc, u.nombres, u.apellidos, r.nombreRol
FROM usuario u
JOIN rol r ON u.rol_idrol = r.idrol;

/* 06. Consultar ausencias de un usuario específico (multitabla) */
SELECT a.idausencia, a.fechaInicio, a.fechaFin, u.nombres, u.apellidos
FROM ausencia a
JOIN usuario u ON a.usuario_num_doc = u.num_doc
WHERE u.num_doc = 1001;

/* 07. Consultar usuarios con cantidad de ausencias (multitabla, agregación) */
SELECT u.num_doc, u.nombres, COUNT(a.idausencia) AS total_ausencias
FROM usuario u
LEFT JOIN ausencia a ON u.num_doc = a.usuario_num_doc
GROUP BY u.num_doc, u.nombres;

/* 08. Consultar usuarios y sus vacaciones pendientes (multitabla, condición) */
SELECT u.nombres, u.apellidos, v.fechaInicio, v.fechaFin
FROM usuario u
JOIN vacacion v ON u.num_doc = v.usuario_num_doc
WHERE v.estadoVacacion = 'Pendiente';

/* 09. Insertar una ausencia (una tabla) */
INSERT INTO ausencia (idausencia, fechaInicio, fechaFin, tipoAusencia, justificada, usuario_num_doc)
VALUES (1, '2024-06-01', '2024-06-03', 'Enfermedad', 'No', 1001);

/* 10. Insertar una vacación (una tabla) */
INSERT INTO vacacion (idvacacion, fechaInicio, fechaFin, estadoVacacion, usuario_num_doc)
VALUES (1, '2024-07-01', '2024-07-15', 'Pendiente', 1001);


/* ***************************************DML MULTITABLA JOIN *********************************  */ */

/* Consultar usuarios y su rol */
SELECT u.num_doc, u.nombres, u.apellidos, r.nombreRol
FROM usuario u
JOIN rol r ON u.rol_idrol = r.idrol;

/* Consultar ausencias con nombre de usuario */
SELECT a.idausencia, a.fechaInicio, a.fechaFin, u.nombres, u.apellidos
FROM ausencia a
JOIN usuario u ON a.usuario_num_doc = u.num_doc;

/* Consultar permisos activos con nombre de usuario */
SELECT p.idPermisos, p.tipo, p.fechaInicio, p.fechaFin, p.estadoPermiso, u.nombres
FROM permiso p
JOIN usuario u ON p.usuario_num_doc = u.num_doc
WHERE p.estadoPermiso = 'Activo';

/* Consultar publicaciones y cantidad de postulaciones */
SELECT pub.idPublicacion, pub.titulo, COUNT(pos.idpostulacion) AS total_postulaciones
FROM publicacion pub
LEFT JOIN postulacion pos ON pub.idPublicacion = pos.publicacion_idPublicacion
GROUP BY pub.idPublicacion, pub.titulo;

/* Consultar convocatorias y su cargo */
SELECT c.idconvocatoria, c.nombreConvocatoria, ca.nombreCargo
FROM convocatoria c
JOIN cargo ca ON c.cargo_idcargo = ca.idcargo;
