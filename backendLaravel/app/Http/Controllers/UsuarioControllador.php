<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Usuario;
use Firebase\JWT\JWT;
use Exception;

class UsuarioController extends Controller
{
    public function registrar(Request $request)
    {
        $validatedData = $request->validate([
            'num_doc' => 'required|string',
            'nombres' => 'required|string',
            'apellidos' => 'required|string',
            'email' => 'required|email',
            'tipodDoc' => 'required|string',
            'password' => 'required|string|min:6',
        ]);

        $usuario = new Usuario();
        $usuario->num_doc = $validatedData['num_doc'];
        $usuario->nombres = $validatedData['nombres'];
        $usuario->apellidos = $validatedData['apellidos'];
        $usuario->email = $validatedData['email'];
        $usuario->tipodDoc = $validatedData['tipodDoc'];
        $usuario->password = bcrypt($validatedData['password']); 
        $usuario->estado = 1;
        $usuario->rol_idrol = 4; 

        $usuario->save();

        return response()->json(['message' => 'Usuario registrado con éxito.'], 201);
    }

    // Inicio de sesión
    public function iniciar(Request $request)
    {
        $validatedData = $request->validate([
            'num_doc' => 'required|string',
            'password' => 'required|string',
        ]);

        $usuario = Usuario::where('num_doc', $validatedData['num_doc'])->first();

        if (!$usuario || !password_verify($validatedData['password'], $usuario->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Credenciales incorrectas'
            ], 401);
        }

        try {
            $secretKey = env('SECRET_KEY'); 

            $payload = [
                'iss' => '/',     
                'aud' => 'localhost', 
                'iat' => time(),  
                'exp' => time() + 3600, 
                'data' => [
                    'num_doc' => $usuario->num_doc,
                    'nombres' => $usuario->nombres,
                    'rol' => $usuario->rol_idrol,
                    'hojadevida_idHojadevida' => $usuario->hojadevida_idHojadevida
                ]
            ];

            $jwt = JWT::encode($payload, $secretKey);

            return response()->json([
                'status' => 'success',
                'message' => 'Credenciales correctas',
                'token' => $jwt
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al generar el token: ' . $e->getMessage()
            ], 500);
        }
    }

    public function obtenerConvocatorias()
    {
        $convocatorias = Usuario::getConvocatorias(); // Asumimos que el modelo tiene este método

        if ($convocatorias) {
            return response()->json(['convocatorias' => $convocatorias]);
        } else {
            return response()->json(['convocatorias' => []]);
        }
    }

    public function obtenerTotalEstadisticas()
    {
        $estadisticas = Usuario::getEstadisticas();

        return response()->json([
            'totalEntradas' => $estadisticas['totalEntradas'] ?? 0,
            'totalAusencias' => $estadisticas['totalAusencias'] ?? 0
        ]);
    }
}

?>
