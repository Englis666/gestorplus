<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\UsuarioController;

Route::post('/registrarse', [UsuarioController::class, 'registrar']);
Route::post('/login', [UsuarioController::class, 'iniciar']);
Route::middleware('api')->get('/api/convocatorias', [UsuarioController::class, 'obtenerConvocatorias']);
Route::get('/estadisticas', [UsuarioController::class, 'obtenerTotalEstadisticas']);



?>