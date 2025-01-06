import React, { useState, useEffect } from "react";
import {jwtDecode} from "jwt-decode"; 
import ModalHojaDeVida from "../componentsClosed/ModalHojadevida";
import Estudios from "../componentsClosed/ModalEstudios";
import Experiencia from "../componentsClosed/ModalExperienciaLaboral";
import axios from "axios";

const Perfil = () => {
  const [formData, setFormData] = useState({
    num_doc: "",
    nombres: "",
    apellidos: "",
    email: "",
    tipodDoc: "cedula de ciudadania",
    password: "",
    hojaDeVida: {},
    estudios: {},
    experienciaLaboral: {},
  });

  // Control de estados de los modales
  const [modalHojaDeVida, setModalHojaDeVida] = useState(false);
  const [modalEstudios, setModalEstudios] = useState(false);
  const [modalExperiencia, setModalExperiencia] = useState(false);

  // Obtener cookie
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const isTokenExpired = (decodedToken) => decodedToken.exp * 1000 < Date.now();

  const getUserData = async () => {
    const token = getCookie("auth_token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (isTokenExpired(decodedToken)) {
        alert("El token ha expirado.");
        return;
      }

      const response = await axios.get("http://localhost/gestorplus/backend/", {
        headers: { Authorization: `Bearer ${token}` },
        params: { action: "datosPerfil" },
      });

      if (response.status === 200) {
        console.log("Datos recibidos del backend:", response.data);

        const mappedData = mapData(response.data);
        console.log("Datos mapeados:", mappedData);

        setFormData((prevFormData) => ({ ...prevFormData, ...mappedData }));
      } else {
        console.error("Error al obtener los datos del usuario");
      }
    } catch (error) {
      console.error("Error al obtener los datos del usuario", error);
    }
  };

  const mapData = (data) => ({
    num_doc: data.num_doc || "", 
    nombres: data.nombres || "",
    apellidos: data.apellidos || "",
    email: data.email || "", 
    tipodDoc: data.tipodDoc|| "",
    password: "", 
    hojaDeVida: data.hojaDeVida || {},
    estudios: data.estudios || {},
    experienciaLaboral: data.experienciaLaboral || {},
  });

  // Ejecutar al montar el componente
  useEffect(() => {
    getUserData();
  }, []);

  // Manejador de cambios en los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Función para manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      action: "actualizarPerfil",
      num_doc: formData.num_doc,
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      tipodDoc: formData.tipodDoc,
    };

    const token = getCookie("auth_token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (isTokenExpired(decodedToken)) {
          alert("El token ha expirado.");
          return;
        }

        const response = await axios.put("http://localhost/gestorplus/backend/", data, {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "actualizarPerfil" },
        });

        if (response.status === 200) {
          alert("Perfil actualizado correctamente.");
        } else {
          alert("Hubo un error al actualizar el perfil.");
        }
      } catch (error) {
        console.error("Error al enviar los datos", error);
        alert("Ocurrió un error al actualizar los datos.");
      }
    } else {
      alert("No se encontró el token de autenticación.");
    }
  };

  // Funciones para controlar los modales
  const toggleModalHojaDeVida = () => setModalHojaDeVida(!modalHojaDeVida);
  const toggleModalEstudios = () => setModalEstudios(!modalEstudios);
  const toggleModalExperiencia = () => setModalExperiencia(!modalExperiencia);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center bg-light ms-5">
      <div className="row w-100">
        <div className="col-md-12 col-12 p-4 bg-white shadow rounded">
          <h2 className="text-primary">Configuración de perfil</h2>
          <p>Bienvenido, aquí podrás actualizar tu hoja de vida y tus datos.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="num_doc" className="form-label">Número de documento</label>
              <input
                type="number"
                className="form-control"
                name="num_doc"
                id="num_doc"
                value={formData.num_doc}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="nombres" className="form-label">Nombres</label>
              <input
                type="text"
                className="form-control"
                name="nombres"
                id="nombres"
                value={formData.nombres}
                readOnly
              />
            </div>
            <div className="mb-3">
              <label htmlFor="apellidos" className="form-label">Apellidos</label>
              <input
                type="text"
                className="form-control"
                name="apellidos"
                id="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                name="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tipodDoc" className="form-label">Tipo de documento</label>
              <select
                name="tipodDoc"
                id="tipodDoc"
                className="form-select"
                value={formData.tipodDoc}
                onChange={handleChange}
              >
                <option value="cedula de ciudadania">Cédula de ciudadanía</option>
                <option value="tarjeta de identidad">Tarjeta de identidad</option>
                <option value="cedula de extranjeria">Cédula de extranjería</option>
                <option value="pasaporte">Pasaporte</option>
              </select>
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                name="password"
                id="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary w-100 mb-3">Actualizar datos</button>
          </form>

          <div className="d-flex flex-column justify-content-center bg-white shadow rounded">
            <button onClick={toggleModalHojaDeVida} className="btn btn-primary mb-3">Agregar o actualizar Hoja de vida</button>
            <button onClick={toggleModalEstudios} className="btn btn-primary mb-3">Agregar estudios</button>
            <button onClick={toggleModalExperiencia} className="btn btn-primary">Agregar Experiencia</button>
          </div>
        </div>
      </div>

      {/* Modales */}
      <ModalHojaDeVida
        modalHojaDeVida={modalHojaDeVida}
        toggleModalHojaDeVida={toggleModalHojaDeVida}
      />
      <Estudios
        modalEstudios={modalEstudios}
        toggleModalEstudios={toggleModalEstudios}
      />
      <Experiencia
        modalExperiencia={modalExperiencia}
        toggleModalExperiencia={toggleModalExperiencia}
      />
    </div>
  );
};

export default Perfil;
