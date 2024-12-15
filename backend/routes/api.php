<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EmpleadoController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\UsuarioController;

// Rutas de Usuario
Route::post('/registrarse', [UsuarioController::class, 'registrar']);
Route::post('/login', [UsuarioController::class, 'iniciar']);
Route::get('/convocatorias', [UsuarioController::class, 'obtenerConvocatorias'])->name('convocatorias');
Route::get('/estadisticas', [UsuarioController::class, 'obtenerTotalEstadisticas']);

// Rutas de Empleado
Route::get('/notificaciones', [EmpleadoController::class, 'obtenerNotificaciones']);
Route::get('/jornadas', [EmpleadoController::class, 'obtenerJornadas']);
Route::get('/ausencias', [EmpleadoController::class, 'obtenerAusencias']);
