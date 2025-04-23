import React from "react";

const EstadisticaCard = ({ icon, title, value }) => {
  return (
    <div className="col-md-4">
      <div className="card shadow-sm">
        <div className="card-body">
          <i className="material-icons" style={{ fontSize: "3rem" }}>
            {icon}
          </i>
          <h5 className="card-title mt-3">{title}</h5>
          <p className="card-text">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default EstadisticaCard;