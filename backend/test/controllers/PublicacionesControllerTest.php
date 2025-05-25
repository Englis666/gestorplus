<?php
/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */


use PHPUnit\Framework\TestCase;
use Controller\PublicacionesController;
use Model\Publicaciones;
use Service\TokenService;
use Service\JsonResponseService;

class PublicacionesControllerTest extends TestCase{
    private $controller;
    private $tokenServiceMock;
    private $publicacionesMock;
    private $jsonResponseServiceMock;

    protected function setUp(): void
    {
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->publicacionesMock = $this->createMock(Publicaciones::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        $this->controller = new PublicacionesController();

        $reflection = new ReflectionClass($this->controller);

        $reflection->getProperty('tokenService')->setAccessible(true);
        $reflection->getProperty('tokenService')->setValue($this->controller, $this->tokenServiceMock);

        $reflection->getProperty('publicaciones')->setAccessible(true);
        $reflection->getProperty('publicaciones')->setValue($this->controller, $this->publicacionesMock);

        $reflection->getProperty('jsonResponseService')->setAccessible(true);
        $reflection->getProperty('jsonResponseService')->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testObtenerPublicacionPorTipoDeContrato()
    {
        $numDoc = '123456';
        $resultado = [['titulo' => 'Publicación 1']];

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn($numDoc);

        $this->publicacionesMock->expects($this->once())
            ->method('obtenerPublicacionPorTipoDeContrato')
            ->with($numDoc)
            ->willReturn($resultado);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['Publicaciones' => $resultado]);

        $this->controller->obtenerPublicacionPorTipoDeContrato();
    }

    public function testAgregarPublicacionExitoso()
    {
        $data = ['titulo' => 'Nueva publicación'];
        $numDoc = '123456';

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn($numDoc);

        $this->publicacionesMock->expects($this->once())
            ->method('agregarPublicacion')
            ->with($data, $numDoc)
            ->willReturn(true);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Publicación agregada exitosamente'], 201);

        $this->controller->agregarPublicacion($data);
    }

    public function testAgregarPublicacionFallo()
    {
        $data = ['titulo' => 'Fallida'];
        $numDoc = '123456';

        $this->tokenServiceMock->method('validarToken')->willReturn($numDoc);

        $this->publicacionesMock->method('agregarPublicacion')->willReturn(false);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'Error al agregar la publicación'], 500);

        $this->controller->agregarPublicacion($data);
    }

    public function testActualizarPublicacionSinId()
    {
        $data = [];

        $this->tokenServiceMock->method('validarToken')->willReturn('123456');

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'ID de publicación no proporcionado'], 400);

        $this->controller->actualizarPublicacion($data);
    }

    public function testActualizarPublicacionExitoso()
    {
        $data = ['idPublicacion' => 1, 'titulo' => 'Editado'];

        $this->tokenServiceMock->method('validarToken')->willReturn('123456');

        $this->publicacionesMock->method('actualizarPublicacion')
            ->with($data)
            ->willReturn(true);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Publicación actualizada exitosamente'], 200);

        $this->controller->actualizarPublicacion($data);
    }

    public function testEliminarPublicacionFalloPorFaltaDeID()
    {
        $data = [];

        $this->tokenServiceMock->method('validarToken')->willReturn('123456');

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'ID de publicación no proporcionado'], 400);

        $this->controller->eliminarPublicacion($data);
    }

    public function testEliminarPublicacionExitoso()
    {
        $data = ['idPublicacion' => 1];

        $this->tokenServiceMock->method('validarToken')->willReturn('123456');

        $this->publicacionesMock->expects($this->once())
            ->method('eliminarPublicacion')
            ->with(1)
            ->willReturn(true);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Publicación eliminada exitosamente'], 200);

        $this->controller->eliminarPublicacion($data);
    }
}
