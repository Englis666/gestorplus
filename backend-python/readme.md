# GestorPlus Backend Python

Este es el backend modular de **GestorPlus**, desarrollado con [FastAPI](https://fastapi.tiangolo.com/) y estructurado por modelos, rutas y servicios para facilitar el mantenimiento y la escalabilidad.

---

## 🚀 Características

- **API REST** con FastAPI.
- Arquitectura modular: separación de modelos, rutas y lógica de negocio.
- Listo para desarrollo y producción con Docker.
- Validación de datos robusta con Pydantic.
- Recarga automática en desarrollo (`--reload`).
- Fácil integración con frontend y otros servicios.

---

## 🐳 Uso con Docker

### 1. **Construir y levantar el servicio**

```sh
docker-compose up --build
```

Esto levantará el backend en modo desarrollo con recarga automática en [http://localhost:5000](http://localhost:5000).

### 2. **Variables importantes**

- El backend expone el puerto `5000`.
- El código fuente se monta como volumen para recarga en caliente.

---

## 🛠️ Endpoints principales

- **POST** `/api/analizar-hojadevida`  
  Analiza una hoja de vida y retorna puntaje, detalle y razones.

### Ejemplo de request:

```json
{
  "hoja": {
    "idHojadevida": 1,
    "fechaNacimiento": "2000-01-01",
    "direccion": "...",
    "ciudad": "...",
    "ciudadNacimiento": "...",
    "telefono": "...",
    "telefonoFijo": "...",
    "estadohojadevida": "...",
    "estadoCivil": "...",
    "genero": "...",
    "habilidades": "...",
    "portafolio": "...",
    "experiencia": [],
    "estudios": []
  },
  "cargo": {
    "idcargo": 1,
    "nombreCargo": "..."
  },
  "convocatoria": {
    "idconvocatoria": 1,
    "nombreConvocatoria": "...",
    "requisitos": "..."
  }
}
```

---

## 🧩 Estructura modular

- **models/**: Definición de modelos Pydantic (uno por tabla/recurso).
- **routes/**: Endpoints agrupados por recurso.
- **services/**: Lógica de negocio y helpers.

---

## 📝 Notas

- Todos los modelos deben tener los mismos nombres de campos (y mayúsculas/minúsculas) que los datos enviados desde el frontend o PHP.
- Si ves errores 422, revisa que el JSON enviado coincida exactamente con los modelos.
- Puedes extender la API agregando más rutas y servicios según tus necesidades.

---

## 👨‍💻 Desarrollo

- El código se recarga automáticamente al guardar cambios.
- Puedes agregar tests en una carpeta `tests/` si lo deseas.

---

## 📄 Licencia

MIT

---

**Desarrollado por CodeAdvance para GestorPlus**
