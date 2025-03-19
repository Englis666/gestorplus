import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Chat from '../componentsClosed/Chat';
import SidebarChat from '../componentsClosed/sidebarChat';

const Quejas = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedChatId, setSelectedChatId] = useState(null);
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(";").shift() : null;
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !selectedChatId) {
      console.error("No se puede enviar un mensaje vacío o sin chat seleccionado");
      return;
    }

    const token = getCookie("auth_token");
    if (!token) {
      console.error("No se encontró el token. Redirigiendo al login...");
      navigate("/login");
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost/gestorplus/backend/', {
        action: 'enviarMensajes',
        message,
        idChat: selectedChatId,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data?.status === 'success') {
        console.log('Mensaje enviado');
        setMessage(''); // Solo limpiar si fue exitoso
      } else {
        setError(response.data.message || 'Error desconocido');
      }
    } catch (error) {
      setError('Error enviando el mensaje');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', background: '#f0f0f0', padding: '20px' }}>
      <SidebarChat onChatSelect={setSelectedChatId} />

      <div style={{ background: '#fff', width: '100%', marginTop: '30px', borderRadius: '16px', boxShadow: '0 0 128px 0 rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <section style={{ padding: '20px' }}>
          <header style={{ display: 'flex', alignItems: 'center', padding: '18px 30px' }}>
            <span style={{ fontSize: '17px', fontWeight: '500' }}>
              {selectedChatId ? `Chat ID: ${selectedChatId}` : 'Selecciona un usuario'}
            </span>
          </header>

          <Chat selectedUser={selectedChatId} error={error} loading={loading} />

          <form onSubmit={handleSendMessage} style={{ display: 'flex', justifyContent: 'space-between', padding: '18px 30px' }}>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribe un mensaje"
              disabled={loading || !selectedChatId}
              style={{
                height: '45px',
                width: 'calc(100% - 58px)',
                fontSize: '16px',
                padding: '0 13px',
                border: '1px solid #e6e6e6',
                borderRadius: '5px 0 0 5px',
                outline: 'none',
                backgroundColor: selectedChatId ? '#fff' : '#f0f0f0',
              }}
            />
            <button
              type="submit"
              disabled={loading || !selectedChatId || !message.trim()}
              style={{
                width: "55px",
                border: "none",
                background: selectedChatId ? "#007bff" : "#aaa",
                color: "#fff",
                fontSize: "19px",
                cursor: selectedChatId ? "pointer" : "not-allowed",
                borderRadius: "0 5px 5px 0",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <i className="material-icons" style={{ color: "#fff", fontSize: "24px" }}>send</i>
            </button>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Quejas;
