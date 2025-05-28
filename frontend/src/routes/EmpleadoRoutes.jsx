import React from "react";
import { Route } from "react-router-dom";
import Inicio from "../views/Inicio";
import Jornadas from "../views/Jornadas";
import HorasExtra from "../views/HorasExtra";
import Ausencias from "../views/Ausencias";
import Permisos from "../views/Permisos";
import Publicaciones from "../views/Publicaciones";
import Vacaciones from "../views/Vacaciones";
import Quejas from "../views/Quejas";
import Empleados from "../views/Empleados";
import Entrevistas from "../views/Entrevistas";
import Convocatorias from "../views/Convocatorias";
import Postulaciones from "../views/Postulaciones";
import Contratos from "../views/Contratos";
import SistemaDeGestion from "../views/SistemaDeGestion";
import Cargos from "../views/Cargos";
import PazySalvo from "../views/PazYSalvos";
import Certificados from "../views/Certificados";
import Perfil from "../views/perfil";

const empleadoRoutes = [
  <Route path="/Inicio" element={<Inicio />} key="/Inicio" />,
  <Route path="/Jornadas" element={<Jornadas />} key="/Jornadas" />,
  <Route path="/HorasExtra" element={<HorasExtra />} key="/HorasExtra" />,
  <Route path="/Ausencias" element={<Ausencias />} key="/Ausencias" />,
  <Route path="/Permisos" element={<Permisos />} key="/Permisos" />,
  <Route
    path="/Publicaciones"
    element={<Publicaciones />}
    key="/Publicaciones"
  />,
  <Route path="/Vacaciones" element={<Vacaciones />} key="/Vacaciones" />,
  <Route path="/Quejas" element={<Quejas />} key="/Quejas" />,
  <Route path="/Empleados" element={<Empleados />} key="/Empleados" />,
  <Route path="/Entrevistas" element={<Entrevistas />} key="/Entrevistas" />,
  <Route
    path="/Convocatorias"
    element={<Convocatorias />}
    key="/Convocatorias"
  />,
  <Route
    path="/Postulaciones"
    element={<Postulaciones />}
    key="/Postulaciones"
  />,
  <Route path="/Contratos" element={<Contratos />} key="/Contratos" />,
  <Route
    path="/SistemaDeGestion"
    element={<SistemaDeGestion />}
    key="/SistemaDeGestion"
  />,
  <Route path="/Cargos" element={<Cargos />} key="/Cargos" />,
  <Route path="/PazYsalvo" element={<PazySalvo />} key="/PazYsalvo" />,
  <Route path="/Certificados" element={<Certificados />} key="/Certificados" />,
  <Route path="/Perfil" element={<Perfil />} key="/Perfil" />,
];

export default empleadoRoutes;
