DELIMITER $$

CREATE TRIGGER after_insert_permiso
AFTER INSERT ON permiso
FOR EACH ROW
BEGIN
  INSERT INTO notificacion (
    descripcionNotificacion,
    estadoNotificacion,
    tipo,
    num_doc
  ) VALUES (
    CONCAT('El empleado identificado con la cedula ', NEW.usuario_num_doc, ' ha solicitado un permiso desde ', NEW.fechaInicio, ' hasta ', NEW.fechaFin),
    'No leida',
    'General',
    NEW.usuario_num_doc
  );
END$$

CREATE TRIGGER after_update_permiso
AFTER UPDATE ON permiso
FOR EACH ROW
BEGIN
  IF NEW.estadoPermiso <> OLD.estadoPermiso THEN
    INSERT INTO auditoria (
      accion,
      descripcion,
      fecha,
      usuario_afectado
    ) VALUES (
      'Actualización',
      CONCAT('El estado del permiso (ID: ', NEW.idPermisos, ') cambió a: ', NEW.estadoPermiso),
      NOW(),
      NEW.usuario_num_doc
    );
  END IF;
END$$

DELIMITER ;