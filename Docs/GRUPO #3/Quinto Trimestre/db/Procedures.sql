-------------------------------------------------------------------------- START AUSENCIA -----------------------------------------------------------------------------------
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

DELIMITER ;


-- Procedimiento AusenciaAceptada --
DELIMITER $$

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

DELIMITER ;

-- PROCEDIMIENTO ALMACENADO AUSENCIA RECHAZADA --
DELIMITER $$

CREATE PROCEDURE RechazarAusencia(IN p_ausencia INT)
BEGIN 
    DECLARE p_num_doc INT(11)

    SELECT usuario_num_doc INTO p_num_doc FROM ausencia WHERE idausencia = p_idausencia;
    
    IF p_num_doc IS NOT NULL THEN
        UPDATE ausencia SET jusitifcada = 'Rechazada' WHERE idausencia = p_idausencia;

        INSERT INTO notificacion (descripcionNotificacion, estadoNotificacion, tipo , num_doc)
        VALUES ('Tu solicitud de ausencia ha sido rechazada' 'Rechazada', 'General', p_num_doc);
    END IF;
END$$

DELIMITER ;

-- PROCEDIMIENTO ALMACENADO OBTENER AUSENCIAS --
DELIMITER $$

CREATE PROCEDURE ObtenerAusenciasPorUsuario(IN p_num_doc INT(11))
BEGIN 
    SELECT * FROM ausencia WHERE usuario_num_doc = p_num_doc;
END$$

DELIMITER ;

-- PROCEDIMIENTO ALMACENADO ObtenerTodasLasAusencias --

DELIMITER $$

CREATE PROCEDURE ObtenerTodasLasAusencias()
BEGIN 
    SELECT * FROM ausencia;
END $$

DELIMITER ; 
 
----------------------------------------------------------------------------- END AUSENCIA ---------------------------------------------------------------

------------------------------------------------------------------------------START CARGO-----------------------------------------------------------------

-- PROCEDIMIENTO ALMACENADO ActivarCargo --
DELIMITER $$

CREATE PROCEDURE ActivarCargo(in idcargo INT(11))
BEGIN
    UPDATE cargo SET estadoCargo = 'Activo' WHERE idcargo = idcargo;
END $$

DELIMITER ;

-- PROCEDIMIENTO ALMACENADO DesactivarCargo --
DELIMITER $$

CREATE PROCEDURE DesactivarCargo(IN idcargo INT(11))
BEGIN 
    UPDATE cargo set estadoCargo = 'Inactiva' WHERE idcargo = idcargo;
END $$

DELIMITER ;

-- Procedimiento almacenado ContarConvocatoriasRelacionadas --
DELIMITER $$

CREATE PROCEDURE ContarConvocatoriasRelacionadas(IN idcargo INT(11))
BEGIN
    SELECT COUNT(*) AS total from convocatoria WHERE cargo_idCargo = idcargo;
END $$

DELIMITER ;

-- Procedimiento almacenado 
