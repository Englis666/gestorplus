<?php

use DI\ContainerBuilder;

$containerBuilder = new ContainerBuilder();

// Define tus dependencias aquí
$containerBuilder->addDefinitions([
    // Ejemplo: Si tu Controlador\UsuarioControlador necesita una instancia de Modelo\Usuario
    // Modelo\Usuario::class => DI\create(Modelo\Usuario::class)->constructor(\Config\Database::getConnection()),

    // Ejemplo: Si tu Controlador\AdministradorControlador necesita la conexión a la base de datos
    \PDO::class => function () {
        $database = new \Config\Database();
        return $database->getConnection();
    },

    \Controlador\UsuarioControlador::class => \DI\create(\Controlador\UsuarioControlador::class),
    \Controlador\ChatControlador::class => \DI\create(\Controlador\ChatControlador::class),
    \Controlador\AdministradorControlador::class => \DI\create(\Controlador\AdministradorControlador::class)->constructor(\DI::get(\PDO::class)),
    \Controlador\AspiranteControlador::class => \DI\create(\Controlador\AspiranteControlador::class),
    \Controlador\EmpleadoControlador::class => \DI\create(\Controlador\EmpleadoControlador::class),
]);

return $containerBuilder->build();