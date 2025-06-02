<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */


use PHPUnit\Framework\TestCase;
use Controller\EvaluacionController;
use Model\Evaluacion;
use Service\TokenService;
use Service\JsonResponseService;

class EvaluacionControllerTest extends TestCase
{
    private $evaluacionMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;
    private $controller;

    protected function setUp(): void
    {
        $this->evaluacionMock = $this->createMock(Evaluacion::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->getMockBuilder(JsonResponseService::class)
                                               ->onlyMethods(['responder'])
                                               ->getMock();

        // Crea el controlador SIN ejecutar el constructor real
        $this->controller = $this->getMockBuilder(EvaluacionController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        // Reemplazar propiedades protegidas con Reflection
        $reflection = new \ReflectionClass($this->controller);

        $evaluacionProp = $reflection->getProperty('evaluacion');
        $evaluacionProp->setAccessible(true);
        $evaluacionProp->setValue($this->controller, $this->evaluacionMock);

        $jsonServiceProp = $reflection->getProperty('jsonResponseService');
        $jsonServiceProp->setAccessible(true);
        $jsonServiceProp->setValue($this->controller, $this->jsonResponseServiceMock);

        $validatorMock = $this->createMock(\Service\ValidationService::class);
        $validatorMock->method('verificarDatosRequeridos')->willReturn(true);

        $baseRef = $reflection->getParentClass();
        $validatorProp = $baseRef->getProperty('validator');
        $validatorProp->setAccessible(true);
        $validatorProp->setValue($this->controller, $validatorMock);
    }

    public function testObtenerSistemaDeGestion()
    {
        $sistemaMock = ['gestion1', 'gestion2'];

        $this->evaluacionMock->expects($this->once())
            ->method('obtenerSistemaDeGestion')
            ->willReturn($sistemaMock);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['sistemaDeGestion' => $sistemaMock], 200);

        $this->controller->obtenerSistemaDeGestion();
    }

    public function testGuardarResultadosSistemaDeGestionConExito()
    {
        $data = [
            'identrevista' => 1,
            'idpostulacion' => 2,
            'estado_salud' => 'bueno',
            'evaluacionRiesgos' => 'ninguno',
            'recomendaciones' => 'ninguna',
            'aptitudLaboral' => 'apto',
            'comentarios' => 'todo bien',
            'estadoEvaluacion' => 'finalizada'
        ];

        // Mock del método interno usando un Closure
        $reflection = new ReflectionClass($this->controller);
        $method = $reflection->getMethod('parametrosRequeridos');
        $method->setAccessible(true);
        $parametrosOk = $method->invokeArgs($this->controller, [$data, array_keys($data)]);
        $this->assertTrue($parametrosOk); // Confirmamos que pasaría la validación

        $this->evaluacionMock->expects($this->once())
            ->method('guardarResultadosSistemaDeGestion')
            ->with($data)
            ->willReturn(true);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['success' => true, 'message' => 'Resultados guardados con éxito.'], 200);

        $this->controller->guardarResultadosSistemaDeGestion($data);
    }
}
