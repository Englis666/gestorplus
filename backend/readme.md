# importante sobre base de datos UTF8

Resulta que la base de datos puede tener palabras que no soporta caracteres y lo que pasa es que teniamos un conexion obsoleta, ahora php 8.2 ya no usa utf8_encode() que combertia un formato x a utf8 por bases de datos antiguas pero resulta que esta funcion en php actual es obsoleta y hace que rompa todo

Actualmente el estandar actual es utf8

ALTER DATABASE gestorplus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE nombre_de_tu_tabla CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE nombre_de_tu_tabla MODIFY columna VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
