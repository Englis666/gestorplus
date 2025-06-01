from pydantic import BaseModel

class Cargo(BaseModel):
    idcargo: int
    nombreCargo: str