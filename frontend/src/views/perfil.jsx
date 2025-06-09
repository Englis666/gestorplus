/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import NavbarClosed from "../componentsClosed/Navbar";
import Navbar from "../components/Navbar";
import PerfilForm from "../componentsClosed/form/PerfilForm";
import PerfilAcciones from "../componentsClosed/actions/PerfilActions";
import PerfilTabs from "../componentsClosed/actions/PerfilTabs";
import ModalHojaDeVida from "../componentsClosed/modals/ModalHojadevida";
import Estudios from "../componentsClosed/modals/ModalEstudios";
import Experiencia from "../componentsClosed/modals/ModalExperienciaLaboral";
import EditarEstudio from "../componentsClosed/modals/ModalEditarEstudios";
import EditarExperiencia from "../componentsClosed/modals/ModalEditarExperiencia";
import axios from "axios";
import API_URL from "../config";
import { decodedTokenWithRol } from "../utils/Auth";

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

  const contenido = (
    <div className="main-content">
      <div className="container">
        <div className="row">
          {/* Formulario de perfil */}
          <div className="col-md-6 mb-4">
            <div className="card shadow animated fadeIn">
              <div className="card-body">
                <h2 className="card-title text-primary text-center mb-4">
                  Configuración de Perfil
                </h2>
                <p className="text-center mb-4">
                  Actualiza tu información personal y profesional.
                </p>
                <PerfilForm
                  formData={formData}
                  handleChange={handleChange}
                  handleSubmit={handleSubmit}
                />
                <PerfilAcciones
                  toggleModalHojaDeVida={toggleModalHojaDeVida}
                  toggleModalEstudios={toggleModalEstudios}
                  toggleModalExperiencia={toggleModalExperiencia}
                />
                <button
                  onClick={() => window.history.back()}
                  className="btn btn-secondary w-100 mt-3 animated fadeInUp"
                >
                  <i className="material-icons me-2">arrow_back</i> Volver
                </button>
              </div>
            </div>
          </div>
          {/* Tabs de estudios y experiencia */}
          <div className="col-md-6">
            <PerfilTabs
              seleccionado={seleccionado}
              setSeleccionado={setSeleccionado}
              estudios={estudios}
              experiencia={experiencia}
              editarEstudioHandler={editarEstudioHandler}
              eliminarEstudioHandler={eliminarEstudioHandler}
              editarExperienciaHandler={editarExperienciaHandler}
              eliminarExperienciaHandler={eliminarExperienciaHandler}
            />
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
  );

  return rol === "4" ? (
    <>
      <Navbar />
      {contenido}
    </>
  ) : (
    <div className="main-layout">
      <NavbarClosed />
      {contenido}
    </div>
  );
};

export default Perfil;
