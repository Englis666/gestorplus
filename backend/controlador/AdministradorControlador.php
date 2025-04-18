<?php

namespace Controlador;

use Config\Database;
use Exception;
use Modelo\Administrador;
use Servicio\JsonResponseService;
use Servicio\TokenService;

class AdministradorControlador
{
    private Administrador $administrador;
    private Database $db;
    private JsonResponseService $jsonResponseService;
    private TokenService $tokenService;

    public function __construct()
    {
        $this->db = new Database();
        $this->administrador = new Administrador($this->db->getConnection());
        $this->tokenService = new TokenService();
        $this->jsonResponseService = new JsonResponseService();
    }

    protected function validarToken(): ?string
    {
        try {
            return $this->tokenService->validarToken();
        } catch (Exception $e) {
            $this->jsonResponseService->responder(['error' => $e->getMessage()], $e->getCode());
            return null;
        }
    }

    protected function verificarToken(): void
    {
        if ($this->validarToken() === null) {
            exit;
        }
    }

    private function responder(array $data, int $httpCode = 200): void
    {
        $this->jsonResponseService->responder($data, $httpCode);
    }

    private function verificarDatosRequeridos(array $data, array $camposRequeridos): bool
    {
        foreach ($camposRequeridos as $campo) {
            if (!isset($data[$campo])) {
                $this->responder(['error' => "Falta el campo requerido: $campo"], 400);
                return false;
            }
        }
        return true;
    }

