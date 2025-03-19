import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const Chat = ({ selectedChat }) => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState(null);
  const [num_doc, setnum_doc] = useState(null); // Guarda el ID del usuario logueado

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
    return null;
  };

  useEffect(() => {
    const token = getCookie("auth_token");
    if (!token) {
      console.error("No se encontró ningún token. Redirigiendo al login...");
      navigate("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      if (decodedToken?.exp * 1000 < Date.now()) {
        console.error("El token ha expirado");
        setLoadError("El token ha expirado");
        navigate("/login");
        return;
      }

      setRol(decodedToken?.data?.rol);
      setnum_doc(decodedToken?.data?.num_doc); // Corregido aquí
    } catch (error) {
      console.error("Error al decodificar el token", error);
      navigate("/login");
    }
  }, [navigate]);

  const obtenerMensajes = async (targetIdChat) => {
    if (!targetIdChat) {
      setLoadError('No se ha seleccionado un chat.');
      return;
    }

    const token = getCookie("auth_token");
    if (!token) {
      console.error("No se encontró ningún token. Redirigiendo al login...");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost/gestorplus/backend/', {
        params: {
          action: 'obtenerMensajes',
          targetIdChat, // Se envía como parámetro en la URL
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Respuesta del backend:", response);

      if (response.data.status === 'success') {
        setChatMessages(response.data.mensajes || []);
      } else {
        setLoadError('Error al cargar los mensajes');
        setChatMessages([]);
      }
    } catch (err) {
      console.error('Error al cargar los mensajes:', err);
      setLoadError('Error al cargar los mensajes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedChat && selectedChat.idChat) {
      obtenerMensajes(selectedChat.idChat);
    }
  }, [selectedChat]);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '500px',
        maxHeight: '500px',
        overflowY: 'auto',
        padding: '10px 30px 20px 30px',
        background: '#f7f7f7',
        boxShadow: 'inset 0 32px 32px -32px rgb(0 0 0 / 5%), inset 0 -32px 32px -32px rgb(0 0 0 / 5%)',
      }}
    >
      {loadError && (
        <div style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>
          {loadError}
        </div>
      )}

      {chatMessages.length === 0 && !loadError && !loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          No hay mensajes todavía.
        </div>
      )}

      {chatMessages.length > 0 && !loadError && !loading && (
        <div>
          {chatMessages.map((msg) => (
            <div key={msg.idChat} style={{ marginBottom: '10px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.emisor === num_doc ? 'flex-end' : 'flex-start', // Corregido aquí
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.emisor === num_doc ? '#0078FF' : '#f1f0f0', // Corregido aquí
                    color: msg.emisor === num_doc ? '#fff' : '#000', // Corregido aquí
                    padding: '10px 15px',
                    borderRadius: '15px',
                    maxWidth: '75%',
                    marginBottom: '5px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px' }}>{msg.mensajes}</p>
                </div>
                <span
                  style={{
                    fontSize: '12px',
                    color: '#888',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                  }}
                >
                  {msg.nombreEmisor}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          Cargando mensajes...
        </div>
      )}
    </div>
  );
};

export default Chat;
