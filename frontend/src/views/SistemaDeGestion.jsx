/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import NavbarClosed from "../componentsClosed/Navbar";
import TablaSistemaDeGestion from "../componentsClosed/tables/TablaSistemaDeGestion";
import FormularioParaAgregarSistemasDeGestion from "../componentsClosed/form/FormularioParaAgregarSistemasDeGestion";
import { useLocation } from "react-router-dom";

const SistemaDeGestion = () => {
  const location = useLocation();
  const { num_doc, nombres, identrevista, idpostulacion } =
    location.state || {};

  const isFormDataAvailable =
    num_doc && nombres && identrevista && idpostulacion;

  return (
    <div
      className="bg-light min-vh-100 main-layout"
      style={{ transition: "all 3s ease", display: "flex" }}
    >
      <NavbarClosed />
      <div
        className="flex-grow-1 p-4 main-content"
        style={{ background: "#ECF0F1" }}
      >
        <TablaSistemaDeGestion />

        {isFormDataAvailable && (
          <FormularioParaAgregarSistemasDeGestion
            num_doc={num_doc}
            nombres={nombres}
            identrevista={identrevista}
            idpostulacion={idpostulacion}
          />
        )}
      </div>
    </div>
  );
};

export default SistemaDeGestion;
