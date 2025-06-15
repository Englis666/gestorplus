<?php
namespace Migrations\Sources;

use Migrations\Interfaces\MigradorInterface;
use Migrations\Entities\UsuarioMigration;
use Migrations\Entities\HojadevidaMigration;
use Migrations\Entities\RolMigration;

class MigrarCSV implements MigradorInterface
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

    public function importarDatosDesdeCSV(string $filename)
    {
        if (!file_exists($filename)){
            throw new \Exception("El archivo $filename no existe");
        }
        if (pathinfo($filename, PATHINFO_EXTENSION) !== 'csv'){
            throw new \Exception("El archivo $filename no es un archivo CSV valido");
        }

        $hnalde = fopen($filename, 'r');
        if (!$handle) throw new \Exception("No se pudo abrir el archivo CSV: $filename");
        
        fgetcsv($handle);

        $usuarioMigration = new UsuarioMigration();
        while (($row = fgetcsv($handle)) !== false) {
            $usuarioMigration->importarUsuario($row);
        }
        fclose($handle);
        $hojadevidaMigration = new HojadevidaMigration();
        $hojadevidaMigration->importarHojadevida($row);
        $rolMigration = new RolMigration();
        $rolMigration->importarRoles($row);
        echo "Datos importados desde CSV: $filename\n";
        

    }


}
