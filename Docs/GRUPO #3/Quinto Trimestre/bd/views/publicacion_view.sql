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