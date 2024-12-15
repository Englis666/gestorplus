<?php
use App\Http\Controllers\UsuarioController;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\ChatController;
use illuminate\Support\Facades\Route;

Route::post('/registrarse', [UsuarioController::class, 'registrar']);
Route::post('/login', [UsuarioController::class, 'iniciar']);
Route::get('/convocatorias', [UsuarioController::class, 'obtenerConvocatorias']);
Route::get('/estadisticas', [UsuarioController::class, 'obtenerTotalEstadisticas']);


Route::get('/notificaciones', [EmpleadoController::class, 'obtenerNotificaciones']);
Route::get('/jornadas', [EmpleadoController::class, 'obtenerJornadas']);
Route::get('/ausencias', [EmpleadoController::class, 'obtenerAusencias']);

?>