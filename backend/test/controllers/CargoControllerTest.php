<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Controller;

use Controller\CargoController;
use Model\Cargo;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Service\JsonResponseService;
use Service\TokenService;
use Exception;
use ReflectionClass;

class CargoControllerTest extends TestCase
{
    private CargoController $controller;
    private MockObject $cargoMock;
    private MockObject $tokenServiceMock;
    private MockObject $jsonResponseServiceMock;

    protected function setUp(): void
    {
        $this->cargoMock = $this->createMock(Cargo::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        $this->controller = $this->getMockBuilder(CargoController::class)
            ->onlyMethods(['parametrosRequeridos', 'getIntParam'])
            ->disableOriginalConstructor()
            ->getMock();

        $ref = new ReflectionClass(CargoController::class);

        $prop = $ref->getProperty('cargo');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->cargoMock);

        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->tokenServiceMock);

        $baseRef = $ref->getParentClass();
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->jsonResponseServiceMock);

        $this->controller->method('parametrosRequeridos')->willReturn(true);
    }

    public function testObtenerCargosRespondeCorrectamente(): void
    {
        $cargos = [['id' => 1, 'nombre' => 'Gerente']];
        $this->cargoMock->method('obtenerCargos')->willReturn($cargos);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['cargos' => $cargos]);

        $this->controller->obtenerCargos();
    }

    public function testAgregarCargoRespondeCorrectamente(): void
    {
        $data = ['nombreCargo' => 'Supervisor'];
        $nuevoCargoId = 2;

        $this->cargoMock->expects($this->once())
            ->method('agregarCargo')
            ->with('Supervisor')
            ->willReturn($nuevoCargoId);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['success' => true, 'cargo' => $nuevoCargoId]);

        $this->controller->agregarCargo($data);
    }

    public function testActivarCargoRespondeCorrectamente(): void
    {
        $data = ['idCargo' => 1];
        $resultado = true;

        $this->cargoMock->expects($this->once())
            ->method('activarCargo')
            ->with(1)
            ->willReturn($resultado);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['success' => true, 'cargo' => $resultado]);

        $this->controller->activarCargo($data);
    }

    public function testDesactivarCargoRespondeCorrectamente(): void
    {
        $data = ['idCargo' => 1];
        $resultado = true;

        $this->cargoMock->expects($this->once())
            ->method('desactivarCargo')
            ->with(1)
            ->willReturn($resultado);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['success' => true, 'cargo' => $resultado]);

        $this->controller->desactivarCargo($data);
    }

    public function testDesactivarCargoLanzaExcepcion(): void
    {
        $data = ['idCargo' => 1];

        $this->cargoMock->method('desactivarCargo')
            ->with(1)
            ->willThrowException(new Exception('Error al desactivar'));

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['error' => 'Error al desactivar'], 400);

        $this->controller->desactivarCargo($data);
    }
}
