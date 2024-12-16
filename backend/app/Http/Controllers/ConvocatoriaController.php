<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Convocatoria;
use Illuminate\Http\Request;

class ConvocatoriaController extends Controller
{
    public function index()
    {        
        $convocatoria = Convocatoria::all();
        return response()->json($convocatoria);

    }
}
