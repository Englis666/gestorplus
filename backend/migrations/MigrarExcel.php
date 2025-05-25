<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

namespace Migrations;

include_once '../vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;
use Migrations\UsuarioMigration;
use Migrations\HojadevidaMigration;
use Migrations\RolMigration;
class MigrarExcel {
    public function importarExcel($filename) {
        try {
            echo "Cargando archivo: $filename\n"; ?> <br> <?php
            $spreadsheet = IOFactory::load($filename);
            $hojas = $spreadsheet->getAllSheets();

            foreach ($hojas as $hoja) {
                $nombreHoja = $hoja->getTitle();
                echo "Procesando hoja: $nombreHoja\n"; ?> <br> <?php

                $rows = $hoja->toArray();

                foreach ($rows as $index => $row) {
                    if ($index === 0) continue;

                    switch (strtolower($nombreHoja)) {
                        case 'rol':
                            $migration = new RolMigration();
                            $migration->importarRoles($row);
                            break;
                        case 'hojadevida':
                            $migration = new HojadevidaMigration();
                            $migration->importarHojadevida($row);
                            break;
                        case 'usuario':
                            $migration = new UsuarioMigration();
                            $migration->importarUsuario($row);
                            break;
                        default:
                            echo "Hoja desconocida: $nombreHoja\n";
                            break;
                    }
                }
            }

            ?> <br> <?php echo "Migración completada.\n"; ?> <br> <?php
        } catch (\Exception $e) {
            echo "Error al importar archivo: " . $e->getMessage() . "\n";
        }
    }
}
