DELIMITER $$

CREATE TRIGGER after_insert_vacacion
AFTER INSERT ON vacacion
FOR EACH ROW
BEGIN
  INSERT INTO notificacion (
    descripcionNotificacion,
    estadoNotificacion,
    tipo,
    num_doc
  ) VALUES (
    CONCAT('El empleado identificado con la cedula ', NEW.usuario_num_doc, ' ha solicitado vacaciones desde ', NEW.fechaInicio, ' hasta ', NEW.fechaFin),
    'No leida',
    'General',
    NEW.usuario_num_doc
  );
END$$

CREATE TRIGGER after_update_vacacion_estado
AFTER UPDATE ON vacacion
FOR EACH ROW
BEGIN
  IF NEW.estadoVacacion <> OLD.estadoVacacion THEN
    INSERT INTO notificacion (
      descripcionNotificacion,
      estadoNotificacion,
      tipo,
      num_doc
    ) VALUES (
      CONCAT('El estado de tu solicitud de vacaciones (ID: ', NEW.idvacacion, ') ha cambiado a: ', NEW.estadoVacacion),
      'No leida',
      'General',
      NEW.usuario_num_doc
    );
  END IF;
END$$

DELIMITER ;