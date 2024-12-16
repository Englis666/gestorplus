<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('convocatoria', function (Blueprint $table) {
            $table->id('idconvocatoria');
            $table->string('nombreConvocatoria');
            $table->string('descripcion');
            $table->string('requisitos');
            $table->decimal('salario', 10, 2);
            $table->int('cantidadConvocatoria');
            $table->int('cargo_idcargo');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('convocatorias');
    }
};
