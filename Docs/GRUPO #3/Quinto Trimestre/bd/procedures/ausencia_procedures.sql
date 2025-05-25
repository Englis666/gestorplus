DELIMITER $$

CREATE PROCEDURE SolicitarAusencia(
    IN p_num_doc INT(11),
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_tipoAusencia VARCHAR(45),
    IN p_descripcion TEXT
)
BEGIN
    DECLARE p_fechaRegistro DATETIME;
    SET p_fechaRegistro = NOW();

    INSERT INTO ausencia (fechaInicio, fechaFin, tipoAusencia, descripcion, fechaRegistro, justificada, usuario_num_doc)
    VALUES (p_fechaInicio, p_fechaFin, p_tipoAusencia, p_descripcion, p_fechaRegistro, 'En proceso', p_num_doc);

    INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
    VALUES (
        CONCAT('El empleado identificado con la cédula ', p_num_doc, 
               ' ha solicitado una ausencia desde el día ', p_fechaInicio, 
               ' hasta el día ', p_fechaFin),
        'No leída',
        'General',
        p_num_doc
    );
END$$

CREATE PROCEDURE AceptarAusencia(IN p_idausencia INT)
BEGIN
    DECLARE p_num_doc VARCHAR(11);

    SELECT usuario_num_doc INTO p_num_doc FROM ausencia WHERE idausencia = p_idausencia;

    IF p_num_doc IS NOT NULL THEN
        UPDATE ausencia SET justificada = 'Justificada' WHERE idausencia = p_idausencia;

        INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo, num_doc)
        VALUES ('Tu solicitud de ausencia ha sido aceptada.', 'No leída', 'General', p_num_doc);
    END IF;
END$$

CREATE PROCEDURE RechazarAusencia(IN p_idausencia INT)
BEGIN 
    DECLARE p_num_doc INT(11);

    SELECT usuario_num_doc INTO p_num_doc FROM ausencia WHERE idausencia = p_idausencia;
    
    IF p_num_doc IS NOT NULL THEN
        UPDATE ausencia SET justificada = 'Rechazada' WHERE idausencia = p_idausencia;

        INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo , num_doc)
        VALUES ('Tu solicitud de ausencia ha sido rechazada', 'Rechazada', 'General', p_num_doc);
    END IF;
END$$

CREATE PROCEDURE ObtenerAusenciasPorUsuario(IN p_num_doc INT(11))
BEGIN 
    SELECT * FROM ausencia WHERE usuario_num_doc = p_num_doc;
END$$

CREATE PROCEDURE ObtenerTodasLasAusencias()
BEGIN 
    SELECT * FROM ausencia;
END $$

CREATE PROCEDURE CrearAusencia(
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_tipoAusencia VARCHAR(45),
    IN p_descripcion TEXT,
    IN p_justificada VARCHAR(45),
    IN p_fechaRegistro DATE,
    IN p_usuario_num_doc INT
)
BEGIN
    INSERT INTO ausencia (fechaInicio, fechaFin, tipoAusencia, descripcion, justificada, fechaRegistro, usuario_num_doc)
    VALUES (p_fechaInicio, p_fechaFin, p_tipoAusencia, p_descripcion, p_justificada, p_fechaRegistro, p_usuario_num_doc);
END$$

CREATE PROCEDURE EliminarAusencia(IN p_idausencia INT)
BEGIN
    DELETE FROM ausencia WHERE idausencia = p_idausencia;
END$$

DELIMITER ;