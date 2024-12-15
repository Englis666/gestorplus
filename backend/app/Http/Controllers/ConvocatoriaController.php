<?php
namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Convocatoria;

class ConvocatoriaController extends Controller
{
    public function index()
    {
        $convocatoria = Convocatoria::all();
        return response()->json($convocatoria);
    }

   
}

