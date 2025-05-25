DELIMITER $$

CREATE TRIGGER after_delete_usuario
AFTER DELETE ON usuario
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (
    accion,
    descripcion,
    fecha,
    usuario_afectado
  ) VALUES (
    'Eliminación',
    CONCAT('Se eliminó el usuario con documento: ', OLD.num_doc),
    NOW(),
    OLD.num_doc
  );
END$$

CREATE TRIGGER after_update_usuario
AFTER UPDATE ON usuario
FOR EACH ROW
BEGIN
  IF NEW.nombres <> OLD.nombres OR NEW.apellidos <> OLD.apellidos OR NEW.email <> OLD.email THEN
    INSERT INTO auditoria (
      accion,
      descripcion,
      fecha,
      usuario_afectado
    ) VALUES (
      'Actualización',
      CONCAT('Se actualizaron los datos personales del usuario con documento: ', NEW.num_doc),
      NOW(),
      NEW.num_doc
    );
  END IF;
END$$

DELIMITER ;