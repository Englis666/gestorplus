CREATE USER 'gestorplus_app'@'%' IDENTIFIED BY 'usuarioProduccionGestorPlus';
GRANT ALL PRIVILEGES ON *gestorplus.* TO 'gestorplus_app'@'%';
FLUSH PRIVILEGES;