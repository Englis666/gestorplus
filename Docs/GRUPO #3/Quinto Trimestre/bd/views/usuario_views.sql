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

-- Vista: Usuarios que nunca han solicitado vacaciones
CREATE OR REPLACE VIEW vista_usuarios_sin_vacaciones AS
SELECT 
    u.num_doc,
    u.nombres,
    u.apellidos
FROM usuario u
LEFT JOIN vacacion v ON u.num_doc = v.usuario_num_doc
WHERE v.idvacacion IS NULL;