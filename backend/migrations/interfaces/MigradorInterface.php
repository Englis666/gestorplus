<?php
namespace Migrations\Interfaces;

interface MigradorInterface {

    /**
     * Importa datos desde un archivo CSV a la base de datos.
     * @param string $filename Ruta del archivo CSV a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeCSV('ruta/al/archivo.csv');
     */
     public function importarDatosDesdeCSV(string $filename);

    /**
     * Importa datos desde un archivo JSON a la base de datos.
     * @param string $filename Ruta del archivo JSON a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeJSON('ruta/al/archivo.json');
     */
    public function importarDatosDesdeJSON(string $filename);


    /**
     * Importa datos desde un archivo Excel a la base de datos.
     * @param string $filename Ruta del archivo Excel a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeExcel('ruta/al/archivo.xlsx');
     */
    public function importarDatosDesdeExcel(string $filename);
    /**
     * Importa datos desde un archivo XML a la base de datos.
     * @param string $filename Ruta del archivo XML a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeXML('ruta/al/archivo.xml');
     */
    public function importarDatosDesdeXML(string $filename);
    /**
     * Importa datos desde un archivo YAML a la base de datos.
     * @param string $filename Ruta del archivo YAML a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeYAML('ruta/al/archivo.yaml');
     */
    public function importarDatosDesdeYAML(string $filename);
    /**
     * Importa datos desde un archivo SQL a la base de datos.
     * @param string $filename Ruta del archivo SQL a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeSQL('ruta/al/archivo.sql');
     */
    public function importarDatosDesdeSQL(string $filename);
    /**
     * Importa datos desde un archivo de texto plano a la base de datos.
     * @param string $filename Ruta del archivo de texto plano a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeTextoPlano('ruta/al/archivo.txt');
     */
    public function importarDatosDesdeTextoPlano(string $filename);
    /**
     * Importa datos desde un archivo de configuración a la base de datos.
     * @param string $filename Ruta del archivo de configuración a importar.
     * @return void
     * @throws \Exception Si ocurre un error al procesar el archivo o insertar datos
     * @example importarDatosDesdeConfiguracion('ruta/al/archivo.conf');
     */

}