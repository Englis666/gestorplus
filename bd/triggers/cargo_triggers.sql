DELIMITER $$

CREATE TRIGGER after_insert_cargo
AFTER INSERT ON cargo
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (
    accion,
    descripcion,
    fecha,
    usuario_afectado
  ) VALUES (
    'Creación',
    CONCAT('Se creó un nuevo cargo: ', NEW.nombreCargo),
    NOW(),
    NULL
  );
END$$

DELIMITER ;