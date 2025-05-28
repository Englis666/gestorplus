import React from "react";
import { Route } from "react-router-dom";
import HomeRedirect from "../views/HomeRedirect";
import RecuperarPassword from "../views/RecuperarPassword";
import RestablecerPassword from "../views/RestablecerPassword";
import Login from "../views/Login";
import Registro from "../views/Registro";

const publicRoutes = [
  <Route path="/" element={<HomeRedirect />} key="/" />,
  <Route
    path="/RecuperarPassword"
    element={<RecuperarPassword />}
    key="/RecuperarPassword"
  />,
  <Route
    path="/RestablecerPassword"
    element={<RestablecerPassword />}
    key="/RestablecerPassword"
  />,
  <Route path="/Login" element={<Login />} key="/Login" />,
  <Route path="/Registro" element={<Registro />} key="/Registro" />,
];

export default publicRoutes;
