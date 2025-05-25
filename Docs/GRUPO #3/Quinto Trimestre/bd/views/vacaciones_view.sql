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