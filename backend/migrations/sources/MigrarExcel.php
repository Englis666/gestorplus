<?php
namespace Migrations\Sources;

use Migrations\Interfaces\MigradorInterface;
use Migrations\Entities\UsuarioMigration;
use Migrations\Entities\HojadevidaMigration;
use Migrations\Entities\RolMigration;

class MigrarExcel implements MigradorInterface
{
    private UsuarioMigration $usuarioMigration;
    private HojadevidaMigration $hojadevidaMigration;
    private RolMigration $rolMigration;

    public function __construct()
    {
        $this->usuarioMigration = new UsuarioMigration();
        $this->hojadevidaMigration = new HojadevidaMigration();
        $this->rolMigration = new RolMigration();
    }

    public function importarDatosDesdeExcel(string $filename)
    {
        if (!file_exists($filename)) {
            throw new \Exception("El archivo $filename no existe.");
        }
        if (pathinfo($filename, PATHINFO_EXTENSION) !== 'xlsx') {
            throw new \Exception("El archivo $filename no es un archivo Excel válido.");
        }
        $spreadsheet = IOFactory::load($filename);
        $sheet = $spreadsheet->getActiveSheet();
        $rows = $sheet->toArray();

        // Suponiendo que la primera fila es encabezado
        array_shift($rows);

        foreach ($rows as $row) {
            $this->usuarioMigration->importarUsuario($row);
        }
    }
}

$usuarioMigration->importarUsuario($row);