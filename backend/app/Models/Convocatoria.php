<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Convocatoria extends Model
{
    use HasFactory;
    protected $table = 'convocatoria';
    public $timestamps = false;

    protected $fillable = [
        ''
    ];

    public function cargo()
    {
        return $this->belongsTo(Cargo::class, 'cargo_idcargo');
    }
}

?>