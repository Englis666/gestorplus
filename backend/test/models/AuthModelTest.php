<?php
use PHPUnit\Framework\TestCase;
use Model\Auth;
use Service\DatabaseService;

class AuthModelTest extends TestCase
{
    private $dbMock;
    private $auth;

    protected function setUp(): void
    {
        $this->dbMock = $this->createMock(DatabaseService::class);
        $this->auth = new Auth($this->dbMock);
    }

    public function testRegistrarUsuarioExitoso()
    {
        $data = [
            'num_doc' => '123456',
            'nombres' => 'Juan',
            'apellidos' => 'Pérez',
            'email' => 'juan@example.com',
            'tipodDoc' => 'CC',
            'password' => '1234',
            'estado' => 'Activo',
            'rol_idrol' => 2
        ];

        $this->dbMock->expects($this->once())->method('iniciarTransaccion');
        $this->dbMock->expects($this->once())->method('ejecutarInsert')
            ->with("INSERT INTO hojadevida () VALUES ()")
            ->willReturn(10); // idHojaDeVida

        $this->dbMock->expects($this->once())->method('ejecutarAccion')
            ->with(
                $this->stringContains('INSERT INTO usuario'),
                $this->callback(fn($params) => $params[0] === $data['num_doc'] && $params[8] === 10)
            )
            ->willReturn(true);

        $this->dbMock->expects($this->once())->method('confirmarTransaccion');

        $resultado = $this->auth->registrar($data);
        $this->assertStringContainsString('Usuario registrado correctamente', $resultado);
    }

    public function testInicioSesionCorrectoConRegistroDeJornada()
    {
        $data = [
            'num_doc' => '123456',
            'password' => 'clave123'
        ];

        $usuario = [
            'num_doc' => '123456',
            'password' => password_hash('clave123', PASSWORD_DEFAULT),
            'nombres' => 'Juan',
            'rol_idrol' => 2,
            'hojadevida_idHojadevida' => 10
        ];

        $this->dbMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with("SELECT * FROM usuario WHERE num_doc = ?", ['123456'])
            ->willReturn($usuario);

        $this->dbMock->expects($this->atLeastOnce())
            ->method('ejecutarConsulta')
            ->with($this->stringContains('SELECT * FROM jornada'))
            ->willReturn([]); // No hay jornada existente

        $this->dbMock->expects($this->exactly(2))
            ->method('ejecutarAccion')
            ->withConsecutive(
                [$this->stringContains('INSERT INTO jornada')],
                [$this->stringContains('INSERT INTO notificacion')]
            )
            ->willReturn(true);

        $resultado = $this->auth->inicioSesion($data);
        $this->assertIsArray($resultado);
        $this->assertEquals('123456', $resultado['num_doc']);
    }

    public function testInicioSesionFallidoPorPasswordIncorrecta()
    {
        $data = [
            'num_doc' => '123456',
            'password' => 'malaclave'
        ];

        $usuario = [
            'num_doc' => '123456',
            'password' => password_hash('clave123', PASSWORD_DEFAULT),
            'nombres' => 'Juan',
            'rol_idrol' => 2,
            'hojadevida_idHojadevida' => 10
        ];

        $this->dbMock->method('ejecutarConsulta')->willReturn($usuario);
        $resultado = $this->auth->inicioSesion($data);
        $this->assertFalse($resultado);
    }
}
