DELIMITER $$

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

DELIMITER ;