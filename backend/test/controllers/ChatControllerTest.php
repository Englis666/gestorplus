<?php
declare(strict_types=1);

namespace Test\Controller;

use PHPUnit\Framework\TestCase;
use Controller\ChatController;
use Model\Chat;
use Service\TokenService;
use Service\JsonResponseService;
use PHPUnit\Framework\MockObject\MockObject;

class ChatControllerTest extends TestCase
{
    private ChatController $controller;
    private MockObject $mockChat;
    private MockObject $mockTokenService;
    private MockObject $mockJsonResponseService;

    protected function setUp(): void
    {
        // Crear mocks para dependencias
        $this->mockChat = $this->createMock(Chat::class);
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);

        // Crear mock parcial del controlador para stubear parametrosRequeridos
        $this->controller = $this->getMockBuilder(ChatController::class)
                                 ->onlyMethods(['parametrosRequeridos'])
                                 ->disableOriginalConstructor()
                                 ->getMock();

        // Inyectar mocks en propiedades privadas usando Reflection
        $ref = new \ReflectionClass(ChatController::class);

        // Inyectar chat
        $prop = $ref->getProperty('chat');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockChat);

        // Inyectar tokenService
        $prop = $ref->getProperty('tokenService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockTokenService);

        // Inyectar jsonResponseService (propiedad heredada de BaseController)
        $baseRef = $ref->getParentClass();
        $prop = $baseRef->getProperty('jsonResponseService');
        $prop->setAccessible(true);
        $prop->setValue($this->controller, $this->mockJsonResponseService);
    }

    public function testEnviarMensajeMissingParams(): void
    {
        $data = ['idChat' => 1];
        // validarToken debe retornar un emisor válido (string)
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('42');
        $this->controller->expects($this->once())
             ->method('parametrosRequeridos')
             ->with($data, ['idChat', 'mensaje'])
             ->willReturn(false);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('Faltan parámetros requeridos', 400);

        $this->controller->enviarMensaje($data);
    }

    public function testEnviarMensajeSuccess(): void
    {
        $data = ['idChat' => 1, 'mensaje' => 'Hola'];
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('42');
        $this->controller->expects($this->once())
             ->method('parametrosRequeridos')
             ->with($data, ['idChat', 'mensaje'])
             ->willReturn(true);
        $this->mockChat->expects($this->once())
             ->method('enviarMensaje')
             ->with(1, '42', 'Hola')
             ->willReturn(true);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responder')
             ->with([
                 'status' => 'success',
                 'message' => 'Mensaje enviado correctamente'
             ]);

        $this->controller->enviarMensaje($data);
    }

    public function testEnviarMensajeFail(): void
    {
        $data = ['idChat' => 1, 'mensaje' => 'Hola'];
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('42');
        $this->controller->expects($this->once())
             ->method('parametrosRequeridos')
             ->with($data, ['idChat', 'mensaje'])
             ->willReturn(true);
        $this->mockChat->expects($this->once())
             ->method('enviarMensaje')
             ->with(1, '42', 'Hola')
             ->willReturn(false);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('Error al enviar el mensaje', 500);

        $this->controller->enviarMensaje($data);
    }

    public function testObtenerIdChatInvalidToken(): void
    {
        // validarToken debe retornar string vacio para simular invalid token
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('');
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('Token inválido', 401);

        $this->controller->obtenerIdChat();
    }

    

    public function testObtenerOCrearChatMissingParams(): void
    {
        $data = ['num_doc_emisor' => 'A'];
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('num_doc_emisor y num_doc_receptor son requeridos', 400);

        $this->controller->obtenerOcrearChat($data);
    }

    public function testObtenerOCrearChatError(): void
    {
        $data = ['num_doc_emisor' => 'A', 'num_doc_receptor' => 'B'];
        $this->mockChat->expects($this->once())
             ->method('obtenerOcrearChat')
             ->with('A', 'B')
             ->willReturn(null);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('Error al obtener o crear el chat', 500);

        $this->controller->obtenerOcrearChat($data);
    }

    public function testObtenerOCrearChatSuccess(): void
    {
        $data = ['num_doc_emisor' => 'A', 'num_doc_receptor' => 'B'];
        $this->mockChat->expects($this->once())
             ->method('obtenerOcrearChat')
             ->with('A', 'B')
             ->willReturn(123);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responder')
             ->with([
                 'status' => 'success',
                 'idChat' => 123
             ]);

        $this->controller->obtenerOcrearChat($data);
    }

    public function testObtenerMensajesInvalidToken(): void
    {
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('');
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('Token inválido o no proporcionado', 401);

        $this->controller->obtenerMensajes();
    }

    public function testObtenerMensajesMissingIdChat(): void
    {
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('42');
        // No GET ni data con idChat
        $_GET = [];
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('idChat es requerido', 400);

        $this->controller->obtenerMensajes();
    }

    public function testObtenerMensajesSuccess(): void
    {
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('42');
        $data = ['idChat' => 5];
        $this->mockChat->expects($this->once())
             ->method('obtenerMensajes')
             ->with(5)
             ->willReturn(['m1', 'm2']);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responder')
             ->with([
                 'status' => 'success',
                 'mensajes' => ['m1', 'm2']
             ]);

        $this->controller->obtenerMensajes($data);
    }

    public function testObtenerMensajesError(): void
    {
        $this->mockTokenService->expects($this->once())
             ->method('validarToken')
             ->willReturn('42');
        $data = ['idChat' => 5];
        $this->mockChat->expects($this->once())
             ->method('obtenerMensajes')
             ->with(5)
             ->willReturn(false);
        $this->mockJsonResponseService->expects($this->once())
             ->method('responderError')
             ->with('Error al obtener los mensajes', 500);

        $this->controller->obtenerMensajes($data);
    }
}
