/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavbarClosed from "../componentsClosed/Navbar";
import ModalHojaDeVida from "../componentsClosed/modals/ModalHojadevida";
import Estudios from "../componentsClosed/modals/ModalEstudios";
import Experiencia from "../componentsClosed/modals/ModalExperienciaLaboral";
import EditarEstudio from "../componentsClosed/modals/ModalEditarEstudios";
import EditarExperiencia from "../componentsClosed/modals/ModalEditarExperiencia";
import axios from "axios";
import API_URL from "../config";
import { decodedTokenWithRol } from "../utils/Auth";
import Navbar from "../components/Navbar";

const Perfil = () => {
  const [formData, setFormData] = useState({
    num_doc: "",
    nombres: "",
    apellidos: "",
    email: "",
    tipodDoc: "",
    password: "",
    hojaDeVida: {},
    estudios: [],
    experienciaLaboral: [],
    originalData: {},
  });

  const [modalHojaDeVida, setModalHojaDeVida] = useState(false);
  const [modalEstudios, setModalEstudios] = useState(false);
  const [modalExperiencia, setModalExperiencia] = useState(false);
  const [modalEditarEstudio, setModalEditarEstudio] = useState(false);
  const [modalEditarExperiencia, setModalEditarExperiencia] = useState(false);
  const [estudios, setEstudios] = useState([]);
  const [experiencia, setExperiencia] = useState([]);
  const [seleccionado, setSeleccionado] = useState("Estudios");
  const [estudioSeleccionado, setEstudioSeleccionado] = useState(null);
  const [experienciaSeleccionada, setExperienciaSeleccionada] = useState(null);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  const isTokenExpired = (decodedToken) => decodedToken.exp * 1000 < Date.now();

  const getUserData = async () => {
    const token = getCookie("auth_token");

    try {
      const response = await axios.get(`${API_URL}datosPerfil`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      if (response.status === 200) {
        const mappedData = mapData(response.data.data);
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...mappedData,
          originalData: { ...mappedData },
        }));
      } else {
        alert("Error al obtener los datos del usuario");
      }
    } catch (error) {
      alert("Error al obtener los datos del usuario");
    }
  };

  const mapData = (data) => ({
    num_doc: data.num_doc || "",
    nombres: data.nombres || "",
    apellidos: data.apellidos || "",
    email: data.email || "",
    tipodDoc: data.tipodDoc || "",
    password: data.password || "",
    hojaDeVida: data.hojaDeVida || [],
    estudios: data.estudios || [],
    experienciaLaboral: data.experienciaLaboral || [],
  });

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const token = getCookie("auth_token");
    if (!token) return;

    const decodedToken = jwtDecode(token);
    if (isTokenExpired(decodedToken)) return;

    const fetchEstudios = async () => {
      try {
        const responseEstudios = await axios.get(`${API_URL}obtenerEstudio`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = responseEstudios.data?.obtenerEstudio || [];
        setEstudios(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener estudios:", error);
        setEstudios([]);
      }
    };

    const fetchExperienciaLaboral = async () => {
      try {
        const responseExperiencia = await axios.get(
          `${API_URL}obtenerExperiencia`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = responseExperiencia.data?.obtenerExperiencia || [];
        setExperiencia(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error al obtener experiencia laboral:", error);
        setExperiencia([]);
      }
    };

    fetchEstudios();
    fetchExperienciaLaboral();

    const intervalId = setInterval(() => {
      fetchEstudios();
      fetchExperienciaLaboral();
    }, 10000);

    return () => clearInterval(intervalId);
  }, []);

  const eliminarEstudioHandler = async (idestudio) => {
    const token = getCookie("auth_token");
    if (!token) return;

    try {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que deseas eliminar este estudio?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(`${API_URL}eliminarEstudio`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-estudio-id": idestudio,
        },
      });

      if (response.status === 200) {
        alert("Estudio eliminado");
        setEstudios((prevEstudios) =>
          prevEstudios.filter((estudio) => estudio.idestudio !== idestudio)
        );
      } else {
        alert("Hubo un error al eliminar el estudio.");
      }
    } catch (error) {
      alert("Ocurrió un error al eliminar el estudio.");
    }
  };

  const eliminarExperienciaHandler = async (idexperienciaLaboral) => {
    const token = getCookie("auth_token");
    if (!token) return;

    try {
      const confirmDelete = window.confirm(
        "¿Estás seguro de que deseas eliminar esta experiencia laboral?"
      );
      if (!confirmDelete) return;

      const response = await axios.delete(`${API_URL}eliminarExperiencia`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-experiencia-id": idexperienciaLaboral,
        },
      });

      if (response.status === 200) {
        setExperiencia((prevExperiencia) =>
          prevExperiencia.filter(
            (exp) => exp.idexperienciaLaboral !== idexperienciaLaboral
          )
        );
      } else {
        alert("Hubo un error al eliminar la experiencia.");
      }
    } catch (error) {
      alert("Ocurrió un error al eliminar la experiencia.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {
      nombres: formData.nombres,
      apellidos: formData.apellidos,
      email: formData.email,
      tipodDoc: formData.tipodDoc,
    };

    const token = getCookie("auth_token");
    if (!token) return;

    try {
      const decodedToken = jwtDecode(token);
      if (isTokenExpired(decodedToken)) return;

      const response = await axios.patch(
        `${API_URL}actualizarPerfil`,
        updatedData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          originalData: { ...prevFormData },
        }));
        alert("Perfil actualizado con éxito");
      } else {
        alert("Hubo un error al actualizar el perfil.");
      }
    } catch (error) {
      alert("Ocurrió un error al actualizar los datos.");
      console.error(
        "Error al actualizar los datos del perfil:",
        error.response?.data || error.message
      );
    }
  };

  const toggleModalHojaDeVida = () => setModalHojaDeVida(!modalHojaDeVida);
  const toggleModalEstudios = () => setModalEstudios(!modalEstudios);
  const toggleModalExperiencia = () => setModalExperiencia(!modalExperiencia);

  const toggleModalEditarEstudio = () => {
    setModalEditarEstudio(!modalEditarEstudio);
    if (!modalEditarEstudio) {
      setEstudioSeleccionado(null);
    }
  };

  const toggleModalEditarExperiencia = () => {
    setModalEditarExperiencia(!modalEditarExperiencia);
    if (!modalEditarExperiencia) {
      setExperienciaSeleccionada(null);
    }
  };

  const editarEstudioHandler = (estudio) => {
    setEstudioSeleccionado(estudio);
    setModalEditarEstudio(true);
  };

  const editarExperienciaHandler = (experiencia) => {
    setExperienciaSeleccionada(experiencia);
    setModalEditarExperiencia(true);
  };

  const agregarEstudio = (nuevoEstudio) => {
    if (nuevoEstudio) {
      setEstudios((prevEstudios) => [...prevEstudios, nuevoEstudio]);
    } else {
      const token = getCookie("auth_token");
      if (token) {
        axios
          .get(API_URL, {
            headers: { Authorization: `Bearer ${token}` },
            params: { action: "obtenerEstudio" },
          })
          .then((response) => {
            const data = response.data?.obtenerEstudio || [];
            setEstudios(Array.isArray(data) ? data : []);
          })
          .catch((error) => {
            console.error("Error al obtener estudios:", error);
          });
      }
    }
  };

  const agregarExperiencia = (nuevaExperiencia) => {
    if (nuevaExperiencia) {
      setExperiencia((prevExperiencia) => [
        ...prevExperiencia,
        nuevaExperiencia,
      ]);
    } else {
      const token = getCookie("auth_token");
      if (token) {
        axios
          .get(`${API_URL}obtenerExperiencia`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            const data = response.data?.obtenerExperiencia || [];
            setExperiencia(Array.isArray(data) ? data : []);
          })
          .catch((error) => {
            console.error("Error al obtener la experiencia laboral:", error);
          });
      }
    }
  };

  const editarEstudio = (estudioActualizado) => {
    setEstudios((prevEstudios) =>
      prevEstudios.map((estudio) =>
        estudio.idestudio === estudioActualizado.idestudio
          ? estudioActualizado
          : estudio
      )
    );
  };

  const editarExperiencia = (experienciaActualizada) => {
    setExperiencia((prevExperiencia) =>
      prevExperiencia.map((exp) =>
        exp.idexperienciaLaboral === experienciaActualizada.idexperienciaLaboral
          ? experienciaActualizada
          : exp
      )
    );
  };

  const rol = decodedTokenWithRol();

  return (
    <div>
      {rol === "4" ? <Navbar /> : <NavbarClosed />}
      <div className="main-content">
        <div className="container mt-5">
          <div className="row">
            {/* Contenedor principal a la izquierda */}
            <div className="col-md-6 mb-4">
              <div className="card shadow animated fadeIn">
                <div className="card-body">
                  <h2 className="card-title text-primary text-center mb-4">
                    Configuración de Perfil
                  </h2>
                  <p className="text-center mb-4">
                    Actualiza tu información personal y profesional.
                  </p>

                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="num_doc" className="form-label">
                        Número de documento
                      </label>
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
                      <label htmlFor="nombres" className="form-label">
                        Nombres
                      </label>
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
                      <label htmlFor="apellidos" className="form-label">
                        Apellidos
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="apellidos"
                        id="apellidos"
                        value={formData.apellidos}
                        readOnly
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">
                        Correo electrónico
                      </label>
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
                      <label htmlFor="tipodDoc" className="form-label">
                        Tipo de documento
                      </label>
                      <select
                        name="tipodDoc"
                        id="tipodDoc"
                        className="form-select"
                        value={formData.tipodDoc}
                        onChange={handleChange}
                      >
                        <option value="cedula de ciudadania">
                          Cédula de ciudadanía
                        </option>
                        <option value="tarjeta de identidad">
                          Tarjeta de identidad
                        </option>
                        <option value="cedula de extranjeria">
                          Cédula de extranjería
                        </option>
                        <option value="pasaporte">Pasaporte</option>
                      </select>
                    </div>
                    {/* <div className="mb-3">
                  <label htmlFor="password" className="form-label">Contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    id="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div> */}
                    <button
                      type="submit"
                      className="btn btn-primary w-100 mb-3 shadow-sm"
                    >
                      Actualizar datos
                    </button>
                  </form>

                  <div className="mt-4 d-grid gap-2">
                    <button
                      onClick={toggleModalHojaDeVida}
                      className="btn btn-outline-primary animated fadeInUp"
                    >
                      <i className="material-icons me-2">description</i> Hoja de
                      Vida
                    </button>
                    <button
                      onClick={toggleModalEstudios}
                      className="btn btn-outline-primary animated fadeInUp"
                    >
                      <i className="material-icons me-2">school</i> Estudios
                    </button>
                    <button
                      onClick={toggleModalExperiencia}
                      className="btn btn-outline-primary animated fadeInUp"
                    >
                      <i className="material-icons me-2">work</i> Experiencia
                      Laboral
                    </button>
                  </div>

                  <button
                    onClick={() => window.history.back()}
                    className="btn btn-secondary w-100 mt-3 animated fadeInUp"
                  >
                    <i className="material-icons me-2">arrow_back</i> Volver
                  </button>
                </div>
              </div>
            </div>

            {/* Contenedor de estudios y experiencia  */}
            <div className="col-md-6">
              <div className="card shadow animated fadeIn">
                <div className="card-body">
                  <div className="nav nav-tabs">
                    <select
                      value={seleccionado}
                      onChange={(e) => setSeleccionado(e.target.value)}
                      className="form-select animated fadeInUp"
                    >
                      <option value="Estudios">Estudios</option>
                      <option value="Experiencias">Experiencia Laboral</option>
                    </select>
                  </div>

                  <div className="mt-4">
                    {seleccionado === "Estudios" ? (
                      estudios.length > 0 ? (
                        estudios.map((estudio, index) => (
                          <div
                            key={index}
                            className="card mb-3 animated fadeInUp"
                          >
                            <div className="card-body">
                              <h5 className="card-title text-primary">
                                {estudio.tituloEstudio}
                              </h5>
                              <p className="card-text">
                                <strong>Institución:</strong>{" "}
                                {estudio.institucionEstudio} <br />
                                <strong>Nivel:</strong> {estudio.nivelEstudio}{" "}
                                <br />
                                <strong>Área:</strong> {estudio.areaEstudio}{" "}
                                <br />
                                <strong>Estado:</strong> {estudio.estadoEstudio}{" "}
                                <br />
                                <strong>Fecha de inicio:</strong>{" "}
                                {estudio.fechaInicioEstudio} <br />
                                <strong>Fecha de fin:</strong>{" "}
                                {estudio.fechaFinEstudio} <br />
                                <strong>Ubicación:</strong>{" "}
                                {estudio.ubicacionEstudio}
                              </p>
                              <div className="d-flex justify-content-end">
                                <button
                                  className="btn btn-sm btn-primary me-2"
                                  onClick={() => editarEstudioHandler(estudio)}
                                >
                                  <i className="material-icons">edit</i>
                                </button>
                                <button
                                  className="btn btn-sm btn-danger"
                                  onClick={() =>
                                    eliminarEstudioHandler(estudio.idestudio)
                                  }
                                >
                                  <i className="material-icons">delete</i>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center">
                          No hay estudios disponibles.
                        </p>
                      )
                    ) : experiencia.length > 0 ? (
                      experiencia.map((experiencia, index) => (
                        <div
                          key={index}
                          className="card mb-3 animated fadeInUp"
                        >
                          <div className="card-body">
                            <h5 className="card-title text-primary">
                              {experiencia.profesion}
                            </h5>
                            <p className="card-text">
                              <strong>Descripción del perfil:</strong>{" "}
                              {experiencia.descripcionPerfil} <br />
                              <strong>Fecha de inicio:</strong>{" "}
                              {experiencia.fechaInicioExp} <br />
                              <strong>Fecha de fin:</strong>{" "}
                              {experiencia.fechaFinExp}
                            </p>
                            <div className="d-flex justify-content-end">
                              <button
                                className="btn btn-sm btn-primary me-2"
                                onClick={() =>
                                  editarExperienciaHandler(experiencia)
                                }
                              >
                                <i className="material-icons">edit</i>
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() =>
                                  eliminarExperienciaHandler(
                                    experiencia.idexperienciaLaboral
                                  )
                                }
                              >
                                <i className="material-icons">delete</i>
                              </button>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center">
                        No hay experiencia laboral disponible.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <ModalHojaDeVida
            modalHojaDeVida={modalHojaDeVida}
            toggleModalHojaDeVida={toggleModalHojaDeVida}
          />
          <Estudios
            modalEstudios={modalEstudios}
            toggleModalEstudios={toggleModalEstudios}
            onAgregarEstudio={agregarEstudio}
          />
          <Experiencia
            modalExperiencia={modalExperiencia}
            toggleModalExperiencia={toggleModalExperiencia}
            onAgregarExperiencia={agregarExperiencia}
          />
          <EditarEstudio
            modalEditarEstudio={modalEditarEstudio}
            toggleModalEditarEstudio={toggleModalEditarEstudio}
            onEditarEstudio={editarEstudio}
            estudioSeleccionado={estudioSeleccionado}
          />
          <EditarExperiencia
            modalEditarExperiencia={modalEditarExperiencia}
            toggleModalEditarExperiencia={toggleModalEditarExperiencia}
            onEditarExperiencia={editarExperiencia}
            experienciaSeleccionada={experienciaSeleccionada}
          />
        </div>
      </div>
    </div>
  );
};

export default Perfil;
