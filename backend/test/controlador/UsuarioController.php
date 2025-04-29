<?php

use PHPUnit\Framework\TestCase;
use Controlador\UsuarioControlador;
use Modelo\Usuario;

class UsuarioControladorTest extends TestCase {
    private UsuarioControlador $controlador;

    protected function setUp(): void {
        // Nada aquí porque usamos la clase fake para el test
    }

    public function testMetodoObtenerUsuarios() {
        $mockUsuario = $this->createMock(Usuario::class);
        $mockUsuario->method('obtenerUsuarios')->willReturn([
            ['num_doc' => 1012349306, 'nombres' => 'Laura Vanessa'],
            ['num_doc' => 1074526863, 'nombres' => 'Luan'],
        ]);

        $controlador = new UsuarioControladorFake($mockUsuario);

        ob_start(); // Captura salida
        $controlador->obtenerUsuarios();
        $output = ob_get_clean(); // Detiene captura

        $this->assertStringContainsString('"status":"success"', $output);
        $this->assertStringContainsString('"nombres":"Laura Vanessa"', $output);
    }
}

class UsuarioControladorFake extends UsuarioControlador {
    public function __construct($usuarioMock) {
        $this->usuario = $usuarioMock;

        // Simula el servicio jsonResponseService
        $this->jsonResponseService = new class {
            public function responder($data) {
                echo json_encode($data);
            }
        };
    }
}
