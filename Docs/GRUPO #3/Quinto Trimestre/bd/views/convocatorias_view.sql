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