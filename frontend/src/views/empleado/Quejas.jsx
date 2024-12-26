import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Chat from '../../componentsClosed/Chat';
import SidebarChat from '../../componentsClosed/sidebarChat';

const Quejas = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [chatMessages, setChatMessages] = useState([]); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`); 
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
        console.error("El mensaje está vacío");
        return;
    }

    const token = getCookie("auth_token");
    if (!token) {
        console.error("No se encontró ningún token. Redirigiendo al login...");
        navigate("/login");
        return;
    }

    const data = {
        action: 'enviarMensajes',
        message: message,
    };

    setLoading(true);
    setError(''); 
    try {
        const response = await axios.post('http://localhost/gestorplus/backend/', data, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });

        console.log("Respuesta del servidor:", response); 


        if (response.data && response.data.status === 'success') {
            console.log('Mensaje enviado');
            // Agregar el mensaje al chat
            setChatMessages((prevMessages) => [...prevMessages, { message }]);
        } else {
            console.error('Error en el backend:', response.data.message);
            setError(response.data.message || 'Error desconocido');
        }

    } catch (error) {
        console.error('Error enviando el mensaje:', error);
        setError('Error enviando el mensaje');
    } finally {
        setLoading(false);
    }

    setMessage('');
};

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      minHeight: '100vh',
      background: '#f0f0f0',
      padding: '20px',
    }}>
      
    {/* Componente de Sidebar */}
      <SidebarChat/>

    {/* Contenedor de Chat */}
      <div style={{
        background: '#fff',
        width: '100%',
        marginTop: '30px',
        borderRadius: '16px',
        boxShadow: '0 0 128px 0 rgba(0,0,0,0.1), 0 32px 64px -48px rgba(0,0,0,0.5)',
        overflow: 'hidden',
      }}>
        <section style={{ padding: '20px' }}>
          <header style={{ display: 'flex', alignItems: 'center', padding: '18px 30px' }}>
            <a href="#!" style={{ fontSize: '18px', color: '#333' }}>
              <i className="fas fa-arrow-left"></i>
            </a>
            <div style={{ flexGrow: 1, marginLeft: '10px' }}>
              <span style={{ fontSize: '17px', fontWeight: '500' }}>Nombre de usuario</span>
              <p style={{ fontSize: '17px', fontWeight: '500' }}>Cargo de la empresa</p>
            </div>
          </header>

          {/* Chat de mensajes (interior) */}
          <Chat chatMessages={chatMessages} error={error} loading={loading} noMessages={chatMessages.length === 0} />

          {/* Formulario de envío de mensaje */}
          <form onSubmit={handleSendMessage} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '18px 30px',
          }}>
            <input
              type="text"
              value={message}
              onChange={handleInputChange}
              placeholder="Escribe un mensaje"
              style={{
                height: '45px',
                width: 'calc(100% - 58px)',
                fontSize: '16px',
                padding: '0 13px',
                border: '1px solid #e6e6e6',
                borderRadius: '5px 0 0 5px',
                outline: 'none',
              }}
              disabled={loading}
            />
            <button
              type="submit"
              style={{
                width: '55px',
                border: 'none',
                outline: 'none',
                background: '#333',
                color: '#fff',
                fontSize: '19px',
                cursor: 'pointer',
                borderRadius: '0 5px 5px 0',
                transition: 'all 0.3s ease',
                opacity: message.trim() === '' || loading ? 0.5 : 1,
                pointerEvents: message.trim() === '' || loading ? 'none' : 'auto',
              }}
            >
              <i className="fab fa-telegram-plane"></i>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Quejas;
