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
        // Crear mocks de las dependencias
        $this->mockTokenService = $this->createMock(TokenService::class);
        $this->mockJsonResponseService = $this->createMock(JsonResponseService::class);
        $this->mockPerfil = $this->createMock(Perfil::class);

        // Crear la instancia del controlador y pasar los mocks
        $this->perfilController = new PerfilController();

        // Establecer los mocks
        $this->perfilController->jsonResponseService = $this->mockJsonResponseService;
        $this->perfilController->tokenService = $this->mockTokenService;
        $this->perfilController->perfil = $this->mockPerfil;
    }

    public function testDatosPerfil(): void {
        // Configurar el mock del TokenService para devolver un num_doc simulado
        $this->mockTokenService->method('validarToken')->willReturn('12345');
        
        // Configurar el mock de Perfil para devolver datos simulados
        $this->mockPerfil->method('datosPerfil')->willReturn([
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'juan.perez@example.com',
            'tipodDoc' => 'CC',
        ]);

        // Configurar el mock de JsonResponseService para verificar que responde correctamente
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

        // Ejecutar el método test
        $this->perfilController->datosPerfil();
    }

    public function testActualizarPerfilConDatosValidos(): void {
        // Simulando un token válido
        $this->mockTokenService->method('validarToken')->willReturn('12345');
        
        // Datos de entrada válidos para actualizar
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'juan.perez@example.com',
            'tipodDoc' => 'CC',
        ];

        // Configurar el mock de Perfil para que retorne true al intentar actualizar el perfil
        $this->mockPerfil->method('actualizarPerfil')->willReturn(true);

        // Configurar el mock de JsonResponseService para verificar que responde correctamente
        $this->mockJsonResponseService->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => 'Perfil actualizado correctamente',
            ]);

        // Ejecutar el método test
        $this->perfilController->actualizarPerfil($data);
    }

    public function testActualizarPerfilConDatosFaltantes(): void {
        // Simulando un token válido
        $this->mockTokenService->method('validarToken')->willReturn('12345');

        // Datos faltantes para el perfil (por ejemplo, sin email)
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            // 'email' => 'juan.perez@example.com',  // Falta el email
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
