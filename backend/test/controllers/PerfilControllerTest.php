<?php
use PHPUnit\Framework\TestCase;
use Controller\PerfilController;
use Service\TokenService;
use Service\JsonResponseService;
use Model\Perfil;
use Exception;

class PerfilControllerTest extends TestCase {
    private $perfilController;
    private $mockTokenService;
    private $mockJsonResponseService;
    private $mockPerfil;

    protected function setUp(): void {
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);
        $this->mockPerfil = $this->createMock(Perfil::class);

        $this->perfilController = new PerfilController();

        $this->perfilController->jsonResponseService = $this->mockJsonResponseService;
        $this->perfilController->tokenService = $this->mockTokenService;
        $this->perfilController->perfil = $this->mockPerfil;
    }

    public function testDatosPerfil(): void {
        $this->mockTokenService->method('validarToken')->willReturn('12345');
        
        $this->mockPerfil->method('datosPerfil')->willReturn([
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'juan.perez@example.com',
            'tipodDoc' => 'CC',
        ]);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => '',
                'data' => [
                    'nombres' => 'Juan',
                    'apellidos' => 'Perez',
                    'email' => 'juan.perez@example.com',
                    'tipodDoc' => 'CC',
                ]
            ]);

        $this->perfilController->datosPerfil();
    }

    public function testActualizarPerfilConDatosValidos(): void {
        $this->mockTokenService->method('validarToken')->willReturn('12345');
        
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'juan.perez@example.com',
            'tipodDoc' => 'CC',
        ];

        $this->mockPerfil->method('actualizarPerfil')->willReturn(true);

        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => 'Perfil actualizado correctamente',
            ]);
     

        $this->perfilController->actualizarPerfil($data);
    }

    public function testActualizarPerfilConDatosFaltantes(): void {
        $this->mockTokenService->method('validarToken')->willReturn('12345');

        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'tipodDoc' => 'CC',
        ];

        // Configurar el mock de JsonResponseService para verificar que se responde con error
        $this->mockJsonResponseService->expects($this->once())
            ->method('responderError')
            ->with([
                'status' => 'error',
                'message' => 'Faltan datos requeridos para actualizar el perfil',
            ], 400);

        // Ejecutar el método test
        $this->perfilController->actualizarPerfil($data);
    }

    public function testActualizarPerfilConEmailInvalido(): void {
        // Simulando un token válido
        $this->mockTokenService->method('validarToken')->willReturn('12345');

        // Datos con un email inválido
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'juan.perez@com', // Email inválido
            'tipodDoc' => 'CC',
        ];

        // Configurar el mock de JsonResponseService para verificar que se responde con error
        $this->mockJsonResponseService->expects($this->once())
            ->method('responderError')
            ->with([
                'status' => 'error',
                'message' => 'El formato del email no es válido',
            ], 400);

        // Ejecutar el método test
        $this->perfilController->actualizarPerfil($data);
    }
}
