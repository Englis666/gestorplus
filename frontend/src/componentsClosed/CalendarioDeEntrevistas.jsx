/*
 * Copyright (c) 2024 CodeAdvance. Todos los derechos reservados.
 * Prohibida su copia, redistribución o uso sin autorización expresa de CodeAdvance.
 */

import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

const CalendarioDeEntrevistas = ({ entrevistas, onSelectInterview }) => {
  const eventos = entrevistas.map((entrevista) => ({
    title: `Entrevista con ${entrevista.nombres} a las ${entrevista.hora}`,
    start: new Date(`${entrevista.fecha}T${entrevista.hora}`),
    end: new Date(`${entrevista.fecha}T${entrevista.hora}`),
    allDay: false,
    id: entrevista.identrevista,
  }));

  const handleSelectEvent = (event) => {
    const entrevistaSeleccionada = entrevistas.find(
      (entrevista) => entrevista.identrevista === event.id
    );
    onSelectInterview(entrevistaSeleccionada);
  };

  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={eventos}
        startAccessor="start"
        endAccessor="end"
        defaultView="month"
        views={["month", "week", "day"]}
        eventPropGetter={(event) => ({
          style: {
            backgroundColor: "#007bff",
            border: "none",
            borderRadius: "5px",
            color: "white",
            padding: "5px",
          },
        })}
        tooltipAccessor={(event) => event.title}
        onSelectEvent={handleSelectEvent}
      />
    </div>
  );
};

export default CalendarioDeEntrevistas;
