import React, { useState, useEffect } from "react";
import ModalHojaDeVida from "../componentsClosed/ModalHojadevida";
import Estudios from "../componentsClosed/ModalEstudios";
import Experiencia from "../componentsClosed/ModalExperienciaLaboral";

const Perfil = () => {
  const [datos, setDatos] = useState({
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

  // Control de estados
  const [modalHojaDeVida, setModalHojaDeVida] = useState(false);
  const [modalEstudios, setModalEstudios] = useState(false);
  const [modalExperiencia, setModalExperiencia] = useState(false);

  useEffect(() => {
    const fetchDatos = async () => {
      const response = await fetch("");
      const data = await response.json();
      setDatos(data);
    };

    fetchDatos();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDatos((prevDatos) => ({ ...prevDatos, [name]: value }));
  };

  // Funcion Modales
  const toggleModalHojaDeVida = () => setModalHojaDeVida(!modalHojaDeVida);
  const toggleModalEstudios = () => setModalEstudios(!modalEstudios);
  const toggleModalExperiencia = () => setModalExperiencia(!modalExperiencia);

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center  bg-light ms-5">
      <div className="row w-100">
        {/* Configuración de perfil */}
        <div className="col-md-12 col-12 p-4 bg-white shadow rounded">
          <h2 className="text-primary">Configuración de perfil</h2>
          <p>Bienvenido, aquí podrás actualizar tu hoja de vida y tus datos.</p>
          <div className="mb-3">
            <label htmlFor="num_doc" className="form-label">Número de documento</label>
            <input
              type="number"
              className="form-control"
              name="num_doc"
              id="num_doc"
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
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              id="email"
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tipodDoc" className="form-label">Tipo de documento</label>
            <select name="tipodDoc" id="tipodDoc" className="form-select">
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
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mb-3">Actualizar datos</button>

          <div className=" d-flex flex-column justify-content-center bg-white shadow rounded">

          <button onClick={toggleModalHojaDeVida} className="btn btn-primary mb-3">Agregar o actualizar Hoja de vida</button>
          <button onClick={toggleModalEstudios} className="btn btn-primary mb-3">Agregar estudios</button>
          <button onClick={toggleModalExperiencia} className="btn btn-primary">Agregar Experiencia</button>
          
        </div>
        </div>
      </div>


    {/* Modal Hoja de vida */}
      <ModalHojaDeVida
      modalHojaDeVida={modalHojaDeVida}
      toggleModalHojaDeVida={toggleModalHojaDeVida}
      />

      {/* Modal Estudios */}
      <Estudios
      modalEstudios={modalEstudios}
      toggleModalEstudios={toggleModalEstudios}
      />

      {/* Modal Experiencia Laboral */}

       <Experiencia
       modalExperiencia={modalExperiencia}
       toggleModalExperiencia={toggleModalExperiencia}
       />
    </div>
  );
};

export default Perfil;
