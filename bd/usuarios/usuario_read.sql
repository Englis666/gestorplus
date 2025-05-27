CREATE USER 'gestorplus_read'@'%' IDENTIFIED BY 'usuarioProduccionGestorPlus';
GRANT SELECT ON gestorplus.* TO 'gestorplus_read'@'%';
FLUSH PRIVILEGES;