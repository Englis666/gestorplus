<?php
namespace Migrations\Sources;
use Migrations\Interfaces;
use Migrations\Entities\UsuarioMigration;
use Migrations\Entities\HojadevidaMigration;
use Migrations\Entities\RolMigration;

class MigrarMongo implements MigradorInterface
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

    public function importarDatosDesdeMongo(string $collectionName)
    {
        $client = new \MongoDB\Client("mongodb://localhost:27017");
        $collection = $client->selectCollection('NombreDeBaseDeDatos', $collectionName);
        if (!$collection){
            throw new \Exception("La coleccion $collectionName no existe en la base de datos");
        }

        $cursor = $collection->find();
        if (!$cursor) {
            throw new \Exception("No se pudo obtener Datos de la coleccion $collectionName");
        }

        foreach ($cursor as $document) {
            if (isset($document['usuario'])) {
                $this->usuarioMigration->importarUsuario($document['usuario']);
            }
            if (isset($document['hojadevida'])) {
                $this->hojadevidaMigration->importarHojadevida($document['hojadevida']);
            }
            if (isset($document['rol'])) {
                $this->rolMigration->importarRoles($document['rol']);
            }
        }
        echo "Datos importados desde MongoDB: $collectionName\n";


    }
}


?>