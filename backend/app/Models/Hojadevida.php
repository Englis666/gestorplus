<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HojaDeVida extends Model
{
    use HasFactory;

    protected $table = 'hojadevida'; 
    public $timestamps = false; 

    protected $fillable = ['campo1', 'campo2', 'campo3']; 

    // Relación con Usuario
    public function usuario()
    {
        return $this->hasOne(Usuario::class,'idHojadevida','hojadevida_idHojadevida');
    }
}


?>