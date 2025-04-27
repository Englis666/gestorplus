<?php
declare(strict_types=1);

namespace Controlador;

use Utils\PythonExecutor;
use Core\Controller\BaseController;
use Modelo\Postulacion;
use servicio\TokenService;
use PDO;
use Exception;

class PostulacionController extends BaseController{
    private PDO $db;
    private Postulacion $postulacion;
    private TokenService $tokenService;

    public function __construct(){
        parent::__construct();
        $this->db = (new \Config\Database())->getConnection();
        $this->postulacion = new Postulacion($this->db);
        $this->tokenService = new TokenService();
    }

    public function obtenerPostulaciones() {
        $this->jsonResponseService->responder(['Postulaciones' => $this->postulacion->obtenerPostulaciones()]);
    }

    public function obtenerConvocatoriasPostulaciones() {
        $this->jsonResponseService->responder(['ConvocatoriaPostulaciones' => $this->postulacion->obtenerConvocatoriasPostulaciones()]);
    }

    public function verificarPostulacion() {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null) return;

        $idconvocatoria = $_GET['idconvocatoria'] ?? null;
        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError('Parámetro idconvocatoria requerido', 400);
            return;
        }

        try {
            $resultados = $this->postulacion->verificarPostulacion($num_doc, $idconvocatoria);
            $this->jsonResponseService->responder(['status' => 'PostulacionVerificada', 'data' => $resultados]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 400);
        }
    }

    public function obtenerPostulacionesAspirante() {
        $num_doc = $this->tokenService->validarToken();
        if ($num_doc === null) return;

        try {
            $postulaciones = $this->postulacion->obtenerPostulacionesAspirante($num_doc);
            if (!$postulaciones) {
                $this->jsonResponseService->responderError('No hay postulaciones', 404);
                return;
            }
            $this->jsonResponseService->responder(['message' => 'MisPostulaciones', 'data' => $postulaciones]);
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode());
        }
    }

    /**
     * Obtiene postulaciones agrupadas por convocatoria y llama a la IA en Python
     */
    public function obtenerPostulacionesAgrupadasPorConvocatoria() {
        $idconvocatoria = $_GET['idconvocatoria'] ?? null;
        if (!$idconvocatoria) {
            $this->jsonResponseService->responderError('Parámetro idconvocatoria requerido', 400);
            return;
        }
    
        try {
            $postulantes = $this->postulacion
                               ->obtenerPostulacionesAgrupadasPorConvocatoria((int)$idconvocatoria);
    
            if (empty($postulantes)) {
                $this->jsonResponseService->responderError('No hay postulantes para esta convocatoria', 404);
                return;
            }
    
            $datos = [];
            foreach ($postulantes as $p) {
                $num_doc = (string) $p['num_doc'];
                $filas  = $this->postulacion->obtenerHojaDeVidaCompleta($num_doc);
    
                if (empty($filas)) {
                    $estructura = ['hojadevida' => null, 'estudios' => [], 'experiencias' => []];
                } else {
                    $h = $filas[0];
                    $base = [
                        'fechaNacimiento'  => $h['fechaNacimiento'],
                        'direccion'        => $h['direccion'],
                        'ciudad'           => $h['ciudad'],
                        'ciudadNacimiento' => $h['ciudadNacimiento'],
                        'telefono'         => $h['telefono'],
                        'telefonoFijo'     => $h['telefonoFijo'],
                        'estadohojadevida' => $h['estadohojadevida'],
                        'estadoCivil'      => $h['estadoCivil'],
                        'genero'           => $h['genero'],
                        'nivelEducativo'   => $h['nivelEducativo'],
                        'fotoPerfil'       => $h['fotoPerfil'],
                        'skills'           => $h['skills'],
                        'portafolio'       => $h['portafolio'],
                    ];
                    $estudios = [];
                    $experiencias = [];
                    foreach ($filas as $row) {
                        if (!empty($row['idestudio'])) {
                            $estudios[$row['idestudio']] = [
                                'nivelEstudio'       => $row['nivelEstudio'],
                                'areaEstudio'        => $row['areaEstudio'],
                                'estadoEstudio'      => $row['estadoEstudio'],
                                'fechaInicioEstudio' => $row['fechaInicioEstudio'],
                                'fechaFinEstudio'    => $row['fechaFinEstudio'],
                                'tituloEstudio'      => $row['tituloEstudio'],
                                'institucionEstudio' => $row['institucionEstudio'],
                                'ubicacionEstudio'   => $row['ubicacionEstudio'],
                                'modalidad'          => $row['modalidad'],
                                'paisInstitucion'    => $row['paisInstitucion'],
                                'duracionEstudio'    => $row['duracionEstudio'],
                                'materiasDestacadas' => $row['materiasDestacadas'],
                            ];
                        }
                        if (!empty($row['idexperienciaLaboral'])) {
                            $experiencias[$row['idexperienciaLaboral']] = [
                                'profesion'            => $row['profesion'],
                                'descripcionPerfil'    => $row['descripcionPerfil'],
                                'fechaInicioExp'       => $row['fechaInicioExp'],
                                'fechaFinExp'          => $row['fechaFinExp'],
                                'empresa'              => $row['empresa'],
                                'ubicacionEmpresa'     => $row['ubicacionEmpresa'],
                                'tipoContrato'         => $row['tipoContrato'],
                                'salario'              => $row['salario'],
                                'logros'               => $row['logros'],
                                'referenciasLaborales' => $row['referenciasLaborales'],
                            ];
                        }
                    }
                    $estructura = [
                        'hojadevida'   => $base,
                        'estudios'     => array_values($estudios),
                        'experiencias' => array_values($experiencias),
                    ];
                }
    
                $hojasParaAnalisis[] = [
                    'num_doc'    => $num_doc,       
                    'nombres'    => $p['nombres'],
                    'email'      => $p['email'],
                    'cargo'      => $p['cargo'],
                    'hojadevida' => $estructura,
                ];
            }
    
            $resultadoIA = PythonExecutor::ejecutar('/../IA/service/Hojadevida/analizarHojasDeVida.py' , $datos);
    
            $this->jsonResponseService->responder([
                'message' => 'Postulaciones con análisis IA',
                'data'    => $resultadoIA
            ]);
    
        } catch (Exception $e) {
            $this->jsonResponseService->responderError($e->getMessage(), $e->getCode() ?: 500);
        }
    }

}
