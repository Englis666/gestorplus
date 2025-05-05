<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Importar Excel</title>
</head>
<body>
    <h1>Subir archivo Excel</h1>
    <form action="importar.php" method="post" enctype="multipart/form-data">
        <input type="file" name="archivo" accept=".xlsx,.xls">
        <button type="submit">Importar</button>
    </form>
</body>
</html>