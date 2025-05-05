<?php
use PHPUnit\Framework\TestCase;
use Model\Chat;
use Service\DatabaseService;

class ChatModelTest extends TestCase {
    private $dbServiceMock;
    private Chat $chat;

    protected function setUp(): void {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->chat = new Chat($this->dbServiceMock);
    }

    public function testEnviarMensajeExitoso() {
        $idChat = 1;
        $num_doc_emisor = '123456789';
        $mensaje = 'Hola';

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('INSERT INTO mensajes'),
                $this->equalTo([
                    ':idChat' => $idChat,
                    ':num_doc_emisor' => $num_doc_emisor,
                    ':mensaje' => $mensaje
                ])
            )
            ->willReturn(true);

        $resultado = $this->chat->enviarMensaje($idChat, $num_doc_emisor, $mensaje);
        $this->assertTrue($resultado);
    }

    public function testEnviarMensajeConExcepcion() {
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->willThrowException(new PDOException("Error simulado"));

        $resultado = $this->chat->enviarMensaje(1, '123', 'Hola');
        $this->assertFalse($resultado);
    }

    public function testObtenerOcrearChatExistente() {
        $num_doc_emisor = '111';
        $num_doc_receptor = '222';
        $chatExistente = [['idChat' => 5]];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT idChat'),
                $this->equalTo([
                    ':num_doc_emisor' => $num_doc_emisor,
                    ':num_doc_receptor' => $num_doc_receptor
                ])
            )
            ->willReturn($chatExistente);

        $resultado = $this->chat->obtenerOcrearChat($num_doc_emisor, $num_doc_receptor);
        $this->assertEquals(5, $resultado);
    }

    public function testObtenerOcrearChatNuevo() {
        $num_doc_emisor = '111';
        $num_doc_receptor = '222';

        $this->dbServiceMock->expects($this->at(0))
            ->method('ejecutarConsulta')
            ->willReturn([]);

        $this->dbServiceMock->expects($this->at(1))
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('INSERT INTO chat'),
                $this->equalTo([
                    ':num_doc_emisor' => $num_doc_emisor,
                    ':num_doc_receptor' => $num_doc_receptor
                ]),
                true
            )
            ->willReturn(true);

        $this->dbServiceMock->expects($this->at(2))
            ->method('lastInsertId')
            ->willReturn(10);

        $resultado = $this->chat->obtenerOcrearChat($num_doc_emisor, $num_doc_receptor);
        $this->assertEquals(10, $resultado);
    }

    public function testObtenerOcrearChatConExcepcion() {
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->willThrowException(new PDOException("Error simulado"));

        $resultado = $this->chat->obtenerOcrearChat('111', '222');
        $this->assertNull($resultado);
    }

    public function testObtenerMensajesExitoso() {
        $idChat = 1;
        $mensajes = [
            [
                'mensaje' => 'Hola',
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'fecha_envio' => '2024-01-01 12:00:00'
            ]
        ];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT m.*, u.nombre, u.apellido'),
                $this->equalTo([':idChat' => $idChat])
            )
            ->willReturn($mensajes);

        $resultado = $this->chat->obtenerMensajes($idChat);
        $this->assertEquals($mensajes, $resultado);
    }

    public function testObtenerMensajesConExcepcion() {
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->willThrowException(new PDOException("Error"));

        $resultado = $this->chat->obtenerMensajes(1);
        $this->assertFalse($resultado);
    }
}
