<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Controller;

use Controller\PazySalvoController;
use Model\PazySalvo;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Service\JsonResponseService;
use Service\TokenService;
use ReflectionClass;
use Exception;

final class PazySalvoControllerTest extends TestCase
{
    private PazySalvoController $controller;
    private MockObject $mockPazySalvo;
    private MockObject $mockTokenService;
    private MockObject $mockJsonResponse;

    protected function setUp(): void
    {
        $this->mockPazySalvo = $this->createMock(PazySalvo::class);
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponse = $this->createMock(JsonResponseService::class);

        $this->controller = $this->getMockBuilder(PazySalvoController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        $ref = new ReflectionClass(PazySalvoController::class);

        $pazyProp = $ref->getProperty('pazysalvo');
        $pazyProp->setAccessible(true);
        $pazyProp->setValue($this->controller, $this->mockPazySalvo);

        $tokenProp = $ref->getProperty('tokenService');
        $tokenProp->setAccessible(true);
        $tokenProp->setValue($this->controller, $this->mockTokenService);

        $baseRef = $ref->getParentClass();
        $jsonProp = $baseRef->getProperty('jsonResponseService');
        $jsonProp->setAccessible(true);
        $jsonProp->setValue($this->controller, $this->mockJsonResponse);
    }

    public function testObtenerPazYSalvos(): void
    {
        $salvosEsperados = [['id' => 1, 'estado' => 'activo']];
        $this->mockPazySalvo->expects($this->once())
            ->method('obtenerPazYSalvos')
            ->willReturn($salvosEsperados);

        $this->mockJsonResponse->expects($this->once())
            ->method('responder')
            ->with(['Salvos' => $salvosEsperados]);

        $this->controller->obtenerPazYSalvos();
    }

    public function testObtenerMipazYSalvo(): void
    {
        $numDoc = '12345';
        $salvos = [['id' => 2, 'empleado' => $numDoc]];

        $this->mockTokenService->expects($this->once())
            ->method('validarToken')
            ->willReturn($numDoc);

        $this->mockPazySalvo->expects($this->once())
            ->method('obtenerMipazYSalvo')
            ->with($numDoc)
            ->willReturn($salvos);

        $this->mockJsonResponse->expects($this->once())
            ->method('responder')
            ->with(['Salvos' => $salvos]);

        $this->controller->obtenerMipazYSalvo();
    }

    public function testGenerarPazYSalvoCorrectamente(): void
    {
        $data = [
            'motivo' => 'Salida voluntaria',
            'fechaEmision' => '2025-05-02',
            'estado' => 'aprobado',
            'empleado' => '123456'
        ];

        $this->mockPazySalvo->expects($this->once())
            ->method('crearPazYSalvo')
            ->with([
                'motivo' => $data['motivo'],
                'fechaEmision' => $data['fechaEmision'],
                'estado' => $data['estado'],
                'empleado' => ['num_doc' => $data['empleado']]
            ]);

        $this->mockJsonResponse->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Paz y Salvo generado exitosamente']);

        $this->controller->generarPazYSalvo($data);
    }

    public function testGenerarPazYSalvoFallaPorEmpleadoFaltante(): void
    {
        $data = [
            'motivo' => 'Salida voluntaria',
            'fechaEmision' => '2025-05-02',
            'estado' => 'aprobado'
            // falta 'empleado'
        ];

        $this->mockJsonResponse->expects($this->once())
            ->method('responderError')
            ->with('Empleado no especificado correctamente en los datos', 400);

        $this->controller->generarPazYSalvo($data);
    }

    public function testObtenerPazYSalvosError(): void
    {
        $this->mockPazySalvo->method('obtenerPazYSalvos')
            ->willThrowException(new Exception('DB error'));

        $this->mockJsonResponse->expects($this->once())
            ->method('responder')
            ->with(['error' => 'Error al obtener Paz y Salvos'], 500);

        $this->controller->obtenerPazYSalvos();
    }

    public function testObtenerMipazYSalvoError(): void
    {
        $this->mockTokenService->method('validarToken')
            ->willThrowException(new Exception('Token inválido'));

        $this->mockJsonResponse->expects($this->once())
            ->method('responder')
            ->with(['error' => 'Error al obtener el Paz y Salvo'], 500);

        $this->controller->obtenerMipazYSalvo();
    }
}
