<?php

use PHPUnit\Framework\TestCase;
use Controller\PerfilController;
use Service\JsonResponseService;
use Model\Perfil;
use Service\TokenService;
use PHPUnit\Framework\MockObject\MockObject;

class PerfilControllerTest extends TestCase {
    
    /** @var MockObject|Perfil */
    private $perfilMock;

    /** @var MockObject|TokenService */
    private $tokenServiceMock;

    /** @var MockObject|JsonResponseService */
    private $jsonResponseServiceMock;

    /** @var PerfilController */
    private $perfilController;

    protected function setUp(): void {
        $this->perfilMock = $this->createMock(Perfil::class);
        $this->tokenServiceMock = $this->createMock(TokenService::class);
        $this->jsonResponseServiceMock = $this->createMock(JsonResponseService::class);

        $this->perfilController = new PerfilController(
            $this->perfilMock, 
            $this->tokenServiceMock
        );

        $this->perfilController->setJsonResponseService($this->jsonResponseServiceMock);
    }

    public function testDatosPerfil(): void {
        $num_doc = '12345';
        $expectedResult = ['email' => 'user@domain.com'];

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn($num_doc);

        $this->perfilMock->expects($this->once())
            ->method('datosPerfil')
            ->with($num_doc)
            ->willReturn($expectedResult);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => '',
                'data' => $expectedResult
            ]);

        $this->perfilController->datosPerfil();
    }

    public function testActualizarPerfilConDatosValidos(): void {
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'juan.perez@example.com',
            'tipodDoc' => 'CC'
        ];

        $num_doc = '12345';

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn($num_doc);

        $this->perfilMock->expects($this->once())
            ->method('actualizarPerfil')
            ->with($num_doc, $data)
            ->willReturn(true);

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responder')
            ->with([
                'status' => 'success',
                'message' => 'Perfil actualizado correctamente',
            ]);

        $this->perfilController->actualizarPerfil($data);
    }

    public function testActualizarPerfilConDatosFaltantes(): void {
        $data = [
            'nombres' => 'Juan', 
            'apellidos' => 'Perez'
        ];

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn('12345');

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with([
                'status' => 'error',
                'message' => 'Faltan datos requeridos para actualizar el perfil'
            ], 400);

        $this->perfilController->actualizarPerfil($data);
    }

    public function testActualizarPerfilConEmailInvalido(): void {
        $data = [
            'nombres' => 'Juan',
            'apellidos' => 'Perez',
            'email' => 'invalid-email',
            'tipodDoc' => 'CC'
        ];

        $this->tokenServiceMock->expects($this->once())
            ->method('validarToken')
            ->willReturn('12345');

        $this->jsonResponseServiceMock->expects($this->once())
            ->method('responderError')
            ->with([
                'status' => 'error',
                'message' => 'El formato del email no es válido'
            ], 400);

        $this->perfilController->actualizarPerfil($data);
    }
}
