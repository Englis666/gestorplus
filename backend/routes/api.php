<?php

use App\Http\Controllers\ConvocatoriaController;

Route::get('convocatorias', [ConvocatoriaController::class, 'index']);

