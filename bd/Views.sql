-- Vista: Usuarios con su rol y estado
CREATE OR REPLACE VIEW vista_usuarios_roles AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos,
    u.email,
    u.tipodDoc,
    r.nombreRol,
    u.estado
FROM usuario u
JOIN rol r ON u.rol_idrol = r.idrol;

-- Vista: Jornadas con nombre de usuario
CREATE OR REPLACE VIEW vista_jornadas AS
SELECT 
    j.idJornada,
    j.fecha,
    j.horaEntrada,
    j.horaSalida,
    j.estadoJornada,
    u.nombres,
    u.apellidos
FROM jornada j
JOIN usuario u ON j.usuario_num_doc = u.num_doc;

-- Vista: Ausencias con nombre de usuario y estado
CREATE OR REPLACE VIEW vista_ausencias AS
SELECT 
    a.idausencia,
    a.fechaInicio,
    a.fechaFin,
    a.tipoAusencia,
    a.descripcion,
    a.justificada,
    a.fechaRegistro,
    u.nombres,
    u.apellidos,
    a.usuario_num_doc
FROM ausencia a
JOIN usuario u ON a.usuario_num_doc = u.num_doc;

-- Vista: Publicaciones con nombre de usuario y tipo de contrato
CREATE OR REPLACE VIEW vista_publicaciones AS
SELECT 
    p.idPublicacion,
    p.titulo,
    p.descripcion,
    p.fechaPublicacion,
    p.tipo_contrato,
    p.estado,
    u.nombres,
    u.apellidos
FROM publicacion p
JOIN usuario u ON p.usuario_num_doc = u.num_doc;

-- Vista: Permisos con nombre de usuario y estado
CREATE OR REPLACE VIEW vista_permisos AS
SELECT 
    pe.idPermisos,
    pe.tipo,
    pe.fechaInicio,
    pe.fechaFin,
    pe.estadoPermiso,
    u.nombres,
    u.apellidos
FROM permiso pe
JOIN usuario u ON pe.usuario_num_doc = u.num_doc;

-- Vista: Vacaciones con nombre de usuario y estado
CREATE OR REPLACE VIEW vista_vacaciones AS
SELECT 
    v.idvacacion,
    v.fechaInicio,
    v.fechaFin,
    v.estadoVacacion,
    u.nombres,
    u.apellidos
FROM vacacion v
JOIN usuario u ON v.usuario_num_doc = u.num_doc;

-- Vista: Convocatorias con nombre de cargo
CREATE OR REPLACE VIEW vista_convocatorias AS
SELECT 
    c.idconvocatoria,
    c.nombreConvocatoria,
    c.descripcion,
    c.salario,
    ca.nombreCargo,
    c.fecha_limite,
    c.fecha_apertura
FROM convocatoria c
JOIN cargo ca ON c.cargo_idcargo = ca.idcargo;

-- Vista: Postulaciones con usuario y convocatoria
CREATE OR REPLACE VIEW vista_postulaciones AS
SELECT 
    p.idpostulacion,
    p.estadoPostulacion,
    p.fecha_postulacion,
    u.nombres,
    u.apellidos,
    c.nombreConvocatoria
FROM postulacion p
JOIN usuario u ON p.usuario_num_doc = u.num_doc
JOIN convocatoria c ON p.convocatoria_idconvocatoria = c.idconvocatoria;

-- Vista: Notificaciones con nombre de usuario
CREATE OR REPLACE VIEW vista_notificaciones AS
SELECT 
    n.idnotificacion,
    n.descripcionNotificacion,
    n.estadoNotificacion,
    n.tipo,
    n.created_at,
    u.nombres,
    u.apellidos
FROM notificacion n
JOIN usuario u ON n.num_doc = u.num_doc;

-- Vista: Usuarios con cantidad de ausencias
CREATE OR REPLACE VIEW vista_usuarios_ausencias AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos,
    COUNT(a.idausencia) AS total_ausencias
