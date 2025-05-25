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