<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Controller;

use Controller\AusenciaController;
use Model\Ausencia;
use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Service\JsonResponseService;
use Service\TokenService;

class AusenciaControllerTest extends TestCase
{
    private AusenciaController $controller;
    private MockObject $mockAusencia;
    private MockObject $mockTokenService;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        $this->mockAusencia = $this->createMock(Ausencia::class);
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        $this->controller = $this->getMockBuilder(AusenciaController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        $ref = new \ReflectionClass(AusenciaController::class);

        $prop = $ref->getProperty('ausencia');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockAusencia);

        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockTokenService);

        $baseRef = $ref->getParentClass(); // BaseController
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testObtenerAusencias(): void
    {
        $num_doc = '12345';
        $resultadoEsperado = [['fecha' => '2025-05-02', 'motivo' => 'vacaciones']];

        $this->mockTokenService->method('validarToken')->willReturn($num_doc);
        $this->mockAusencia->expects($this->once())
            ->method('obtenerAusencias')
            ->with($num_doc)
            ->willReturn($resultadoEsperado);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['Ausencias' => $resultadoEsperado]);

        $this->controller->obtenerAusencias();
    }

    public function testSolicitarAusencia(): void
    {
        $num_doc = '12345';
        $data = ['fecha' => '2025-05-03', 'motivo' => 'enfermedad'];

        $this->mockTokenService->method('validarToken')->willReturn($num_doc);

        $this->mockAusencia->expects($this->once())
            ->method('solicitarAusencia')
            ->with($num_doc, $data);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Solicitud de ausencia registrada exitosamente']);

        $this->controller->solicitarAusencia($data);
    }

    public function testAusenciaAceptada(): void
    {
        $data = ['idausencia' => 15];

        $this->mockAusencia->expects($this->once())
            ->method('ausenciaAceptada')
            ->with(15)
            ->willReturn(true);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['success' => true]);

        $this->controller->ausenciaAceptada($data);
    }

    public function testAusenciaRechazada(): void
    {
        $data = ['idausencia' => 15];

        $this->mockAusencia->expects($this->once())
            ->method('ausenciaRechazada')
            ->with(15)
            ->willReturn(true);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with(['success' => true]);

        $this->controller->ausenciaRechazada($data);
    }
}
