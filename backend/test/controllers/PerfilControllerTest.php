<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

use PHPUnit\Framework\TestCase;
use Controller\PerfilController;
use Model\Perfil;
use Service\TokenService;
use Service\JsonResponseService;

class PerfilControllerTest extends TestCase
{
    public function testDatosPerfilSuccess()
    {
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        $mockPerfil = $this->createMock(Perfil::class);
        $mockPerfil->method('datosPerfil')->with('123456')->willReturn([
            'nombres' => 'Juan',
            'apellidos' => 'Pérez',
            'email' => 'juan@example.com'
        ]);

        $mockJsonResponseService = $this->getMockBuilder(JsonResponseService::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['responder'])
            ->getMock();

        $mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => '',
                'data' => [
                    'nombres' => 'Juan',
                    'apellidos' => 'Pérez',
                    'email' => 'juan@example.com'
                ]
            ]);

        $controller = $this->getMockBuilder(PerfilController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'perfil', $mockPerfil);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        $controller->datosPerfil();
    }

    public function testActualizarPerfilSuccess()
    {
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'juan@example.com',
            'tipodDoc' => 'CC'
        ];

        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        $mockPerfil = $this->createMock(Perfil::class);
        $mockPerfil->method('actualizarPerfil')
            ->with('123456', $data)
            ->willReturn(true);

        $mockJsonResponseService = $this->getMockBuilder(JsonResponseService::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['responder'])
            ->getMock();

        $mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => 'Perfil actualizado correctamente',
            ]);

        $controller = $this->getMockBuilder(PerfilController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'perfil', $mockPerfil);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        $controller->actualizarPerfil($data);
    } 

    public function testActualizarPerfilFaltanDatos()
    {
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Pérez'
            // Faltan 'email' y 'tipodDoc'
        ];

        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        $mockJsonResponseService = $this->getMockBuilder(JsonResponseService::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['responderError'])
            ->getMock();

        $mockJsonResponseService->expects($this->once())
            ->method('responderError')
            ->with(
                ['status' => 'error', 'message' => 'Faltan datos requeridos para actualizar el perfil'],
                400
            );

        $controller = $this->getMockBuilder(PerfilController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        $controller->actualizarPerfil($data);
    }

    public function testActualizarPerfilEmailInvalido()
    {
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Pérez',
            'email' => 'juan@invalid-email',
            'tipodDoc' => 'CC'
        ];

        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        $mockJsonResponseService = $this->getMockBuilder(JsonResponseService::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['responderError'])
            ->getMock();

        $mockJsonResponseService->expects($this->once())
            ->method('responderError')
            ->with(
                ['status' => 'error', 'message' => 'El formato del email no es válido'],
                400
            );

        $controller = $this->getMockBuilder(PerfilController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        $controller->actualizarPerfil($data);
    }

    public function testActualizarPerfilFallo()
    {
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Pérez',
            'email' => 'juan@example.com',
            'tipodDoc' => 'CC'
        ];

        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        $mockPerfil = $this->createMock(Perfil::class);
        $mockPerfil->method('actualizarPerfil')
            ->with('123456', $data)
            ->willReturn(false);

        $mockJsonResponseService = $this->getMockBuilder(JsonResponseService::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['responderError'])
            ->getMock();

        $mockJsonResponseService->expects($this->once())
            ->method('responderError')
            ->with(
                ['status' => 'error', 'message' => 'No se pudo actualizar el perfil'],
                500
            );

        $controller = $this->getMockBuilder(PerfilController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'perfil', $mockPerfil);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        $controller->actualizarPerfil($data);
    }

    // Método para inyectar dependencias privadas
    private function injectPrivate(object $object, string $property, $value): void
    {
        $reflection = new \ReflectionClass($object);
        $prop = $reflection->getProperty($property);
        $prop->setAccessible(true);
        $prop->setValue($object, $value);
    }
}
