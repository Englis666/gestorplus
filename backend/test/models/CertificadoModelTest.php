<?php
use PHPUnit\Framework\TestCase;
use Model\Certificado;
use Service\DatabaseService;

class CertificadoModelTest extends TestCase {
    private $dbServiceMock;
    private Certificado $certificado;

    protected function setUp(): void {
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        $this->certificado = new Certificado($this->dbServiceMock);
    }

    public function testObtenerDatosParaCertificadoConResultados() {
        $num_doc = '123456789';
        $datosEsperados = [
            [
                'num_doc' => $num_doc,
                'nombre' => 'Juan',
                'apellido' => 'Pérez',
                'rol' => 'Estudiante',
                'evaluacion' => 'Aprobado',
                // otros campos simulados...
            ]
        ];

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT * FROM vinculacion'),
                $this->equalTo([':num_doc' => $num_doc])
            )
            ->willReturn($datosEsperados);

        $resultado = $this->certificado->obtenerDatosParaCertificado($num_doc);

        $this->assertEquals($datosEsperados, $resultado);
    }

    public function testObtenerDatosParaCertificadoSinResultados() {
        $num_doc = '987654321';

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->stringContains('SELECT * FROM vinculacion'),
                $this->equalTo([':num_doc' => $num_doc])
            )
            ->willReturn([]);

        $resultado = $this->certificado->obtenerDatosParaCertificado($num_doc);

        $this->assertEmpty($resultado);
    }

    public function testObtenerDatosParaCertificadoConExcepcion() {
        $num_doc = '555555555';

        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->willThrowException(new \PDOException('Error simulado'));

        $resultado = $this->certificado->obtenerDatosParaCertificado($num_doc);

        $this->assertEmpty($resultado);
    }
}
