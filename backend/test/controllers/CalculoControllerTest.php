<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */


use PHPUnit\Framework\TestCase;
use Controller\CalculoController;
use Model\Calculo;
use Service\TokenService;
use Service\JsonResponseService;

class CalculoControllerTest extends TestCase {
    private $controller;
    private $tokenServiceMock;
    private $calculoMock;
    private $jsonResponseServiceMock;

    protected function setUp(): void {
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->calculoMock = $this->createMock(Calculo::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Crea el controlador SIN ejecutar el constructor real
        $this->controller = $this->getMockBuilder(CalculoController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        $reflection = new \ReflectionClass($this->controller);

        $prop = $reflection->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->tokenServiceMock);

        $prop = $reflection->getProperty('calculo');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->calculoMock);

        $prop = $reflection->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testCalcularPostulacionesEnConvocatorias(): void {
        // Mock de lo que devuelve la función calcularPostulacionesEnConvocatorias
        $this->calculoMock->method('calcularPostulacionesEnConvocatorias')
            ->willReturn(['item1', 'item2']);
        
        // Expectativa para el método responder
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with($this->equalTo(['convocatorias' => ['item1', 'item2']]));

        // Llamada al método
        $this->controller->calcularPostulacionesEnConvocatorias();
    }

    public function testCalcularHorasExtra(): void {
        // Mock de lo que devuelve calcularHorasExtra
        $this->calculoMock->method('calcularHorasExtra')
            ->willReturn(['resultado']);

        // Expectativa para el método responder
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with($this->equalTo(['calculo' => ['resultado']]));

        // Llamada al método
        $this->controller->calcularHorasExtra();
    }

    public function testObtenerMinutosTrabajados(): void {
        // Mock de lo que devuelve obtenerMinutosTrabajados
        $this->calculoMock->method('obtenerMinutosTrabajados')
            ->willReturn(120); // Este sería el valor esperado

        // Expectativa para el método responder
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with($this->equalTo(['minutosTrabajados' => 120]));

        // Llamada al método
        $this->controller->obtenerMinutosTrabajados();
    }

    public function testObtenerMinutosTrabajadosDelEmpleado(): void {
        // Mock de lo que devuelve obtenerMinutosTrabajadosDelEmpleado
        $this->calculoMock->method('obtenerMinutosTrabajadosDelEmpleado')
            ->willReturn(80); // Este sería el valor esperado

        // Expectativa para el método responder
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with($this->equalTo(['minutosTrabajados' => 80]));

        // Llamada al método
        $this->controller->obtenerMinutosTrabajadosDelEmpleado();
    }
}
