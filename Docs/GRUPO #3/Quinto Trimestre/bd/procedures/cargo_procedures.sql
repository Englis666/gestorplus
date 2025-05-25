DELIMITER $$

CREATE PROCEDURE ActivarCargo(in idcargo INT(11))
BEGIN
    UPDATE cargo SET estadoCargo = 'Activo' WHERE idcargo = idcargo;
END $$

CREATE PROCEDURE DesactivarCargo(IN idcargo INT(11))
BEGIN 
    UPDATE cargo set estadoCargo = 'Inactiva' WHERE idcargo = idcargo;
END $$

CREATE PROCEDURE ContarConvocatoriasRelacionadas(IN idcargo INT(11))
BEGIN
    SELECT COUNT(*) AS total from convocatoria WHERE cargo_idCargo = idcargo;
END $$

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

DELIMITER ;