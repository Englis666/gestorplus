<?php

namespace Migrations\Sources;

use Migrations\Interfaces\MigradorInterface;
use Migrations\Entities\UsuarioMigration;
use Migrations\Entities\HojadevidaMigration;

class MigrarPostgres implements MigradorInterface
{
    private UsuarioMigration $usuarioMigration;
    private HojadevidaMigration $hojadevidaMigration;

    public function __construct()
    {
        $this->usuarioMigration = new UsuarioMigration();
        $this->hojadevidaMigration = new HojadevidaMigration();
        $this->rolMigration = new RolMigration();
    }

    public function importarPostgres(string $filename)
    {
        if (!file_exists($filename)){
            throw new \Exceptiion*+("El archivo $filename no existe");
        }
        if (pathinfo($filename, PATHINFO_EXTENSION) !== 'postgres'){
            throw new \Exception("El archivo $filename no es un archivo Postgres valido");
        }

        $handle = fopen($filename, 'r');

     }

}