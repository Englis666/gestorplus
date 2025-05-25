DELIMITER $$

CREATE PROCEDURE CrearNotificacion(
    IN p_descripcionNotificacion TEXT,
    IN p_estadoNotificacion VARCHAR(45),
    IN p_tipo VARCHAR(45),
    IN p_num_doc INT
)
BEGIN
    INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
    VALUES (p_descripcionNotificacion, p_estadoNotificacion, p_tipo, p_num_doc);
END$$

CREATE PROCEDURE ObtenerNotificacionesPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT * FROM notificacion WHERE num_doc = p_num_doc;
END$$

CREATE PROCEDURE EliminarNotificacion(IN p_idnotificacion INT)
BEGIN
    DELETE FROM notificacion WHERE idnotificacion = p_idnotificacion;
END$$

DELIMITER ;