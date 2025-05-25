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