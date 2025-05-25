DELIMITER $$

CREATE TRIGGER after_insert_convocatoria
AFTER INSERT ON convocatoria
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (
    accion,
    descripcion,
    fecha,
    usuario_afectado
  ) VALUES (
    'Creación',
    CONCAT('Se creó una nueva convocatoria: ', NEW.nombreConvocatoria),
    NOW(),
    NULL
  );
END$$

CREATE TRIGGER after_update_convocatoria
AFTER UPDATE ON convocatoria
FOR EACH ROW
BEGIN
  IF NEW.nombreConvocatoria <> OLD.nombreConvocatoria OR NEW.descripcion <> OLD.descripcion OR NEW.salario <> OLD.salario THEN
    INSERT INTO auditoria (
      accion,
      descripcion,
      fecha,
      usuario_afectado
    ) VALUES (
      'Actualización',
      CONCAT('Se actualizó la convocatoria con ID: ', NEW.idconvocatoria, '.'),
      NOW(),
      NULL
    );
  END IF;
END$$

DELIMITER ;