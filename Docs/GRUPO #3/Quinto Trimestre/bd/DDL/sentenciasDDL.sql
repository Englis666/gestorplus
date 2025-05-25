-- 01. Mostrar BBDDs :
SHOW DATABASES;

-- 02. Usar BBDD :
USE gestorplus;

-- 03. Eliminar BBDD :
DROP DATABASE gestorplus;

-- 04. Mostrar Tablas :
SHOW TABLES;

-- 05. Mostrar Columnas :
SHOW COLUMNS FROM usuario;
DESCRIBE usuario;

-- 06. Agregar Columna :
ALTER TABLE usuario ADD telefono VARCHAR(20);

-- 07. Renombrar Columna :
ALTER TABLE usuario CHANGE telefono celular VARCHAR(20);

-- 08. Eliminar Columna :
ALTER TABLE usuario DROP celular;

-- 09. Agregar Valor x Defecto Columna :
ALTER TABLE usuario ALTER estado SET DEFAULT 1;

-- 10. Eliminar Valor x Defecto Columna :
ALTER TABLE usuario ALTER estado DROP DEFAULT;

-- 11. Mostrar Creación Tabla :
SHOW CREATE TABLE usuario;
SHOW CREATE TABLE ausencia;
SHOW CREATE TABLE vacacion;

-- 12. Eliminar Restricción :
ALTER TABLE usuario DROP FOREIGN KEY usuario_ibfk_2;

-- 13. Eliminar Índice :
ALTER TABLE usuario DROP INDEX rol_idrol;

-- 14. Eliminar Llave Primaria :
ALTER TABLE usuario DROP PRIMARY KEY;

-- 15. Limpiar Registros :
TRUNCATE usuario;

-- 16. Eliminar Tabla :
DROP TABLE usuario;

-- 17. Crear Tabla :
CREATE TABLE usuario (
  num_doc INT PRIMARY KEY,
  nombres VARCHAR(50) NOT NULL,
  apellidos VARCHAR(50) NOT NULL,
  email VARCHAR(45) NOT NULL,
  tipodDoc VARCHAR(40) NOT NULL,
  password VARCHAR(250) NOT NULL,
  estado INT NOT NULL DEFAULT 1,
  hojadevida_idHojadevida INT NOT NULL,
  rol_idrol INT NOT NULL
);

-- 18. Renombrar Tabla :
RENAME TABLE usuario TO usuarios;

-- 19. Crear Llave Primaria :
ALTER TABLE usuario ADD PRIMARY KEY (num_doc);

-- 20. Crear Índice Campo :
CREATE INDEX idx_usuario_rol ON usuario (rol_idrol);

-- 21. Crear Índice Multicampo :
CREATE INDEX idx_nombre_apellido ON usuario (nombres, apellidos);

-- 22. Crear Índice Único :
CREATE UNIQUE INDEX uq_email ON usuario (email);

-- 23. Crear Restricción :
ALTER TABLE usuario ADD CONSTRAINT fk_usuario_rol
  FOREIGN KEY (rol_idrol)
  REFERENCES rol (idrol)
  ON DELETE CASCADE
  ON UPDATE CASCADE;