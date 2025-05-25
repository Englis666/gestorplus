-- Vista: Notificaciones con nombre de usuario
CREATE OR REPLACE VIEW vista_notificaciones AS
SELECT 
    n.idnotificacion,
    n.descripcionNotificacion,
    n.estadoNotificacion,
    n.tipo,
    n.created_at,
    u.nombres,
    u.apellidos
FROM notificacion n
JOIN usuario u ON n.num_doc = u.num_doc;

-- Vista: Últimas notificaciones por usuario
CREATE OR REPLACE VIEW vista_ultimas_notificaciones AS
SELECT 
    n.idnotificacion,
    n.descripcionNotificacion,
    n.estadoNotificacion,
    n.created_at,
    u.nombres,
    u.apellidos
FROM notificacion n
JOIN usuario u ON n.num_doc = u.num_doc
WHERE n.created_at = (
    SELECT MAX(n2.created_at)
    FROM notificacion n2
    WHERE n2.num_doc = n.num_doc
);