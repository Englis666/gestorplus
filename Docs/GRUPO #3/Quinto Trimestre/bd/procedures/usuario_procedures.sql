DELIMITER $$

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

DELIMITER ;