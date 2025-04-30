<?php
use PHPUnit\Framework\TestCase;
use Controlador\AspiranteControlador;
use Servicio\TokenService;
use PHPUnit\Framework\MockObject\MockBuilder;

class AspiranteControllerTest extends TestCase {
    private $aspiranteControlador;

    public function setUp(): void {
        parent::setUp();

        // Crear un mock para TokenService
        $mockTokenService = $this->createMock(TokenService::class);

        // Configurar el mock para que devuelva un token válido
        $mockTokenService->method('validarToken')
                         ->willReturn('some_valid_token');

        // Inyectar el mock del TokenService al controlador
        $this->aspiranteControlador = new AspiranteControlador($mockTokenService);
    }

    public function testAplicacionDeAspiranteConTokenValidoYParametrosValidos() {
        // Aquí usas el controlador como normalmente lo harías
        $data = ['idconvocatoria' => 123];

        // Esperamos que se haga una respuesta exitosa
        $this->expectOutputString('{"message":"success","data":true}');
        
        // Ejecutar el método de aplicación de aspirante
        $this->aspiranteControlador->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteConTokenInvalido() {
        // Crear un mock para TokenService con token invalido
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')
                         ->willReturn(null); // El token es inválido

        // Inyectar el mock con el token inválido
        $this->aspiranteControlador = new AspiranteControlador($mockTokenService);

        // Ejecutar el método
        $data = ['idconvocatoria' => 123];

        // Verificamos que no se envíe ninguna respuesta
        $this->expectOutputString('');
        
        $this->aspiranteControlador->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteConParametrosFaltantes() {
        // Crear un mock para TokenService
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')
                         ->willReturn('some_valid_token');

        // Inyectar el mock del TokenService al controlador
        $this->aspiranteControlador = new AspiranteControlador($mockTokenService);

        // Simular un caso donde faltan parámetros
        $data = []; // No tiene 'idconvocatoria'

        // Esperamos que no se haga ninguna respuesta
        $this->expectOutputString('');

        // Ejecutar el método de aplicación de aspirante
        $this->aspiranteControlador->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteConExcepcion() {
        // Crear un mock para TokenService
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')
                         ->willReturn('some_valid_token');

        // Inyectar el mock del TokenService al controlador
        $this->aspiranteControlador = new AspiranteControlador($mockTokenService);

        // Hacer que el método de aplicación lance una excepción
        $this->aspiranteControlador->method('aplicacionDeAspirante')
            ->will($this->throwException(new Exception('Error interno', 500)));

        // Ejecutar el método y esperar una respuesta de error
        $data = ['idconvocatoria' => 123];

        // Verificar que se genere un error
        $this->expectOutputString('{"error":"Error interno"}');
        
        // Ejecutar el método de aplicación de aspirante
        $this->aspiranteControlador->aplicacionDeAspirante($data);
    }
}
