DELIMITER $$

CREATE TRIGGER after_insert_ausencia
AFTER INSERT ON ausencia
FOR EACH ROW
BEGIN
  INSERT INTO notificacion (
    descripcionNotificacion,
    estadoNotificacion,
    tipo,
    num_doc
  ) VALUES (
    CONCAT('El empleado identificado con la cedula ', NEW.usuario_num_doc, ' ha solicitado una ausencia para el dia ', NEW.fechaInicio, ' hasta el dia ', NEW.fechaFin),
    'No leida',
    'General',
    NEW.usuario_num_doc
  );
END$$

CREATE TRIGGER after_update_ausencia_estado
AFTER UPDATE ON ausencia
FOR EACH ROW
BEGIN
  IF NEW.justificada <> OLD.justificada THEN
    INSERT INTO notificacion (
      descripcionNotificacion,
      estadoNotificacion,
      tipo,
      num_doc
    ) VALUES (
      CONCAT('El estado de tu ausencia (ID: ', NEW.idausencia, ') ha cambiado a: ', NEW.justificada),
      'No leida',
      'General',
      NEW.usuario_num_doc
    );
  END IF;
END$$

DELIMITER ;