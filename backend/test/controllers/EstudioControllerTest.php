<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use Controller\EstudioController;
use Service\TokenService;
use Service\JsonResponseService;
use Model\Estudio;
use PHPUnit\Framework\MockObject\MockObject;

class EstudioControllerTest extends TestCase
{
    private EstudioController $controller;
    private MockObject $mockEstudio;
    private MockObject $mockTokenService;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        // Crear mocks para dependencias
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockEstudio = $this->createMock(Estudio::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Instanciar controlador real
        $this->controller = new EstudioController();

        // Inyectar mocks en propiedades privadas mediante Reflection
        $refClass = new \ReflectionClass(EstudioController::class);

        // tokenService
        $prop = $refClass->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockTokenService);

        // estudio
        $prop = $refClass->getProperty('estudio');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockEstudio);

        // jsonResponseService (propiedad heredada de BaseController)
        $baseRef = $refClass->getParentClass();
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testObtenerEstudioSuccess(): void
    {
        // Simular token válido
        $decodedToken = (object)[
            'data' => (object)[ 'hojadevida_idHojadevida' => 1 ]
        ];
        $this->mockTokenService
             ->expects($this->once())
             ->method('obtenerPayload')
             ->willReturn($decodedToken);

        // Simular datos del modelo
        $estudios = [
            ['id' => 1, 'nombre' => 'Estudio 1'],
            ['id' => 2, 'nombre' => 'Estudio 2'],
        ];
        $this->mockEstudio
             ->expects($this->once())
             ->method('obtenerEstudio')
             ->with(1)
             ->willReturn($estudios);

        // Esperar la llamada al servicio de respuesta JSON
        $this->mockJsonResponseService
             ->expects($this->once())
             ->method('responder')
             ->with([
                 'status' => 'success',
                 'message' => 'Se obtuvieron los estudios',
                 'obtenerEstudio' => $estudios
             ]);

        // Ejecutar método
        $this->controller->obtenerEstudio();
    }

    public function testObtenerEstudioTokenError(): void
    {
        // Simular token inválido
        $this->mockTokenService
             ->expects($this->once())
             ->method('obtenerPayload')
             ->willReturn(null);

        // Esperar respuesta de error
        $this->mockJsonResponseService
             ->expects($this->once())
             ->method('responderError')
             ->with('No se pudo obtener el ID de la hoja de vida del token.', 400);

        // Ejecutar método
        $this->controller->obtenerEstudio();
    }

    // Puedes agregar aquí tests para agregarEstudio, actualizarEstudio y eliminarEstudio...
}
