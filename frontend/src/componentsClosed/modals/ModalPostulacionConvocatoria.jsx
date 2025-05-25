import React, { useState } from "react";
import axios from "axios";

const PostulacionesEnConvocatorias = ({
  modalEstudios,
  toggleModalEstudios,
  onAgregarEstudio,
}) => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };
  const token = getCookie("auth_token");

  return (
    <div
      className={`modal fade ${
        modalEstudios
          ? "show d-block animate__animated animate__fadeInDown"
          : ""
      }`}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="modalEstudiosLabel"
      aria-hidden={!modalEstudios}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content shadow-lg rounded-4">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center gap-2">
              <span className="material-icons">school</span> Actualizar Estudios
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={toggleModalEstudios}
            />
          </div>

          <div className="modal-body"></div>
        </div>
      </div>
    </div>
  );
};

export default PostulacionesEnConvocatorias;
