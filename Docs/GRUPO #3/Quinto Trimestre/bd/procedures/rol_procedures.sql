DELIMITER $$

CREATE PROCEDURE CrearRol(
    IN p_nombreRol VARCHAR(45),
    IN p_estadoRol INT
)
BEGIN
    INSERT INTO rol (nombreRol, estadoRol) VALUES (p_nombreRol, p_estadoRol);
END$$

CREATE PROCEDURE ObtenerRoles()
BEGIN
    SELECT * FROM rol;
END$$

CREATE PROCEDURE EliminarRol(IN p_idrol INT)
BEGIN
    DELETE FROM rol WHERE idrol = p_idrol;
END$$

DELIMITER ;