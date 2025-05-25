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

-- Procedimiento almacenado CrearCargo
DELIMITER $$

CREATE PROCEDURE CrearCargo(
    IN p_nombreCargo VARCHAR(45),
    IN p_estadoCargo INT
)
BEGIN
    INSERT INTO cargo (nombreCargo, estadoCargo) VALUES (p_nombreCargo, p_estadoCargo);
END$$

CREATE PROCEDURE ObtenerCargos()
BEGIN
    SELECT * FROM cargo;
END$$

-- ===================== USUARIO =========================
CREATE PROCEDURE CrearUsuario(
    IN p_num_doc INT,
    IN p_nombres VARCHAR(50),
    IN p_apellidos VARCHAR(50),
    IN p_email VARCHAR(45),
    IN p_tipodDoc VARCHAR(40),
    IN p_password VARCHAR(250),
    IN p_estado INT,
    IN p_hojadevida_idHojadevida INT,
    IN p_rol_idrol INT
)
BEGIN
    INSERT INTO usuario (num_doc, nombres, apellidos, email, tipodDoc, password, estado, hojadevida_idHojadevida, rol_idrol)
    VALUES (p_num_doc, p_nombres, p_apellidos, p_email, p_tipodDoc, p_password, p_estado, p_hojadevida_idHojadevida, p_rol_idrol);
END$$

CREATE PROCEDURE ObtenerUsuarioPorDocumento(IN p_num_doc INT)
BEGIN
    SELECT * FROM usuario WHERE num_doc = p_num_doc;
END$$

CREATE PROCEDURE ActualizarUsuario(
    IN p_num_doc INT,
    IN p_nombres VARCHAR(50),
    IN p_apellidos VARCHAR(50),
    IN p_email VARCHAR(45),
    IN p_tipodDoc VARCHAR(40),
    IN p_estado INT,
    IN p_hojadevida_idHojadevida INT,
    IN p_rol_idrol INT
)
BEGIN
    UPDATE usuario
    SET nombres = p_nombres,
        apellidos = p_apellidos,
        email = p_email,
        tipodDoc = p_tipodDoc,
        estado = p_estado,
        hojadevida_idHojadevida = p_hojadevida_idHojadevida,
        rol_idrol = p_rol_idrol
    WHERE num_doc = p_num_doc;
END$$

CREATE PROCEDURE EliminarUsuario(IN p_num_doc INT)
BEGIN
    DELETE FROM usuario WHERE num_doc = p_num_doc;
END$$

-- ===================== VINCULACION =========================
CREATE PROCEDURE CrearVinculacion(
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_tipoContrato VARCHAR(80),
    IN p_salario DECIMAL(10,2),
    IN p_estadoContrato VARCHAR(50),
    IN p_fechaFirma DATE,
    IN p_documentoContrato VARCHAR(255),
    IN p_evaluacionesSg_idevaluacion INT,
    IN p_usuario_num_doc INT
)
BEGIN
    INSERT INTO vinculacion (fechaInicio, fechaFin, tipoContrato, salario, estadoContrato, fechaFirma, documentoContrato, evaluacionesSg_idevaluacion, usuario_num_doc)
    VALUES (p_fechaInicio, p_fechaFin, p_tipoContrato, p_salario, p_estadoContrato, p_fechaFirma, p_documentoContrato, p_evaluacionesSg_idevaluacion, p_usuario_num_doc);
END$$

CREATE PROCEDURE ObtenerVinculacionesPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT * FROM vinculacion WHERE usuario_num_doc = p_num_doc;
END$$

CREATE PROCEDURE ActualizarVinculacion(
    IN p_idvinculacion INT,
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_tipoContrato VARCHAR(80),
    IN p_salario DECIMAL(10,2),
    IN p_estadoContrato VARCHAR(50),
    IN p_fechaFirma DATE,
    IN p_documentoContrato VARCHAR(255)
)
BEGIN
    UPDATE vinculacion
    SET fechaInicio = p_fechaInicio,
        fechaFin = p_fechaFin,
        tipoContrato = p_tipoContrato,
        salario = p_salario,
        estadoContrato = p_estadoContrato,
        fechaFirma = p_fechaFirma,
        documentoContrato = p_documentoContrato
    WHERE idvinculacion = p_idvinculacion;
END$$

CREATE PROCEDURE EliminarVinculacion(IN p_idvinculacion INT)
BEGIN
    DELETE FROM vinculacion WHERE idvinculacion = p_idvinculacion;
