DELIMITER $$

CREATE TRIGGER after_insert_postulacion
AFTER INSERT ON postulacion
FOR EACH ROW
BEGIN
  INSERT INTO notificacion (
    descripcionNotificacion,
    estadoNotificacion,
    tipo,
    num_doc
  ) VALUES (
    CONCAT('Has realizado una postulación a la convocatoria: ', NEW.convocatoria_idconvocatoria, '. ¡Éxito!'),
    'No leida',
    'General',
    NEW.usuario_num_doc
  );
END$$

CREATE TRIGGER after_update_postulacion_estado
AFTER UPDATE ON postulacion
FOR EACH ROW
BEGIN
  IF NEW.estadoPostulacion <> OLD.estadoPostulacion THEN
    INSERT INTO notificacion (
      descripcionNotificacion,
      estadoNotificacion,
      tipo,
      num_doc
    ) VALUES (
      CONCAT('El estado de tu postulación (ID: ', NEW.idpostulacion, ') ha cambiado a: ', NEW.estadoPostulacion),
      'No leida',
      'General',
      NEW.usuario_num_doc
    );
  END IF;
END$$

CREATE TRIGGER after_delete_postulacion
AFTER DELETE ON postulacion
FOR EACH ROW
BEGIN
  INSERT INTO notificacion (
    descripcionNotificacion,
    estadoNotificacion,
    tipo,
    num_doc
  ) VALUES (
    CONCAT('Tu postulación (ID: ', OLD.idpostulacion, ') ha sido eliminada.'),
    'No leida',
    'General',
    OLD.usuario_num_doc
  );
END$$

DELIMITER ;