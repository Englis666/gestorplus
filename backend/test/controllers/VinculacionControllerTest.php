<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use PHPUnit\Framework\MockObject\MockObject;
use Controller\VinculacionController;
use Model\Vinculacion;
use Service\JsonResponseService;
use Core\Controllers\BaseController;
use ReflectionClass;
use Exception;

final class VinculacionControllerTest extends TestCase
{
    private VinculacionController $controller;
    private MockObject $mockVinculacion;
    private MockObject $mockJsonResponse;

    protected function setUp(): void
    {
        $this->mockVinculacion  = $this->createMock(Vinculacion::class);
        $this->mockJsonResponse = $this->createMock(JsonResponseService::class);

        $this->controller = $this->getMockBuilder(VinculacionController::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['parametrosRequeridos'])
            ->getMock();

        $rc = new ReflectionClass(VinculacionController::class);
        $pVinc = $rc->getProperty('vinculacion');
        $pVinc->setAccessible(true);
        $pVinc->setValue($this->controller, $this->mockVinculacion);

        $rb = new ReflectionClass(BaseController::class);
        $pJson = $rb->getProperty('jsonResponseService');
        $pJson->setAccessible(true);
        $pJson->setValue($this->controller, $this->mockJsonResponse);
    }

    public function testAsignarVinculacionConDatosValidos(): void
    {
        $data = [
            'num_doc'        => '123',
            'fechaInicio'    => '2024-01-01',
            'fechaFin'       => '2024-12-31',
            'tipoContrato'   => 'Término fijo',
            'salario'        => 3000000,
            'estadoContrato' => 'Activo',
            'fechaFirma'     => '2024-01-01',
        ];

        $this->controller
            ->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, [
                'num_doc','fechaInicio','fechaFin',
                'tipoContrato','salario','estadoContrato','fechaFirma'
            ])
            ->willReturn(true);

        $this->mockVinculacion
            ->expects($this->once())
            ->method('asignarVinculacion')
            ->with($data)
            ->willReturn(true);

        $this->mockJsonResponse
            ->expects($this->once())
            ->method('responder')
            ->with(['Vinculacion' => true]);

        $return = $this->controller->asignarVinculacion($data);
        $this->assertNull($return);
    }

    public function testAsignarVinculacionConDatosIncompletos(): void
    {
        $data = ['num_doc' => '123'];

        $this->controller
            ->expects($this->once())
            ->method('parametrosRequeridos')
            ->with($data, $this->isType('array'))
            ->willReturn(false);

        $this->mockJsonResponse
            ->expects($this->once())
            ->method('responderError')
            ->with('Datos requeridos incompletos', 422);

        // Solo llama al método, no asumas retorno
        $this->controller->asignarVinculacion($data);
    }

    public function testObtenerVinculaciones(): void
    {
        $result = [
            ['num_doc' => '123', 'tipoContrato' => 'Fijo'],
            ['num_doc' => '456', 'tipoContrato' => 'Indefinido'],
        ];

        $this->mockVinculacion
            ->expects($this->once())
            ->method('obtenerVinculaciones')
            ->willReturn($result);

        $this->mockJsonResponse
            ->expects($this->once())
            ->method('responder')
            ->with(['Vinculaciones' => $result]);

        $return = $this->controller->obtenerVinculaciones();
        $this->assertNull($return);
    }
}
