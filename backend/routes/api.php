<?php
use App\Http\Controllers\ConvocatoriaController;

Route::get('/api/convocatorias', [ConvocatoriaController::class, 'index']);
