import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

const Chat = ({ selectedUser }) => {
  const navigate = useNavigate();
  const [chatMessages, setChatMessages] = useState([]);
  const [loadError, setLoadError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rol, setRol] = useState(null); // Estado para guardar el rol

  const obtenerMensajes = async (targetNum_doc) => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`); 
      return parts.length === 2 ? parts.pop().split(";").shift() : null;
    };

    const token = getCookie("auth_token");
    if (!token) {
      console.error("No se encontró ningún token. Redirigiendo al login...");
      navigate("/login");
      return;
    }

    if (!targetNum_doc) {
      setLoadError('No se ha seleccionado un usuario.');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      const isTokenExpired = decodedToken?.exp * 1000 < Date.now();
      if (isTokenExpired) {
        console.error("El token ha expirado");
        setLoadError("El token ha expirado");
        setLoading(false);
        navigate("/login");
        return;
      }

      const Rol = decodedToken?.data?.rol; 
      setRol(Rol);

      let action;
      switch (Rol) {
        case "1":
        case "2":
          action = "obtenerMensajesDelUsuario";
          break;
        case "3":
          action = "obtenerMensajes";
          break;
        default:
          console.error("Rol no válido");
          setLoadError("Rol no reconocido.");
          setLoading(false);
          return;
      }

      const data = {
        action,
        targetNum_doc,  
      };

      console.log("Obteniendo mensajes para el chat con el usuario :", targetNum_doc);  

      setLoading(true);
      const response = await axios.post('http://localhost/gestorplus/backend/', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      console.log("Respuesta del backend:", response.data);

      if (response.data.status === 'success') {
        if (Array.isArray(response.data.mensajes) && response.data.mensajes.length > 0) {
          setChatMessages(response.data.mensajes);
        } else {
          setLoadError('No se encontraron mensajes.');
          setChatMessages([]);
        }
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
    if (selectedUser && selectedUser.num_doc) {
      obtenerMensajes(selectedUser.num_doc);
    }
  }, [selectedUser]);

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

      {/* Si no hay mensajes y no hay error */}
      {chatMessages.length === 0 && !loadError && !loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          No hay mensajes todavía.
        </div>
      )}

      {/* Mostrar los mensajes */}
      {chatMessages.length > 0 && !loadError && !loading && (
        <div>
          {chatMessages.map((msg) => (
            <div key={msg.idChat} style={{ marginBottom: '10px' }}>
              {/* Emisor */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: msg.emisor === selectedUser.num_doc ? 'flex-end' : 'flex-start', 
                }}
              >
                <div
                  style={{
                    backgroundColor: msg.emisor === selectedUser.num_doc ? '#0078FF' : '#f1f0f0',
                    color: msg.emisor === selectedUser.num_doc ? '#fff' : '#000',
                    padding: '10px 15px',
                    borderRadius: '15px',
                    maxWidth: '75%',
                    marginBottom: '5px',
                    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <p style={{ margin: 0, fontSize: '14px' }}>{msg.mensajes}</p>
                </div>
                {/* Nombre de emisor */}
                <span
                  style={{
                    fontSize: '12px',
                    color: msg.emisor === selectedUser.num_doc ? '#0078FF' : '#555',
                    marginTop: '5px',
                  }}
                >
                  {msg.emisor === selectedUser.num_doc ? 'Tú' : 'Tu'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Mostrar cargando */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '10px', fontSize: '16px' }}>
          Cargando...
        </div>
      )}
    </div>
  );
};

export default Chat;
