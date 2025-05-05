<?php
declare(strict_types=1);

use PHPUnit\Framework\TestCase;
use Model\Jornada;
use Service\DatabaseService;

class JornadaModelTest extends TestCase
{
    private $dbServiceMock;
    private $jornada;

    protected function setUp(): void
    {
        // Creamos un mock de la clase DatabaseService
        $this->dbServiceMock = $this->createMock(DatabaseService::class);
        
        // Instanciamos la clase Jornada con el mock de DatabaseService
        $this->jornada = new Jornada($this->dbServiceMock);
    }

    public function testCorroborarJornada()
    {
        $idJornada = 1;

        // Simulamos que el método 'ejecutarUpdate' devuelve 'true' cuando la actualización es exitosa
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarUpdate')
            ->with(
                $this->anything(), // No nos importa el SQL exacto en este test
                [':idjornada' => $idJornada] // Aseguramos que los parámetros son correctos
            )
            ->willReturn(true); // Simulamos que la actualización fue exitosa

        // Ejecutamos el método y comprobamos si el resultado es el esperado
        $result = $this->jornada->corroborarJornada($idJornada);

        $this->assertTrue($result); // Esperamos que el resultado sea 'true'
    }

    public function testNoCorroborarJornada()
    {
        $idJornada = 2;

        // Simulamos que el método 'ejecutarUpdate' devuelve 'true' cuando la actualización es exitosa
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarUpdate')
            ->with(
                $this->anything(), // No nos importa el SQL exacto
                [':idjornada' => $idJornada] // Verificamos que los parámetros sean correctos
            )
            ->willReturn(true); // Simulamos que la actualización fue exitosa

        // Ejecutamos el método y comprobamos si el resultado es el esperado
        $result = $this->jornada->noCorroborarJornada($idJornada);

        $this->assertTrue($result); // Esperamos que el resultado sea 'true'
    }

    public function testObtenerTodasLasJornadas()
    {
        // Simulamos que 'ejecutarConsulta' devuelve un arreglo de jornadas
        $expectedResult = [
            ['idjornada' => 1, 'estadoJornada' => 'Pendiente'],
            ['idjornada' => 2, 'estadoJornada' => 'Pendiente'],
        ];

        // Simulamos que el método 'ejecutarConsulta' se llama con el SQL adecuado y devuelve los resultados esperados
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with($this->anything()) // No nos importa el SQL exacto
            ->willReturn($expectedResult);

        // Ejecutamos el método y verificamos que el resultado sea el esperado
        $result = $this->jornada->obtenerTodasLasJornadas();

        $this->assertSame($expectedResult, $result); // Comprobamos que el resultado sea igual al esperado
    }

    public function testObtenerJornadas()
    {
        $numDoc = '12345';
        $expectedResult = [
            ['idjornada' => 1, 'estadoJornada' => 'Pendiente', 'usuario_num_doc' => $numDoc],
        ];

        // Simulamos que el método 'ejecutarConsulta' devuelve los resultados esperados para un 'num_doc' específico
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarConsulta')
            ->with(
                $this->anything(), // No nos importa el SQL exacto
                [':num_doc' => $numDoc] // Verificamos que los parámetros sean correctos
            )
            ->willReturn($expectedResult);

        // Ejecutamos el método y verificamos que el resultado sea el esperado
        $result = $this->jornada->obtenerJornadas($numDoc);

        $this->assertSame($expectedResult, $result); // Comprobamos que el resultado sea igual al esperado
    }

    public function testFinalizarJornada()
    {
        $numDoc = '12345';
        $fecha = date('Y-m-d');
        $horaSalida = date('H:i:s');

        // Simulamos que el método 'ejecutarUpdate' devuelve 'true' cuando la actualización es exitosa
        $this->dbServiceMock->expects($this->once())
            ->method('ejecutarUpdate')
            ->with(
                $this->anything(), // No nos importa el SQL exacto
                [
                    ':horaSalida' => $horaSalida,
                    ':num_doc'    => $numDoc,
                    ':fecha'      => $fecha,
                ]
            )
            ->willReturn(true); // Simulamos que la actualización fue exitosa

        // Ejecutamos el método y comprobamos si el resultado es el esperado
        $result = $this->jornada->finalizarJornada($numDoc);

        $this->assertTrue($result); // Esperamos que el resultado sea 'true'
    }
}
