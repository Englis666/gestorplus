<?php

use PHPUnit\Framework\TestCase;
use Controller\ArchivosController;
use Service\ServicioArchivos;
use Config\Database;

class ArchivosControllerTest extends TestCase
{
    public function testSubirContrato()
    {
        $_FILES = [
            "pdf_file" => [
                "name" => "contrato.pdf",
                "tmp_name" => "/tmp/php/php7h1z4o",
                "size" => 12345,
                "error" => 0,
                "type" => "application/pdf"
            ]
        ];
        $_POST = [
            "idvinculacion" => "12345",
            "num_doc" => "987654"
        ];

        // Mock del servicio ServicioArchivos
        $mockServicioArchivos = $this->createMock(ServicioArchivos::class);
        $mockServicioArchivos->method('subirContrato')
            ->willReturn(['status' => 'success', 'message' => 'Contrato subido correctamente.']);

        // Crear instancia del controlador
        $controller = new ArchivosController();

        // Reemplazamos la propiedad privada $servicioArchivos usando Reflection
        $reflected = new \ReflectionClass($controller);
        $propServicioArchivos = $reflected->getProperty('servicioArchivos');
        $propServicioArchivos->setAccessible(true);
        $propServicioArchivos->setValue($controller, $mockServicioArchivos);

        // Capturar la salida de echo
        ob_start();
        $controller->subirContrato();
        $output = ob_get_clean();

        // Decodificamos el JSON y comprobamos la respuesta
        $response = json_decode($output, true);
        $this->assertEquals('success', $response['status']);
        $this->assertEquals('Contrato subido correctamente.', $response['message']);
    }

    // Test para el método obtenerContrato con archivo encontrado
    public function testObtenerContratoExistente()
{
    // Simulamos el GET con num_doc
    $_GET = ['num_doc' => '987654'];

    // Mock de ServicioArchivos
    $mockServicioArchivos = $this->createMock(Service\ServicioArchivos::class);
    $mockServicioArchivos->method('obtenerContrato')
        ->willReturn(['documentoContrato' => '/uploads/contratos/987654.pdf']);

    // Crear el controlador y establecer el mock
    $controller = new Controller\ArchivosController();
    $reflection = new \ReflectionClass($controller);
    $property = $reflection->getProperty('servicioArchivos');
    $property->setAccessible(true);
    $property->setValue($controller, $mockServicioArchivos);

    // Ruta donde simularemos que está el archivo
    $mockPath = $_SERVER['DOCUMENT_ROOT'] . "/uploads/contratos/987654.pdf";

    // Crear el archivo temporalmente para simular que existe
    file_put_contents($mockPath, 'dummy content');

    // Capturamos la salida para verificar
    ob_start();
    $controller->obtenerContrato();
    $output = ob_get_clean();

    // Verificamos que la salida no esté vacía (indicando que se ha intentado leer el archivo)
    $this->assertNotEmpty($output, "La salida del archivo no debe estar vacía");

    // Limpiar archivo después de la prueba
    unlink($mockPath);
}


    // Test para el método obtenerContrato con archivo no encontrado
    public function testObtenerContratoNoExistente()
    {
        // Datos simulados para obtener contrato
        $_GET = ['num_doc' => '987654'];

        // Mock del servicio ServicioArchivos
        $mockServicioArchivos = $this->createMock(ServicioArchivos::class);
        $mockServicioArchivos->method('obtenerContrato')
            ->willReturn(['documentoContrato' => '/uploads/contratos/987654.pdf']);

        // Crear instancia del controlador
        $controller = new ArchivosController();

        // Reemplazamos la propiedad privada $servicioArchivos usando Reflection
        $reflected = new \ReflectionClass($controller);
        $propServicioArchivos = $reflected->getProperty('servicioArchivos');
        $propServicioArchivos->setAccessible(true);
        $propServicioArchivos->setValue($controller, $mockServicioArchivos);

        // Simulamos que el archivo no existe
        $mockPath = $_SERVER['DOCUMENT_ROOT'] . "/uploads/contratos/987654.pdf";
        
        // Capturar la salida de error
        ob_start();
        $controller->obtenerContrato();
        $output = ob_get_clean();

        // Verificamos que el código de respuesta y el mensaje de error sean los correctos
        $response = json_decode($output, true);
        $this->assertEquals('El archivo no existe.', $response['error']);
        $this->assertEquals($mockPath, $response['ruta']);
    }
}
