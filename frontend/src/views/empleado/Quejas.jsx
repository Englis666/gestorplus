// src/pages/Quejas.js
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Chat from '../../componentsClosed/Chat';

const Quejas = () => {
  const [message, setMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [noMessages, setNoMessages] = useState(false);
  const chatBoxRef = useRef(null);
  const idEntrante = 'userId';

  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  const handleInputChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      setLoading(true);
      try {
        await axios.post('http://localhost/gestorplus/backend/', {
          action: 'enviarMensaje',
          message,
          idEntrante: idEntrante,
        });
        setMessage('');
        fetchMessages();
      } catch (error) {
        setError('Error al enviar el mensaje.');
        console.error('Error enviando el mensaje:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const fetchMessages = async () => {
    setLoading(true);
    setError(null);
    setNoMessages(false);

    try {
      const response = await axios.post('http://localhost/gestorplus/backend/', {
        action: 'obtenerMensajes',
        idEntrante: idEntrante,
      });

      if (response.data.length === 0) {
        setNoMessages(true);
      } else {
        setChatMessages(response.data);
      }

      scrollToBottom();
    } catch (error) {
      setError('Error al obtener los mensajes.');
      console.error('Error obteniendo los mensajes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 500); // Intervalo de 500ms para obtener mensajes
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f0f0',
    }}>
      <div style={{
        background: '#fff',
        maxWidth: '450px',
        width: '100%',
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
              <span style={{ fontSize: '17px', fontWeight: '500' }}>Nombre y apellido</span>
            </div>
          </header>

          <Chat
            chatMessages={chatMessages}
            error={error}
            loading={loading}
            noMessages={noMessages}
          />

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
