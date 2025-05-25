DELIMITER $$

CREATE PROCEDURE CrearPostulacion(
    IN p_fechaPostulacion DATE,
    IN p_estadoPostulacion VARCHAR(45),
    IN p_usuario_num_doc INT,
    IN p_convocatoria_idconvocatoria INT
)
BEGIN
    INSERT INTO postulacion (fecha_postulacion, estadoPostulacion, usuario_num_doc, convocatoria_idconvocatoria)
    VALUES (p_fechaPostulacion, p_estadoPostulacion, p_usuario_num_doc, p_convocatoria_idconvocatoria);
END$$

CREATE PROCEDURE ObtenerPostulacionesPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT * FROM postulacion WHERE usuario_num_doc = p_num_doc;
END$$

CREATE PROCEDURE EliminarPostulacion(IN p_idpostulacion INT)
BEGIN
    DELETE FROM postulacion WHERE idpostulacion = p_idpostulacion;
END$$

DELIMITER ;