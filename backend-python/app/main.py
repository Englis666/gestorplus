from fastapi import FastAPI
from routes.analisis import router

app = FastAPI()
app.include_router(router, prefix="/api", tags=["Analisis"])