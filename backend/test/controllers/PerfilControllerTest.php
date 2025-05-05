<?php
declare(strict_types = 1);

use PHPUnit\Framework\TestCase;
use Controller\PerfilController;
use Model\Perfil;
use Service\TokenService;
use Service\JsonResponseService;

class PerfilControllerTest extends TestCase
{
    private $perfilMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;
    private $controller;

    protected function setUp(): void
    {
        $this->perfilMock = $this->createMock(Perfil::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        $refClass = new ReflectionClass(PerfilController::class);
        $this->controller = $refClass->newInstanceWithoutConstructor();

        $this->setPrivateProperty($this->controller, 'perfil', $this->perfilMock);
        $this->setPrivateProperty($this->controller, 'tokenService', $this->tokenServiceMock);
        $this->setPrivateProperty($this->controller, 'jsonResponseService', $this->jsonResponseServiceMock);
        $this->setPrivateProperty($this->controller, 'db', $this->createMock(PDO::class)); 
    }

    private function setPrivateProperty(object $object, string $property, $value): void
    {
        $reflection = new ReflectionObject($object);
        $prop = $reflection->getProperty($property);
        $prop->setAccessible(true);
        $prop->setValue($object, $value);
    }

    public function testDatosPerfilSuccess()
    {
        $this->tokenServiceMock
            ->method('validarToken')
            ->willReturn('123456');

        $this->perfilMock
            ->method('datosPerfil')
            ->with('123456')
            ->willReturn(['nombres' => 'Juan']);

        $this->jsonResponseServiceMock
            ->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => '',
                'data' => ['nombres' => 'Juan']
            ]);

        $this->controller->datosPerfil();
    }

    public function testActualizarPerfilConDatosFaltantes()
    {
        $this->jsonResponseServiceMock
            ->expects($this->once())
            ->method('responderError')
            ->with([
                'status' => 'error',
                'message' => 'Faltan datos requeridos para actualizar el perfil'
            ], 400);

        $this->controller->actualizarPerfil([
            'nombres' => '',
            'apellidos' => 'Pérez',
            'email' => '',
            'tipodDoc' => ''
        ]);
    }

    public function testActualizarPerfilSuccess()
    {
        $this->tokenServiceMock
            ->method('validarToken')
            ->willReturn('123456');

        $data = [
            'nombres' => 'Carlos',
            'apellidos' => 'López',
            'email' => 'carlos@example.com',
            'tipodDoc' => 'CC'
        ];

        $this->perfilMock
            ->method('actualizarPerfil')
            ->with('123456', $data)
            ->willReturn(true);

        $this->jsonResponseServiceMock
            ->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => 'Perfil actualizado correctamente'
            ]);

        $this->controller->actualizarPerfil($data);
    }
}