FROM usuario u
LEFT JOIN ausencia a ON u.num_doc = a.usuario_num_doc
GROUP BY u.num_doc, u.nombres, u.apellidos;

-- Vista: Vacaciones pendientes por usuario
CREATE OR REPLACE VIEW vista_vacaciones_pendientes AS
SELECT 
    v.idvacacion,
    u.nombres,
    u.apellidos,
    v.fechaInicio,
    v.fechaFin,
    v.estadoVacacion
FROM vacacion v
JOIN usuario u ON v.usuario_num_doc = u.num_doc
WHERE v.estadoVacacion = 'Pendiente';

-- Vista: Permisos activos por usuario
CREATE OR REPLACE VIEW vista_permisos_activos AS
SELECT 
    pe.idPermisos,
    u.nombres,
    u.apellidos,
    pe.tipo,
    pe.fechaInicio,
    pe.fechaFin,
    pe.estadoPermiso
FROM permiso pe
JOIN usuario u ON pe.usuario_num_doc = u.num_doc
WHERE pe.estadoPermiso = 'Activo';

-- Vista: Publicaciones activas y cantidad de postulaciones
CREATE OR REPLACE VIEW vista_publicaciones_postulaciones AS
SELECT 
    p.idPublicacion,
    p.titulo,
    p.estado,
    COUNT(po.idpostulacion) AS total_postulaciones
FROM publicacion p
LEFT JOIN postulacion po ON p.idPublicacion = po.publicacion_idPublicacion
WHERE p.estado = 'Activa'
GROUP BY p.idPublicacion, p.titulo, p.estado;

-- Vista: Últimas notificaciones por usuario
CREATE OR REPLACE VIEW vista_ultimas_notificaciones AS
SELECT 
    n.idnotificacion,
    n.descripcionNotificacion,
    n.estadoNotificacion,
    n.created_at,
    u.nombres,
    u.apellidos
FROM notificacion n
JOIN usuario u ON n.num_doc = u.num_doc
WHERE n.created_at = (
    SELECT MAX(n2.created_at)
    FROM notificacion n2
    WHERE n2.num_doc = n.num_doc
);

-- Vista: Usuarios con total de permisos y vacaciones
CREATE OR REPLACE VIEW vista_usuarios_permisos_vacaciones AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos,
    COUNT(DISTINCT pe.idPermisos) AS total_permisos,
    COUNT(DISTINCT v.idvacacion) AS total_vacaciones
FROM usuario u
LEFT JOIN permiso pe ON u.num_doc = pe.usuario_num_doc
LEFT JOIN vacacion v ON u.num_doc = v.usuario_num_doc
GROUP BY u.num_doc, u.nombres, u.apellidos;

-- Vista: Convocatorias activas y total de postulaciones
CREATE OR REPLACE VIEW vista_convocatorias_postulaciones AS
SELECT 
    c.idconvocatoria,
    c.nombreConvocatoria,
    c.estado,
    COUNT(p.idpostulacion) AS total_postulaciones
FROM convocatoria c
LEFT JOIN postulacion p ON c.idconvocatoria = p.convocatoria_idconvocatoria
WHERE c.estado = 'Activa'
GROUP BY c.idconvocatoria, c.nombreConvocatoria, c.estado;

-- Vista: Permisos rechazados por usuario
CREATE OR REPLACE VIEW vista_permisos_rechazados AS
SELECT 
    pe.idPermisos,
    u.nombres,
    u.apellidos,
    pe.tipo,
    pe.fechaInicio,
    pe.fechaFin,
    pe.estadoPermiso
FROM permiso pe
JOIN usuario u ON pe.usuario_num_doc = u.num_doc
WHERE pe.estadoPermiso = 'Rechazado';

