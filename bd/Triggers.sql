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

DELIMITER ;DELIMITER $$

-- 1. Notificación al crear una nueva vacación
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

-- 2. Notificación al aprobar/rechazar una ausencia
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

-- 3. Auditoría: registrar eliminaciones de usuarios
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

DELIMITER ;DELIMITER $$

-- 4. Notificación al crear un nuevo permiso
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

-- 5. Auditoría: registrar actualización de datos personales del usuario
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

-- 6. Notificación al crear una nueva publicación
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

-- 7. Notificación al aprobar/rechazar una vacación
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

-- 8. Auditoría: registrar creación de nuevas convocatorias
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

-- 9. Notificación al crear una nueva postulación
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

DELIMITER ;DELIMITER $$

-- 10. Auditoría: registrar eliminación de publicaciones
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

-- 11. Notificación al actualizar el estado de una postulación
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

-- 12. Auditoría: registrar creación de nuevos cargos
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

DELIMITER $$

-- 13. Auditoría: registrar actualización de convocatorias
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

-- 14. Notificación al eliminar una postulación
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

-- 15. Auditoría: registrar actualización de permisos
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