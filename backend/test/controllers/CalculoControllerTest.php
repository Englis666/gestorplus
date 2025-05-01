<?php

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

        $this->controller = new CalculoController();

        $reflection = new ReflectionClass($this->controller);

        // Establecer las propiedades privadas
        $reflection->getProperty('tokenService')->setAccessible(true);
        $reflection->getProperty('tokenService')->setValue($this->controller, $this->tokenServiceMock);

        $reflection->getProperty('calculo')->setAccessible(true);
        $reflection->getProperty('calculo')->setValue($this->controller, $this->calculoMock);

        $reflection->getProperty('jsonResponseService')->setAccessible(true);
        $reflection->getProperty('jsonResponseService')->setValue($this->controller, $this->jsonResponseServiceMock);
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