END$$

-- ===================== PAZ Y SALVO =========================
CREATE PROCEDURE CrearPazYSalvo(
    IN p_motivo VARCHAR(150),
    IN p_fechaEmision DATE,
    IN p_estado VARCHAR(20),
    IN p_documentoPazysalvo TINYINT(1),
    IN p_vinculacion_idvinculacion INT
)
BEGIN
    INSERT INTO pazysalvo (motivo, fechaEmision, estado, documentoPazysalvo, vinculacion_idvinculacion)
    VALUES (p_motivo, p_fechaEmision, p_estado, p_documentoPazysalvo, p_vinculacion_idvinculacion);
END$$

CREATE PROCEDURE ObtenerPazYSalvoPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT p.*
    FROM pazysalvo p
    INNER JOIN vinculacion v ON p.vinculacion_idvinculacion = v.idvinculacion
    WHERE v.usuario_num_doc = p_num_doc;
END$$

CREATE PROCEDURE EliminarPazYSalvo(IN p_idpazysalvo INT)
BEGIN
    DELETE FROM pazysalvo WHERE idpazysalvo = p_idpazysalvo;
END$$

-- ===================== AUSENCIA =========================
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

CREATE PROCEDURE ObtenerAusenciasPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT * FROM ausencia WHERE usuario_num_doc = p_num_doc;
END$$

CREATE PROCEDURE EliminarAusencia(IN p_idausencia INT)
BEGIN
    DELETE FROM ausencia WHERE idausencia = p_idausencia;
END$$

-- ===================== EVALUACION SG =========================
CREATE PROCEDURE CrearEvaluacionSG(
    IN p_estado_salud VARCHAR(45),
    IN p_evaluacionRiesgos VARCHAR(45),
    IN p_recomendaciones VARCHAR(45),
    IN p_aptitudLaboral VARCHAR(45),
    IN p_comentarios VARCHAR(45),
    IN p_entrevista_identrevista INT,
    IN p_entrevista_postulacion_idpostulaciones INT,
    IN p_estadoEvaluacion VARCHAR(25)
)
BEGIN
    INSERT INTO evaluacionessg (estado_salud, evaluacionRiesgos, recomendaciones, aptitudLaboral, comentarios, entrevista_identrevista, entrevista_postulacion_idpostulaciones, estadoEvaluacion)
    VALUES (p_estado_salud, p_evaluacionRiesgos, p_recomendaciones, p_aptitudLaboral, p_comentarios, p_entrevista_identrevista, p_entrevista_postulacion_idpostulaciones, p_estadoEvaluacion);
END$$

CREATE PROCEDURE ObtenerEvaluacionPorEntrevista(IN p_entrevista_identrevista INT)
BEGIN
    SELECT * FROM evaluacionessg WHERE entrevista_identrevista = p_entrevista_identrevista;
END$$

-- ===================== VACACION =========================
CREATE PROCEDURE CrearVacacion(
    IN p_fechaInicio DATE,
    IN p_fechaFin DATE,
    IN p_aprovadoPor INT,
    IN p_estadoVacacion VARCHAR(45),
    IN p_usuario_num_doc INT
)
BEGIN
    INSERT INTO vacacion (fechaInicio, fechaFin, aprovadoPor, estadoVacacion, usuario_num_doc)
    VALUES (p_fechaInicio, p_fechaFin, p_aprovadoPor, p_estadoVacacion, p_usuario_num_doc);
END$$

CREATE PROCEDURE ObtenerVacacionesPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT * FROM vacacion WHERE usuario_num_doc = p_num_doc;
END$$

-- ===================== CONVOCATORIA =========================
CREATE PROCEDURE CrearConvocatoria(
    IN p_nombreConvocatoria VARCHAR(80),
    IN p_descripcion TEXT,
    IN p_requisitos TEXT,
    IN p_salario DECIMAL(10,2),
    IN p_cantidadConvocatoria INT,
    IN p_cargo_idcargo INT,
    IN p_fecha_limite DATE
)
BEGIN
    INSERT INTO convocatoria (nombreConvocatoria, descripcion, requisitos, salario, cantidadConvocatoria, cargo_idcargo, fecha_limite)
    VALUES (p_nombreConvocatoria, p_descripcion, p_requisitos, p_salario, p_cantidadConvocatoria, p_cargo_idcargo, p_fecha_limite);
END$$

CREATE PROCEDURE ObtenerConvocatorias()
BEGIN
    SELECT * FROM convocatoria;
