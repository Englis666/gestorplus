<?php
use PHPUnit\Framework\TestCase;
use Model\Archivo;
use Service\DatabaseService;

class ArchivoModelTest extends TestCase
{
    private $dbServiceMock;
    private Archivo $archivo;

    protected function setUp(): void
    {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->archivo = new Archivo($this->dbServiceMock);
    }

    public function testSubirContratoExitoso()
    {
        $this->dbServiceMock->expects($this->once())
            ->method('iniciarTransaccion');

        // Se esperan dos actualizaciones exitosas
        $this->dbServiceMock->expects($this->exactly(2))
            ->method('ejecutarUpdate')
            ->willReturn(true);

        $this->dbServiceMock->expects($this->once())
            ->method('confirmarTransaccion');

        $resultado = $this->archivo->subirContrato(1, '/uploads/archivo.pdf', '12345');
        $this->assertTrue($resultado);
    }

    public function testSubirContratoFallaPrimerUpdate()
    {
        $this->dbServiceMock->expects($this->once())
            ->method('iniciarTransaccion');

        // El primer update falla
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarUpdate')
            ->willReturn(false);

        $this->dbServiceMock->expects($this->once())
            ->method('revertirTransaccion');

        $resultado = $this->archivo->subirContrato(1, '/uploads/archivo.pdf', '12345');
        $this->assertFalse($resultado);
    }

    public function testSubirContratoFallaSegundoUpdate()
    {
        $this->dbServiceMock->expects($this->once())
            ->method('iniciarTransaccion');

        // El primer update (documento) es exitoso
        $this->dbServiceMock->expects($this->exactly(2))
            ->method('ejecutarUpdate')
            ->willReturnOnConsecutiveCalls(true, false);

        $this->dbServiceMock->expects($this->once())
            ->method('revertirTransaccion');

        $resultado = $this->archivo->subirContrato(1, '/uploads/archivo.pdf', '12345');
        $this->assertFalse($resultado);
    }

    public function testObtenerContratoDevuelveRuta()
    {
        $esperado = ['documentoContrato' => '/uploads/archivo.pdf'];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT documentoContrato FROM vinculacion'),
                [':num_doc' => '12345']
            )
            ->willReturn([$esperado]);

        $resultado = $this->archivo->obtenerContrato('12345');
        $this->assertEquals($esperado, $resultado);
    }

    public function testObtenerContratoRetornaNull()
    {
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->willReturn(null);

        $resultado = $this->archivo->obtenerContrato('99999');
        $this->assertNull($resultado);
    }
}
