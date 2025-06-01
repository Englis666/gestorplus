from pydantic import BaseModel

class Convocatoria(BaseModel):
    idconvocatoria: int
    nombreConvocatoria: str
    requisitos: str
