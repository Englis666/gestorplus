from fastapi import FastAPI;
from pydantic import BaseModel;

app = FastAPI();

@app.get("/analizarHojasDeVida")
def analizar_hojas_de_vida():
    return {"message": "Analizando hojas de vida..."};