import React from "react";

const FiltroTrabajo = () => {
  return (
    <div>
      <section class="job-filter bg-light">
        <h1 class="heading mb-4">Buscar trabajos</h1>
        <form
          action=""
          method="post"
          class="p-4 bg-white border rounded shadows"
        >
          <div class="d-flex flex-wrap gap-3">
            <div class="box flex-grow-1">
              <label for="title" class="form-label">
                Título del trabajo <span class="text-danger">*</span>
              </label>
              <input
                type="text"
                name="title"
                id="title"
                placeholder="Palabra clave, categoría o cargo"
                required
                maxlength="20"
                class="form-control"
              />
            </div>
          </div>
        </form>
      </section>
    </div>
  );
};
export default FiltroTrabajo;
