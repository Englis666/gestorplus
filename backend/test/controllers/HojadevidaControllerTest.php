<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Controller\HojadevidaController;
use Model\Hojadevida;
use Service\TokenService;
use Service\JsonResponseService;

class HojadevidaControllerTest extends TestCase
{
    private $hojadevidaMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;
    private $controller;

    protected function setUp(): void
    {
        $this->hojadevidaMock = $this->createMock(Hojadevida::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Crea el controlador SIN ejecutar el constructor real
        $this->controller = $this->getMockBuilder(HojadevidaController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        // Inyección por Reflection
        $reflection = new \ReflectionClass($this->controller);
        $prop = $reflection->getProperty('hojadevida');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->hojadevidaMock);

        $prop = $reflection->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->tokenServiceMock);

        $prop = $reflection->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testObtenerHojadevidaPorNumDocExitoso()
    {
        $_GET['num_doc'] = '123';
        $hojaDeVidaSimulada = ['id' => 1, 'nombre' => 'Test'];
        $this->hojadevidaMock->expects($this->once())
            ->method('obtenerHojadevidaPorNumDoc')
            ->with(123)
            ->willReturn($hojaDeVidaSimulada);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'data' => $hojaDeVidaSimulada
            ]);
        $this->controller->obtenerHojadevidaPorNumDoc();
    }

    public function testObtenerHojadevidaPorNumDocInvalido()
    {
        unset($_GET['num_doc']);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with("El número de documento es inválido", 400);
        $this->controller->obtenerHojadevidaPorNumDoc();
    }

    public function testObtenerHojadevidaPorNumDocNoEncontrado()
    {
        $_GET['num_doc'] = '999';
        $this->hojadevidaMock->expects($this->once())
            ->method('obtenerHojadevidaPorNumDoc')
            ->with(999)
            ->willReturn(null);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with("No se encontró la hoja de vida", 404);
        $this->controller->obtenerHojadevidaPorNumDoc();
    }

    public function testObtenerHojadevidaSuccess()
    {
        $payload = (object)['data' => (object)['hojadevida_idHojadevida' => 5]];
        $hojaDeVidaSimulada = ['id' => 5, 'nombre' => 'Test'];
        $this->tokenServiceMock->method('obtenerPayload')->willReturn($payload);
        $this->hojadevidaMock->method('obtenerHojadevida')->with(5)->willReturn($hojaDeVidaSimulada);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['status' => 'success', 'data' => $hojaDeVidaSimulada]);
        $this->controller->obtenerHojadevida();
    }

    public function testObtenerHojadevidaTokenInvalido()
    {
        $this->tokenServiceMock->method('obtenerPayload')->willReturn(null);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'No se pudo obtener el ID de la hoja de vida del token.'], 400);
        $this->controller->obtenerHojadevida();
    }

    public function testObtenerHojadevidaNoEncontrada()
    {
        $payload = (object)['data' => (object)['hojadevida_idHojadevida' => 7]];
        $this->tokenServiceMock->method('obtenerPayload')->willReturn($payload);
        $this->hojadevidaMock->method('obtenerHojadevida')->with(7)->willReturn(null);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'No se encontró la hoja de vida para el ID proporcionado.'], 404);
        $this->controller->obtenerHojadevida();
    }
}