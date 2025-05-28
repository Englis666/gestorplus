import React from "react";
import { Route } from "react-router-dom";
import InicioAspirante from "../views/aspirante/InicioAspirante";
import Trabajo from "../views/aspirante/Trabajo";
import DetallesDeTrabajo from "../views/aspirante/DetallesTrabajo";
import MisPostulaciones from "../views/aspirante/MisPostulaciones";

const aspiranteRoutes = [
  <Route
    path="/aspirante/inicio"
    element={<InicioAspirante />}
    key="/aspirante/inicio"
  />,
  <Route
    path="/aspirante/Trabajo"
    element={<Trabajo />}
    key="/aspirante/Trabajo"
  />,
  <Route
    path="/aspirante/DetallesDeTrabajo"
    element={<DetallesDeTrabajo />}
    key="/aspirante/DetallesDeTrabajo"
  />,
  <Route
    path="/aspirante/MisPostulaciones"
    element={<MisPostulaciones />}
    key="/aspirante/MisPostulaciones"
  />,
];

export default aspiranteRoutes;
