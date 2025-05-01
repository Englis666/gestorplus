<?php

declare(strict_types=1);

namespace Tests\Controller;

use PHPUnit\Framework\TestCase;
use Controller\PermisoController;
use Model\Permiso;
use Service\TokenService;
use Service\jsonResponseService;
use PDO;
use ReflectionClass;

class PermisoControllerTest extends TestCase
{
    private PermisoController $controller;
    private $permisoMock;
    private $tokenServiceMock;
    private $jsonResponseServiceMock;
    private $dbMock;

    protected function setUp(): void
    {
        // Crear mocks
        $this->permisoMock = $this->createMock(Permiso::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(jsonResponseService::class);
        $this->dbMock = $this->createMock(PDO::class);

        // Instanciar controlador sin constructor para inyectar dependencias
        $ref = new ReflectionClass(PermisoController::class);
        $this->controller = $ref->newInstanceWithoutConstructor();

        // Inyectar propiedades privadas
        foreach (['permiso', 'tokenService', 'jsonResponseService', 'db'] as $prop) {
            $p = $ref->getProperty($prop);
            $p->setAccessible(true); // Asegúrate de que las propiedades sean accesibles

            // Inyección correcta de las dependencias
            switch ($prop) {
                case 'permiso':
                    $p->setValue($this->controller, $this->permisoMock);
                    break;
                case 'tokenService':
                    $p->setValue($this->controller, $this->tokenServiceMock);
                    break;
                case 'jsonResponseService':
                    $p->setValue($this->controller, $this->jsonResponseServiceMock);
                    break;
                case 'db':
                    $p->setValue($this->controller, $this->dbMock);
                    break;
            }
        }
    }

    public function testObtenerPermisos(): void
    {
        $this->tokenServiceMock
            ->method('validarToken')
            ->willReturn('user123');

        $expected = ['read', 'write'];
        $this->permisoMock
            ->method('obtenerPermisos')
            ->with('user123')
            ->willReturn($expected);

        $this->jsonResponseServiceMock
            ->expects($this->once())
            ->method('responder')
            ->with(['permisos' => $expected]);

        $this->controller->obtenerPermisos();
    }

    public function testSolicitarPermisoSuccess(): void
    {
        $data = ['foo' => 'bar'];
        $this->tokenServiceMock
            ->method('validarToken')
            ->willReturn('user123');
        $this->permisoMock
            ->method('solicitarPermiso')
            ->with('user123', $data)
            ->willReturn(true);

        $this->jsonResponseServiceMock
            ->expects($this->once())
            ->method('responder')
            ->with(['message' => 'Permiso solicitado']);

        $this->controller->solicitarPermiso($data);
    }

    public function testSolicitarPermisoError(): void
    {
        $data = ['foo' => 'bar'];
        $this->tokenServiceMock
            ->method('validarToken')
            ->willReturn('user123');
        $this->permisoMock
            ->method('solicitarPermiso')
            ->with('user123', $data)
            ->willReturn(false);

        $this->jsonResponseServiceMock
            ->expects($this->once())
            ->method('responder')
            ->with(['message' => 'Error al solicitar el permiso']);

        $this->controller->solicitarPermiso($data);
    }

    
    public function testObtenerTodosLosPermisos(): void
    {
        $expected = ['a', 'b', 'c'];
        $this->permisoMock
            ->method('obtenerTodosLosPermisos')
            ->willReturn($expected);
        $this->jsonResponseServiceMock
            ->expects($this->once())
            ->method('responder')
            ->with(['permisos' => $expected]);

        $this->controller->obtenerTodosLosPermisos();
    }
}