END$$

DELIMITER $$

-- ===================== HOJA DE VIDA =========================
CREATE PROCEDURE CrearHojaDeVida(
    IN p_ruta VARCHAR(255),
    IN p_fechaSubida DATE
)
BEGIN
    INSERT INTO hojadevida (ruta, fechaSubida) VALUES (p_ruta, p_fechaSubida);
END$$

CREATE PROCEDURE ObtenerHojasDeVida()
BEGIN
    SELECT * FROM hojadevida;
END$$

CREATE PROCEDURE EliminarHojaDeVida(IN p_idHojadevida INT)
BEGIN
    DELETE FROM hojadevida WHERE idHojadevida = p_idHojadevida;
END$$

-- ===================== ROL =========================
CREATE PROCEDURE CrearRol(
    IN p_nombreRol VARCHAR(45)
)
BEGIN
    INSERT INTO rol (nombreRol) VALUES (p_nombreRol);
END$$

CREATE PROCEDURE ObtenerRoles()
BEGIN
    SELECT * FROM rol;
END$$

CREATE PROCEDURE EliminarRol(IN p_idrol INT)
BEGIN
    DELETE FROM rol WHERE idrol = p_idrol;
END$$

-- ===================== POSTULACION =========================
CREATE PROCEDURE CrearPostulacion(
    IN p_fechaPostulacion DATE,
    IN p_estadoPostulacion VARCHAR(45),
    IN p_usuario_num_doc INT,
    IN p_convocatoria_idconvocatoria INT
)
BEGIN
    INSERT INTO postulacion (fechaPostulacion, estadoPostulacion, usuario_num_doc, convocatoria_idconvocatoria)
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

-- ===================== ENTREVISTA =========================
CREATE PROCEDURE CrearEntrevista(
    IN p_fechaEntrevista DATE,
    IN p_resultado VARCHAR(45),
    IN p_postulacion_idpostulacion INT
)
BEGIN
    INSERT INTO entrevista (fechaEntrevista, resultado, postulacion_idpostulacion)
    VALUES (p_fechaEntrevista, p_resultado, p_postulacion_idpostulacion);
END$$

CREATE PROCEDURE ObtenerEntrevistasPorPostulacion(IN p_idpostulacion INT)
BEGIN
    SELECT * FROM entrevista WHERE postulacion_idpostulacion = p_idpostulacion;
END$$

CREATE PROCEDURE EliminarEntrevista(IN p_identrevista INT)
BEGIN
    DELETE FROM entrevista WHERE identrevista = p_identrevista;
END$$

-- ===================== NOTIFICACION =========================
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

-- ===================== ARCHIVO (CONTRATO) =========================
CREATE PROCEDURE CrearArchivo(
    IN p_ruta VARCHAR(255),
    IN p_tipo VARCHAR(45),
    IN p_fechaSubida DATE,
    IN p_usuario_num_doc INT
)
BEGIN
    INSERT INTO archivo (ruta, tipo, fechaSubida, usuario_num_doc)
    VALUES (p_ruta, p_tipo, p_fechaSubida, p_usuario_num_doc);
END$$

CREATE PROCEDURE ObtenerArchivosPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT * FROM archivo WHERE usuario_num_doc = p_num_doc;
END$$

CREATE PROCEDURE EliminarArchivo(IN p_idarchivo INT)
BEGIN
    DELETE FROM archivo WHERE idarchivo = p_idarchivo;
END$$

-- ===================== EVALUACION DE DESEMPEÑO =========================
CREATE PROCEDURE CrearEvaluacionDesempeno(
    IN p_fechaEvaluacion DATE,
    IN p_resultado VARCHAR(45),
    IN p_usuario_num_doc INT
)
BEGIN
    INSERT INTO evaluaciondesempeno (fechaEvaluacion, resultado, usuario_num_doc)
    VALUES (p_fechaEvaluacion, p_resultado, p_usuario_num_doc);
END$$

CREATE PROCEDURE ObtenerEvaluacionesDesempenoPorUsuario(IN p_num_doc INT)
BEGIN
    SELECT * FROM evaluaciondesempeno WHERE usuario_num_doc = p_num_doc;
END$$

CREATE PROCEDURE EliminarEvaluacionDesempeno(IN p_idevaluaciondesempeno INT)
BEGIN
    DELETE FROM evaluaciondesempeno WHERE idevaluaciondesempeno = p_idevaluaciondesempeno;
END$$

DELIMITER ;
