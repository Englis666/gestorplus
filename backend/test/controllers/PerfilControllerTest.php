<?php
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

        // Mock Perfil
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

        // Instanciar el controller sin pasar dependencias
        $controller = new PerfilController();

        // Inyectar dependencias con reflexión
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

        $controller = new PerfilController();
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

        // Mock TokenService
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        // Mock JsonResponseService
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

        // Instanciar el controller
        $controller = new PerfilController();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        // Ejecutar el método
        $controller->actualizarPerfil($data);
    }

    public function testActualizarPerfilEmailInvalido()
    {
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Pérez',
            'email' => 'juan@invalid-email', // Email no válido
            'tipodDoc' => 'CC'
        ];

        // Mock TokenService
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        // Mock JsonResponseService
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

        // Instanciar el controller
        $controller = new PerfilController();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        // Ejecutar el método
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

        // Mock TokenService
        $mockTokenService = $this->createMock(TokenService::class);
        $mockTokenService->method('validarToken')->willReturn('123456');

        // Mock Perfil
        $mockPerfil = $this->createMock(Perfil::class);
        $mockPerfil->method('actualizarPerfil')
            ->with('123456', $data)
            ->willReturn(false); // Falla la actualización

        // Mock JsonResponseService
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

        // Instanciar el controller
        $controller = new PerfilController();
        $this->injectPrivate($controller, 'tokenService', $mockTokenService);
        $this->injectPrivate($controller, 'perfil', $mockPerfil);
        $this->injectPrivate($controller, 'jsonResponseService', $mockJsonResponseService);

        // Ejecutar el método
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
