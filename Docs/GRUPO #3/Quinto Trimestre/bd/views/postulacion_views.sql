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