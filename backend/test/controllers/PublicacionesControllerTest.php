<?php

use PHPUnit\Framework\TestCase;
use Controller\PublicacionesController;
use Model\Publicaciones;
use Service\TokenService;
use Service\JsonResponseService;

class PublicacionesControllerTest extends TestCase
{
    private $publicacionesMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;
    private $controller;

    protected function setUp(): void
    {
        $this->publicacionesMock = $this->createMock(Publicaciones::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        // Crea el controlador SIN ejecutar el constructor real
        $this->controller = $this->getMockBuilder(PublicacionesController::class)
            ->disableOriginalConstructor()
            ->onlyMethods([])
            ->getMock();

        // Inyección por Reflection
        $reflection = new \ReflectionClass($this->controller);
        $prop = $reflection->getProperty('publicaciones');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->publicacionesMock);

        $prop = $reflection->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->tokenServiceMock);

        // jsonResponseService puede estar en BaseController
        $base = $reflection->getParentClass();
        $prop = $base->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->jsonResponseServiceMock);
    }

    public function testObtenerPublicacionPorTipoDeContrato()
    {
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $publicaciones = [['id' => 1, 'titulo' => 'Test']];
        $this->publicacionesMock->expects($this->once())
            ->method('obtenerPublicacionPorTipoDeContrato')
            ->with(123)
            ->willReturn($publicaciones);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['Publicaciones' => $publicaciones]);
        $this->controller->obtenerPublicacionPorTipoDeContrato();
    }

    public function testAgregarPublicacionExitoso()
    {
        $data = ['titulo' => 'Nueva publicación'];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->publicacionesMock->expects($this->once())
            ->method('agregarPublicacion')
            ->with($data, 123)
            ->willReturn(true);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Publicación agregada exitosamente'], 201);
        $this->controller->agregarPublicacion($data);
    }

    public function testAgregarPublicacionFallo()
    {
        $data = ['titulo' => 'Nueva publicación'];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->publicacionesMock->expects($this->once())
            ->method('agregarPublicacion')
            ->with($data, 123)
            ->willReturn(false);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'Error al agregar la publicación'], 500);
        $this->controller->agregarPublicacion($data);
    }

    public function testActualizarPublicacionSinId()
    {
        $data = ['titulo' => 'Nueva publicación'];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'ID de publicación no proporcionado'], 400);
        $this->controller->actualizarPublicacion($data);
    }

    public function testActualizarPublicacionExitoso()
    {
        $data = ['idPublicacion' => 1, 'titulo' => 'Editada'];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->publicacionesMock->expects($this->once())
            ->method('actualizarPublicacion')
            ->with($data)
            ->willReturn(true);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Publicación actualizada exitosamente'], 200);
        $this->controller->actualizarPublicacion($data);
    }

    public function testActualizarPublicacionFallo()
    {
        $data = ['idPublicacion' => 1, 'titulo' => 'Editada'];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->publicacionesMock->expects($this->once())
            ->method('actualizarPublicacion')
            ->with($data)
            ->willReturn(false);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'Error al actualizar la publicación'], 500);
        $this->controller->actualizarPublicacion($data);
    }

    public function testEliminarPublicacionSinId()
    {
        $data = [];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'ID de publicación no proporcionado'], 400);
        $this->controller->eliminarPublicacion($data);
    }

    public function testEliminarPublicacionExitoso()
    {
        $data = ['idPublicacion' => 1];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->publicacionesMock->expects($this->once())
            ->method('eliminarPublicacion')
            ->with(1)
            ->willReturn(true);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with(['mensaje' => 'Publicación eliminada exitosamente'], 200);
        $this->controller->eliminarPublicacion($data);
    }

    public function testEliminarPublicacionFallo()
    {
        $data = ['idPublicacion' => 1];
        $this->tokenServiceMock->method('validarToken')->willReturn('123');
        $this->publicacionesMock->expects($this->once())
            ->method('eliminarPublicacion')
            ->with(1)
            ->willReturn(false);
        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with(['error' => 'Error al eliminar la publicación'], 500);
        $this->controller->eliminarPublicacion($data);
    }
}