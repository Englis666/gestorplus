import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import ModalHojaDeVida from "../componentsClosed/modals/ModalHojadevida";
import Estudios from "../componentsClosed/modals/ModalEstudios";
import Experiencia from "../componentsClosed/modals/ModalExperienciaLaboral";
import axios from "axios";

const Perfil = () => {
  const [formData, setFormData] = useState({
    num_doc: "",
    nombres: "",
    apellidos: "",
    email: "",
    tipodDoc: "",
    password: "", 
    hojaDeVida: {},
    estudios: {},
    experienciaLaboral: {},
    originalData: {},  
  });

  const [modalHojaDeVida, setModalHojaDeVida] = useState(false);
  const [modalEstudios, setModalEstudios] = useState(false);
  const [modalExperiencia, setModalExperiencia] = useState(false);
  const [error, setError] = useState(null);
  const [estudios, setEstudios] = useState([]);
  const [experiencia, setExperiencia] = useState([]);
  const [seleccionado, setSeleccionado] = useState("Estudios");

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
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...mappedData,
          originalData: { ...mappedData } 
        }));
      } else {
        console.error("Error al obtener los datos del usuario", error);
        alert("Error al obtener los datos del usuario");
      }
    } catch (error) {
      alert("Error al obtener los datos del usuario", error);
    }
  };

  const mapData = (data) => ({
    num_doc: data.num_doc || "",
    nombres: data.nombres || "",
    apellidos: data.apellidos || "",
    email: data.email || "",
    tipodDoc: data.tipodDoc || "",
    password: data.password || "", 
    hojaDeVida: data.hojaDeVida || {},
    estudios: data.estudios || {},
    experienciaLaboral: data.experienciaLaboral || {},
  });

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const token = getCookie("auth_token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    const decodedToken = jwtDecode(token);
    if (isTokenExpired(decodedToken)) {
      alert("El token ha expirado.");
      return;
    }

    const fetchEstudios = async () => {
      try {
        const responseEstudios = await axios.get("http://localhost/gestorplus/backend/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerEstudio" },
        });
        console.log("Datos de estudios recibidos:", responseEstudios.data);
        const data = responseEstudios.data?.obtenerEstudio || [];
        setEstudios(Array.isArray(data) ? data : [data]); // Asegúrate de que sea un arreglo
      } catch (error) {
        console.error("Error al obtener los estudios", error);
        setEstudios([]);
      }
    };

    const fetchExperienciaLaboral = async () => {
      try {
        const responseExperiencia = await axios.get("http://localhost/gestorplus/backend/", {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "obtenerExperiencia" },
        });
        console.log("Datos de experiencia laboral recibidos:", responseExperiencia.data);
        const data = responseExperiencia.data?.obtenerExperiencia || [];
        setExperiencia(Array.isArray(data) ? data : [data]); // Asegúrate de que sea un arreglo
      } catch (error) {
        console.error("Error al obtener la experiencia laboral", error);
        setExperiencia([]);
      }
    };

    fetchEstudios();
    fetchExperienciaLaboral();
  }, []);

  const eliminarEstudioHandler = async (idestudio) => {
    const token = getCookie("auth_token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    try {
      const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este estudio?");
      if (!confirmDelete) return;

      const response = await axios.delete("http://localhost/gestorplus/backend/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-estudio-id": idestudio,
        },
        params: { action: "eliminarEstudio" },
      });

      if (response.status === 200) {
        alert("Estudio eliminado correctamente.");
        setEstudios((prevEstudios) => prevEstudios.filter((estudio) => estudio.idestudio !== idestudio));
      } else {
        alert("Hubo un error al eliminar el estudio.");
      }
    } catch (error) {
      console.error("Error al eliminar el estudio", error);
      alert("Ocurrió un error al eliminar el estudio.");
    }
  }

  const eliminarExperienciaHandler = async (idexperiencialaboral) => {
    const token = getCookie("auth_token");
    if (!token) {
      alert("No se encontró el token de autenticación.");
      return;
    }

    try {
      const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta experiencia laboral?");
      if (!confirmDelete) return;

      const response = await axios.delete("http://localhost/gestorplus/backend/", {
        headers: {
          Authorization: `Bearer ${token}`,
          "x-experiencia-id": idexperiencialaboral,
        },
        params: { action: "eliminarExperiencia" },
      });

      if (response.status === 200) {
        alert("Experiencia eliminada correctamente.");
        setExperiencia((prevExperiencia) =>
          prevExperiencia.filter((exp) => exp.idexperiencialaboral !== idexperiencialaboral)
        );
      } else {
        alert("Hubo un error al eliminar la experiencia.");
      }
    } catch (error) {
      console.error("Error al eliminar la experiencia", error);
      alert("Ocurrió un error al eliminar la experiencia.");
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedData = {};

    if (formData.email !== formData.originalData.email) {
      updatedData.email = formData.email;
    }

    if (formData.tipodDoc !== formData.originalData.tipodDoc) {
      updatedData.tipodDoc = formData.tipodDoc;
    }

    if (formData.password !== formData.originalData.password) {
      updatedData.password = formData.password;
    }

    if (formData.nombres !== formData.originalData.nombres) {
      updatedData.nombres = formData.nombres;
    }

    if (formData.apellidos !== formData.originalData.apellidos) {
      updatedData.apellidos = formData.apellidos;
    }

    const token = getCookie("auth_token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        if (isTokenExpired(decodedToken)) {
          alert("El token ha expirado.");
          return;
        }

        const response = await axios.patch("http://localhost/gestorplus/backend/", updatedData, {
          headers: { Authorization: `Bearer ${token}` },
          params: { action: "actualizarPerfil" },
        });

        if (response.status === 200) {
          alert("Perfil actualizado correctamente.");
          setFormData((prevFormData) => ({
            ...prevFormData,
            originalData: { ...prevFormData }  
          }));
        } else {
          alert("Hubo un error al actualizar el perfil.");
        }
      } catch (error) {
        console.error("Error al enviar los datos", error.response ? error.response.data : error.message);
        alert("Ocurrió un error al actualizar los datos.");
      }
    } else {
      alert("No se encontró el token de autenticación.");
    }
  };

  const toggleModalHojaDeVida = () => setModalHojaDeVida(!modalHojaDeVida);
  const toggleModalEstudios = () => setModalEstudios(!modalEstudios);
  const toggleModalExperiencia = () => setModalExperiencia(!modalExperiencia);

  const agregarEstudio = (nuevoEstudio) => {
    setEstudios((prevEstudios) => [...prevEstudios, nuevoEstudio]);
  };

  const agregarExperiencia = (nuevaExperiencia) => {
    setExperiencia((prevExperiencia) => [...prevExperiencia, nuevaExperiencia]);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <div className="row w-100 justify-content-center">
        <div className="col-md-8 col-12 p-4 bg-white shadow-lg rounded-lg">
          <h2 className="text-primary text-center mb-4">Configuración de perfil</h2>
          <p className="text-center mb-4">Bienvenido, aquí podrás actualizar tu hoja de vida y tus datos.</p>
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
                readOnly
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
            <button type="submit" className="btn btn-primary w-100 mb-3 shadow-sm">Actualizar datos</button>
          </form>

          <div className="d-flex flex-column justify-content-center bg-white shadow rounded">
            <button onClick={toggleModalHojaDeVida} className="btn btn-outline-primary mb-3 shadow-sm">Agregar o Actualizar Hoja de vida</button>
            <button onClick={toggleModalEstudios} className="btn btn-outline-primary mb-3 shadow-sm">Agregar Estudios</button>
            <button onClick={toggleModalExperiencia} className="btn btn-outline-primary shadow-sm">Agregar Experiencia</button>
          </div>

          {/* Botón para volver a la página anterior */}
          <button
            onClick={() => window.history.back()}
            className="btn btn-outline-secondary w-100 mt-3"
          >
            Volver a la página anterior
          </button>
        </div>

        <div className="col-md-8 col-12 p-4 bg-white shadow-lg rounded-lg">
          <div className="nav nav-tabs">
            <select
              style={{ border: "none", background: "transparent" }}
              value={seleccionado}
              onChange={(e) => setSeleccionado(e.target.value)}
            >
              <option value="Estudios">Estudios</option>
              <option value="Experiencias">Experiencia Laboral</option>
            </select>
          </div>
          <div className="mt-4">
            {seleccionado === "Estudios" ? (
              estudios.length > 0 ? (
                <div className="row g-4">
                  {estudios.map((estudio, index) => (
                    <div key={index} className="col-12 col-md-6 col-lg-4">
                      <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "10px" }}>
                        <div className="card-body">
                          <h5 className="card-title text-primary">{estudio.tituloEstudio}</h5>
                          <p className="card-text">
                            <strong>Institución:</strong> {estudio.institucionEstudio} <br />
                            <strong>Nivel:</strong> {estudio.nivelEstudio} <br />
                            <strong>Área:</strong> {estudio.areaEstudio} <br />
                            <strong>Estado:</strong> {estudio.estadoEstudio} <br />
                            <strong>Fecha de inicio:</strong> {estudio.fechaInicioEstudio} <br />
                            <strong>Fecha de fin:</strong> {estudio.fechaFinEstudio} <br />
                            <strong>Ubicación:</strong> {estudio.ubicacionEstudio}
                            <strong>
                              <button type="button" className="btn btn-primary me-2">
                                Editar
                              </button>
                              <button type="button" className="btn btn-danger" onClick={() => eliminarEstudioHandler(estudio.idestudio)}>
                                Eliminar
                              </button>
                            </strong>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center">No hay estudios disponibles.</p>
              )
            ) : experiencia.length > 0 ? (
              <div className="row g-4">
                {experiencia.map((exp, index) => (
                  <div key={index} className="col-12 col-md-6 col-lg-4">
                    <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "10px" }}>
                      <div className="card-body">
                        <h5 className="card-title text-primary">{exp.profesion}</h5>
                        <p className="card-text">
                          <strong>Descripción del perfil:</strong> {exp.descripcionPerfil} <br />
                          <strong>Fecha de inicio:</strong> {exp.fechaInicioExp} <br />
                          <strong>Fecha de fin:</strong> {exp.fechaFinExp}
                          <strong>
                            <button type="button" className="btn btn-primary mt-1 mb-1">
                              Editar
                            </button>
                            <button type="button" className="btn btn-danger mt-1 mb-1" onClick={() => eliminarExperienciaHandler(exp.idexperiencialaboral)}>
                              Eliminar
                            </button>
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center">No hay experiencia laboral disponible.</p>
            )}
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
        onAgregarEstudio={agregarEstudio} // Pasar la función para actualizar estudios
      />
      <Experiencia
        modalExperiencia={modalExperiencia}
        toggleModalExperiencia={toggleModalExperiencia}
        onAgregarExperiencia={agregarExperiencia} // Pasar la función para actualizar experiencia
      />
    </div>
  );
};

export default Perfil;