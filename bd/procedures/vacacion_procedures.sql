DELIMITER $$

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

DELIMITER ;