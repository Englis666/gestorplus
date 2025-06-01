from pydantic import BaseModel
from typing import Optional

class ExperienciaLaboral(BaseModel):
    profesion: Optional[str] = None
    descripcionPerfil: Optional[str] = None
    fechaInicioExp: Optional[str] = None
    fechaFinExp: Optional[str] = None
    cargo: Optional[str] = None
    empresa: Optional[str] = None
    ubicacionEmpresa: Optional[str] = None
    tipoContrato: Optional[str] = None
    salario: Optional[str] = None
    logros: Optional[str] = None
    referenciasLaborales: Optional[str] = None