-- Vista: Ausencias justificadas por usuario
CREATE OR REPLACE VIEW vista_ausencias_justificadas AS
SELECT 
    a.idausencia,
    u.nombres,
    u.apellidos,
    a.tipoAusencia,
    a.fechaInicio,
    a.fechaFin,
    a.justificada
FROM ausencia a
JOIN usuario u ON a.usuario_num_doc = u.num_doc
WHERE a.justificada = 'Justificada';

-- Vista: Usuarios sin postulaciones
CREATE OR REPLACE VIEW vista_usuarios_sin_postulaciones AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos
FROM usuario u
LEFT JOIN postulacion p ON u.num_doc = p.usuario_num_doc
WHERE p.idpostulacion IS NULL;

-- Vista: Usuarios con su último inicio de sesión (requiere tabla de auditoría o logins)
CREATE OR REPLACE VIEW vista_usuarios_ultimo_login AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos,
    MAX(a.fecha) AS ultimo_login
FROM usuario u
JOIN auditoria a ON u.num_doc = a.usuario_afectado
WHERE a.accion = 'Login'
GROUP BY u.num_doc, u.nombres, u.apellidos;

-- Vista: Total de permisos, ausencias y vacaciones por usuario
CREATE OR REPLACE VIEW vista_usuarios_resumen_ausencias_permisos_vacaciones AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos,
    COUNT(DISTINCT pe.idPermisos) AS total_permisos,
    COUNT(DISTINCT a.idausencia) AS total_ausencias,
    COUNT(DISTINCT v.idvacacion) AS total_vacaciones
FROM usuario u
LEFT JOIN permiso pe ON u.num_doc = pe.usuario_num_doc
LEFT JOIN ausencia a ON u.num_doc = a.usuario_num_doc
LEFT JOIN vacacion v ON u.num_doc = v.usuario_num_doc
GROUP BY u.num_doc, u.nombres, u.apellidos;

-- Vista: Convocatorias cerradas y cantidad de postulaciones
CREATE OR REPLACE VIEW vista_convocatorias_cerradas_postulaciones AS
SELECT 
    c.idconvocatoria,
    c.nombreConvocatoria,
    c.estado,
    COUNT(p.idpostulacion) AS total_postulaciones
FROM convocatoria c
LEFT JOIN postulacion p ON c.idconvocatoria = p.convocatoria_idconvocatoria
WHERE c.estado = 'Cerrada'
GROUP BY c.idconvocatoria, c.nombreConvocatoria, c.estado;

-- Vista: Usuarios con permisos activos y vacaciones pendientes
CREATE OR REPLACE VIEW vista_usuarios_permisos_activos_vacaciones_pendientes AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos,
    COUNT(DISTINCT pe.idPermisos) AS permisos_activos,
    COUNT(DISTINCT v.idvacacion) AS vacaciones_pendientes
FROM usuario u
LEFT JOIN permiso pe ON u.num_doc = pe.usuario_num_doc AND pe.estadoPermiso = 'Activo'
LEFT JOIN vacacion v ON u.num_doc = v.usuario_num_doc AND v.estadoVacacion = 'Pendiente'
GROUP BY u.num_doc, u.nombres, u.apellidos;

-- Vista: Publicaciones con total de postulaciones y estado
CREATE OR REPLACE VIEW vista_publicaciones_conteo_postulaciones AS
SELECT 
    p.idPublicacion,
    p.titulo,
    p.estado,
    COUNT(po.idpostulacion) AS total_postulaciones
FROM publicacion p
LEFT JOIN postulacion po ON p.idPublicacion = po.publicacion_idPublicacion
GROUP BY p.idPublicacion, p.titulo, p.estado;

-- Vista: Usuarios que nunca han solicitado vacaciones
CREATE OR REPLACE VIEW vista_usuarios_sin_vacaciones AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos
FROM usuario u
LEFT JOIN vacacion v ON u.num_doc = v.usuario_num_doc
WHERE v.idvacacion IS NULL;