    public function agregarCargo(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['nombreCargo'])) {
            return;
        }
        $resultado = $this->administrador->agregarCargo($data['nombreCargo']);
        $this->responder(['success' => true, 'cargo' => $resultado]);
    }

    public function agregarConvocatoria(array $data)
    {
        $required = ['nombreConvocatoria', 'descripcion', 'requisitos', 'salario', 'cantidadConvocatoria', 'idcargo'];
        if (!$this->verificarDatosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->administrador->agregarConvocatoria($data);
        $this->responder(['Convocatoria' => $resultado]);
    }

    public function asignarEntrevista(array $data)
    {
        $required = ['fecha', 'hora', 'lugarMedio'];
        if (!$this->verificarDatosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->administrador->asignarEntrevista($data);
        $this->responder(['Entrevista' => $resultado]);
    }

    public function asignarVinculacion(array $data)
    {
        $required = ['num_doc', 'fechaInicio', 'fechaFin', 'tipoContrato', 'salario', 'estadoContrato', 'fechaFirma'];
        if (!$this->verificarDatosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->administrador->asignarVinculacion($data);
        $this->responder(['Vinculacion' => $resultado]);
    }

    public function asistenciaConfirmada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['identrevista'])) {
            return;
        }
        $resultado = $this->administrador->asistenciaConfirmada($data['identrevista']);
        $this->responder(['Asistencia' => $resultado]);
    }

    public function asistenciaNoConfirmada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['identrevista'])) {
            return;
        }
        $resultado = $this->administrador->asistenciaNoConfirmada($data['identrevista']);
        $this->responder(['noAsistencia' => $resultado]);
    }

    public function buscarIdEvaluacion()
    {
        $identrevista = $_GET['identrevista'] ?? null;
        if (!$identrevista) {
            $this->responder(["error" => "Identificador de entrevista no encontrado"], 400);
            return;
        }

        $evaluacion = $this->administrador->buscarIdEvaluacion($identrevista);
        if ($evaluacion) {
            $this->responder(["encontrada" => true, "idevaluacion" => $evaluacion['idevaluacion']]);
        } else {
            $this->responder(["encontrada" => false]);
        }
    }

    public function corroborarJornada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->administrador->corroborarJornada($data['data']['idJornada']);
        $this->responder(['JornadaCorroborada' => $resultado]);
    }

    public function guardarResultadosSistemaDeGestion(array $data)
    {
        $required = ['identrevista', 'idpostulacion', 'estado_salud', 'evaluacionRiesgos', 'recomendaciones', 'aptitudLaboral', 'comentarios', 'estadoEvaluacion'];
        if (!$this->verificarDatosRequeridos($data, $required)) {
            return;
        }
        $resultado = $this->administrador->guardarResultadosSistemaDeGestion($data);

        if ($resultado) {
            $this->responder(['success' => true, 'message' => 'Resultados guardados con éxito.']);
        } else {
            $this->responder(['error' => 'No se pudo guardar en la base de datos.'], 500);
        }
    }

    public function noCorroborarJornada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idJornada']])) {
            return;
        }
        $resultado = $this->administrador->noCorroborarJornada($data['data']['idJornada']);
        $this->responder(['JornadaNoCorroborada' => $resultado]);
    }

    public function notificacionAceptada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idausencia']])) {
            return;
        }
        $resultado = $this->administrador->notificacionAceptada($data['data']['idausencia']);
        $this->responder(['Ausencia' => $resultado]);
    }

    public function notificacionRechazada(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idausencia']])) {
            return;
        }
        $resultado = $this->administrador->notificacionRechazada($data['data']['idausencia']);
        $this->responder(['success' => true, 'AusenciaRechaza' => $resultado]);
    }

    public function obtenerCargos()
    {
        $this->responder(['cargos' => $this->administrador->obtenerCargos()]);
    }

    public function obtenerCargosParaConvocatorias()
    {
        $this->responder(['Cargos' => $this->administrador->obtenerCargosParaConvocatorias()]);
    }

    public function obtenerConvocatorias()
    {
        $this->responder(['convocatorias' => $this->administrador->obtenerConvocatorias()]);
    }

    public function obtenerConvocatoriasPostulaciones()
    {
        $this->responder(['ConvocatoriaPostulaciones' => $this->administrador->obtenerConvocatoriasPostulaciones()]);
    }

    public function obtenerDatosDelEntrevistado(?string $num_doc = null)
    {
        $num_doc = $_GET['num_doc'] ?? $num_doc;
        $entrevistado = $this->administrador->obtenerDatosDelEntrevistado($num_doc);
        $this->responder(["Entrevistado" => $entrevistado ?: ["error" => "No se encontraron datos para el documento proporcionado"]]);
    }

    public function obtenerEmpleados()
    {
        $this->responder(['empleados' => $this->administrador->obtenerEmpleados()]);
    }

    public function obtenerEntrevistas()
    {
        $this->responder(['Entrevista' => $this->administrador->obtenerEntrevistas()]);
    }

    public function obtenerPazYSalvos()
    {
        $this->responder(['Salvos' => $this->administrador->obtenerPazYSalvos()]);
    }

    public function obtenerPostulaciones()
    {
        $this->responder(['Postulaciones' => $this->administrador->obtenerPostulaciones()]);
    }

    public function obtenerSistemaDeGestion()
    {
        $this->responder(['sistemaDeGestion' => $this->administrador->obtenerSistemaDeGestion()]);
    }

    public function obtenerTodasLasAusencias()
    {
        $this->responder(['Ausencias' => $this->administrador->obtenerTodasLasAusencias()]);
    }

    public function obtenerTodasLasEstadisticas()
    {
        $this->verificarToken();
        $estadisticas = $this->administrador->obtenerTotalEstadisticas();
        $this->responder([
            'totalEntradas' => $estadisticas['totalEntradas'],
            'totalAusencias' => $estadisticas['totalAusencias'],
        ]);
    }

    public function obtenerTodasLasHorasExtra()
    {
        $this->responder($this->administrador->obtenerTodasLasHorasExtra());
    }

    public function obtenerTodasLasJornadas()
    {
        $this->responder(['Jornadas' => $this->administrador->obtenerTodasLasJornadas()]);
    }

    public function obtenerTodasLasNotificaciones()
    {
        $this->verificarToken();
        $this->responder(['Notificaciones' => $this->administrador->obtenerTodasLasNotificaciones()]);
    }

    public function obtenerTodosLosPermisos()
    {
        $this->responder(['permisos' => $this->administrador->obtenerTodosLosPermisos()]);
    }

    public function obtenerTodasLasVacaciones()
    {
        $this->responder($this->administrador->obtenerTodasLasVacaciones());
    }

    public function obtenerUsuarios()
    {
        $this->responder(['RRHH' => $this->administrador->obtenerUsuarios()]);
    }

    public function obtenerVinculaciones()
    {
        $this->responder(['Vinculaciones' => $this->administrador->obtenerVinculaciones()]);
    }

    public function permisoAceptado(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idpermiso']])) {
            return;
        }
        $resultado = $this->administrador->permisoAceptado($data['data']['idpermiso']);
        $this->responder(['Permiso' => $resultado]);
    }

    public function permisoRechazado(array $data)
    {
        if (!$this->verificarDatosRequeridos($data, ['data' => ['idpermiso']])) {
            return;
        }
        $resultado = $this->administrador->permisoRechazado($data['data']['idpermiso']);
        $this->responder(['success' => true, 'permisoRechazado' => $resultado]);
    }
}