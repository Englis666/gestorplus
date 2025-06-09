/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import { useLocation } from "react-router-dom";
import Navbar from "../../components/Navbar";
import DetallesTrabajo from "../../components/DetallesTrabajo";

const DetallesDeTrabajo = () => {
  const location = useLocation();
  const { idconvocatoria } = location.state || {};

  return (
    <div>
      <Navbar />

      {idconvocatoria ? (
        <DetallesTrabajo idconvocatoria={idconvocatoria} />
      ) : (
        <div>No se encontró la convocatoria seleccionada.</div>
      )}
    </div>
  );
};

export default DetallesDeTrabajo;
