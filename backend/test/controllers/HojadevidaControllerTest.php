<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */


use PHPUnit\Framework\TestCase;
use Controller\HojadeVidaController;
use Model\Hojadevida;
use Service\TokenService;
use Service\JsonResponseService;

class HojadevidaControllerTest extends TestCase
{
    private $hojadevidaMock;
    private $jsonResponseServiceMock;
    private $controller;

    protected function setUp(): void
    {
        $this->hojadevidaMock = $this->createMock(Hojadevida::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Crea el controlador SIN ejecutar el constructor real
        $this->controller = $this->getMockBuilder(HojadevidaController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        // Inyección por Reflection
        $reflection = new ReflectionClass($this->controller);

        $hojadevidaProp = $reflection->getProperty('hojadevida');
        $hojadevidaProp->setAccessible(true);
        $hojadevidaProp->setValue($this->controller, $this->hojadevidaMock);

        $jsonProp = $reflection->getProperty('jsonResponseService');
        $jsonProp->setAccessible(true);
        $jsonProp->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testObtenerHojadevidaPorNumDocExitoso()
    {
        // Simular GET
        $_GET['num_doc'] = '123456';

        $hojaMock = ['nombre' => 'Carlos', 'ciudad' => 'Medellín'];

        $this->hojadevidaMock->expects($this->once())
            ->method('obtenerHojadevidaPorNumDoc')
            ->with(123456)
            ->willReturn($hojaMock);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'data' => $hojaMock
            ]);

        $this->controller->obtenerHojadevidaPorNumDoc();
    }

    public function testObtenerHojadevidaPorNumDocInvalido()
    {
        unset($_GET['num_doc']); // Simula que no se pasa el parámetro

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with("El número de documento es inválido", 400);

        $this->controller->obtenerHojadevidaPorNumDoc();
    }
}
