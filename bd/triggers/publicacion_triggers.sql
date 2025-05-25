DELIMITER $$

CREATE TRIGGER after_insert_publicacion
AFTER INSERT ON publicacion
FOR EACH ROW
BEGIN
  INSERT INTO notificacion (
    descripcionNotificacion,
    estadoNotificacion,
    tipo,
    num_doc
  ) VALUES (
    CONCAT('Se ha publicado una nueva oferta: ', NEW.titulo, '. Revisa los detalles en la plataforma.'),
    'No leida',
    'General',
    NEW.usuario_num_doc
  );
END$$

CREATE TRIGGER after_delete_publicacion
AFTER DELETE ON publicacion
FOR EACH ROW
BEGIN
  INSERT INTO auditoria (
    accion,
    descripcion,
    fecha,
    usuario_afectado
  ) VALUES (
    'Eliminación',
    CONCAT('Se eliminó la publicación con ID: ', OLD.idPublicacion, ' y título: ', OLD.titulo),
    NOW(),
    OLD.usuario_num_doc
  );
END$$

DELIMITER ;