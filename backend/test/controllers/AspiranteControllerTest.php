<?php

use PHPUnit\Framework\TestCase;
use Controller\AspiranteController;
use Service\TokenService;
use Service\JsonResponseService;
use Model\Aspirante;

class AspiranteControllerTest extends TestCase {
    private $mockTokenService;
    private $mockJsonResponseService;
    private $aspiranteController;

    public function setUp(): void {
        parent::setUp();

        // Crear mocks para TokenService y JsonResponseService
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Crear una instancia de AspiranteController inyectando los mocks
        $this->aspiranteController = new AspiranteController(
            $this->mockTokenService,
            $this->mockJsonResponseService
        );
    }

    public function testAplicacionDeAspiranteConTokenValidoYParametrosValidos(): void {
        // Configurar el comportamiento esperado del mock
        $this->mockTokenService
            ->method('validarToken')
            ->willReturn('someValidToken'); // Devuelve un token válido

        // Datos simulados para la aplicación del aspirante
        $data = ['idconvocatoria' => 1];

        // Configurar el mock para verificar que se llama el método responder
        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responder')
            ->with($this->arrayHasKey('message'))  // Asegurarse que la respuesta contiene 'message'
            ->willReturn(null); // Simula la respuesta sin hacer nada

        // Llamar al método que estamos probando
        $this->aspiranteController->aplicacionDeAspirante($data);

        // Aquí podrías agregar más verificaciones según lo que esperas que haga el controlador.
    }

    public function testAplicacionDeAspiranteConTokenInvalido(): void {
        // Configurar el comportamiento esperado del mock para que falle al validar el token
        $this->mockTokenService
            ->method('validarToken')
            ->willThrowException(new Exception('Token no proporcionado o formato incorrecto', 401));

        // Datos simulados para la aplicación del aspirante
        $data = ['idconvocatoria' => 1];

        // Configurar el mock para verificar que se llama el método responderError con el mensaje de error
        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responderError')
            ->with($this->equalTo('Token no proporcionado o formato incorrecto'), $this->equalTo(401))
            ->willReturn(null); // Simula la respuesta sin hacer nada

        // Llamar al método que estamos probando
        $this->aspiranteController->aplicacionDeAspirante($data);
    }

    public function testAplicacionDeAspiranteConParametrosFaltantes(): void {
        // Configurar el comportamiento esperado del mock para un token válido
        $this->mockTokenService
            ->method('validarToken')
            ->willReturn('someValidToken'); // Devuelve un token válido

        // Datos simulados sin el parámetro 'idconvocatoria'
        $data = [];

        // Configurar el mock para verificar que se llama el método responderError con el mensaje de error
        $this->mockJsonResponseService
            ->expects($this->once())
            ->method('responderError')
            ->with($this->equalTo('Parámetros faltantes'), $this->equalTo(400))
            ->willReturn(null); // Simula la respuesta sin hacer nada

        // Llamar al método que estamos probando
        $this->aspiranteController->aplicacionDeAspirante($data);
    }
}
