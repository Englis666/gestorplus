<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Controller\PostulacionController;
use Model\Postulacion;
use Service\TokenService;
use Service\JsonResponseService;

class PostulacionControllerTest extends TestCase
{
    private $controller;
    private $postulacionMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;

    protected function setUp(): void
    {
        $this->postulacionMock = $this->createMock(Postulacion::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Instancia real del controlador (esto sí crea las propiedades)
        $this->controller = new PostulacionController();

        // Reemplazamos las propiedades privadas del controlador con nuestros mocks
        $reflection = new ReflectionClass($this->controller);
        $properties = [
            'postulacion' => $this->postulacionMock,
            'tokenService' => $this->tokenServiceMock,
            'jsonResponseService' => $this->jsonResponseServiceMock,
        ];

        foreach ($properties as $name => $mock) {
            if ($reflection->hasProperty($name)) {
                $prop = $reflection->getProperty($name);
                $prop->setAccessible(true);
                $prop->setValue($this->controller, $mock);
            }
        }
    }

    public function testObtenerPostulaciones()
    {
        $expected = [['id' => 1, 'nombre' => 'Test']];
        $this->postulacionMock->expects($this->once())
            ->method('obtenerPostulaciones')
            ->willReturn($expected);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['Postulaciones' => $expected]);

        $this->controller->obtenerPostulaciones();
    }

    public function testVerificarPostulacionFaltaIdConvocatoria()
    {
        $_GET = []; // No se define idconvocatoria

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn('123456');

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('Parámetro idconvocatoria requerido', 400);

        $this->controller->verificarPostulacion();
    }

    public function testObtenerPostulacionesAspiranteSinDatos()
    {
        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn('123456');

        $this->postulacionMock->expects($this->once())
            ->method('obtenerPostulacionesAspirante')
            ->willReturn([]);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with('No hay postulaciones', 404);

        $this->controller->obtenerPostulacionesAspirante();
    }
}
