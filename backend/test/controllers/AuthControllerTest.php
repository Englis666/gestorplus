<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

use PHPUnit\Framework\TestCase;
use Controller\AuthController;
use Model\Auth;
use Service\TokenService;
use Service\AntiAttackForce;
use Service\JsonResponseService;

class AuthControllerTest extends TestCase
{
    private $controller;
    private $mockAuth;
    private $mockTokenService;
    private $mockAntiAttackForce;
    private $mockResponse;

    protected function setUp(): void
    {
        $this->mockAuth = $this->createMock(Auth::class);
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockAntiAttackForce = $this->createMock(AntiAttackForce::class);
        $this->mockResponse = $this->getMockBuilder(JsonResponseService::class)
            ->onlyMethods(['responder', 'responderError'])
            ->getMock();

        // Crea el controlador SIN ejecutar el constructor real
        $this->controller = $this->getMockBuilder(AuthController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        // Inyecta los mocks usando Reflection
        $ref = new \ReflectionClass($this->controller);

        $prop = $ref->getProperty('auth');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockAuth);

        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockTokenService);

        $prop = $ref->getProperty('antiAttackForce');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockAntiAttackForce);

        $prop = $ref->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockResponse);
    }

    public function testRegistrar()
    {
        $datosSimulados = [
            'num_doc' => '7891011',
            'nombres' => 'Ana López',
            'password' => '1234'
        ];

        $this->mockAuth->expects($this->once())
            ->method('registrar')
            ->with($this->callback(function ($data) {
                return isset($data['password']) && $data['password'] === '1234';
            }))
            ->willReturn("Usuario registrado correctamente");

        $this->mockResponse->expects($this->once())
            ->method('responder')
            ->with($this->callback(function ($response) {
                return $response['status'] === 'success'
                    && $response['message'] === 'Usuario registrado correctamente';
            }));

        $this->controller->registrar($datosSimulados);
    }

    public function testRegistrarDocumentoYaRegistrado()
    {
        $datosSimulados = [
            'num_doc' => '7891011',
            'nombres' => 'Ana López',
            'password' => '1234'
        ];

        $this->mockAuth->expects($this->once())
            ->method('registrar')
            ->willReturn("El número de documento ya está registrado.");

        $this->mockResponse->expects($this->once())
            ->method('responder')
            ->with($this->callback(function ($response) {
                return $response['status'] === 'error'
                    && $response['message'] === 'El número de documento ya está registrado.';
            }), 400);

        $this->controller->registrar($datosSimulados);
    }

    public function testIniciarConCredencialesCorrectas()
    {
        $datosLogin = [
            'num_doc' => '1014736',
            'password' => '123'
        ];

        $usuarioSimulado = [
            'num_doc' => '1014736',
            'nombres' => 'Englis Barros',
            'rol' => '1',
            'hojadevida_idHojadevida' => 10
        ];

        $this->mockAntiAttackForce->expects($this->once())->method('detectSuspiciousUserAgent');
        $this->mockAntiAttackForce->expects($this->once())->method('checkLoginAttempts')->with('1014736');
        $this->mockAuth->method('inicioSesion')->willReturn($usuarioSimulado);
        $this->mockAntiAttackForce->expects($this->once())->method('registerLoginAttempt')->with('1014736', true);

        $this->mockResponse->expects($this->once())
            ->method('responder')
            ->with($this->callback(function ($response) {
                return $response['status'] === 'success'
                    && $response['message'] === 'Credenciales correctas'
                    && isset($response['data']['token']);
            }));

        $this->controller->iniciar($datosLogin);
    }

    public function testIniciarConCredencialesIncorrectas()
    {
        $datosLogin = [
            'num_doc' => '123456',
            'password' => 'passwordIncorrecta'
        ];

        $this->mockAntiAttackForce->expects($this->once())->method('detectSuspiciousUserAgent');
        $this->mockAntiAttackForce->expects($this->once())->method('checkLoginAttempts')->with('123456');
        $this->mockAuth->method('inicioSesion')->willReturn(null);
        $this->mockAntiAttackForce->expects($this->once())->method('registerLoginAttempt')->with('123456', false);

        $this->mockResponse->expects($this->once())
            ->method('responder')
            ->with($this->callback(function ($response) {
                return $response['status'] === 'error'
                    && $response['message'] === 'Credenciales incorrectas';
            }), 401);

        $this->controller->iniciar($datosLogin);
    }
}
