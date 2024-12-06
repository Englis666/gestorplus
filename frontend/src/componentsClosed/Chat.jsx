import React from 'react';
import Mensajes from './Mensajes';

const Chat = ({ chatMessages, error, loading, noMessages }) => {
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
      {/* Si hay un error, lo mostramos */}
      {error && <div style={{ color: 'red', textAlign: 'center', margin: '10px 0' }}>{error}</div>}

      {/* Mostrar el mensaje de "no hay mensajes" si no hay mensajes y no hay error */}
      {!error && noMessages && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>No hay mensajes todavía.</div>
      )}

      {/* Mostrar los mensajes del chat */}
      {chatMessages.length > 0 && !noMessages && chatMessages.map((msg, index) => (
        <Mensajes key={index} message={msg} />
      ))}

      {/* Si estamos cargando, mostramos un indicador */}
      {loading && <div style={{ textAlign: 'center', padding: '10px', fontSize: '16px' }}>Cargando...</div>}
    </div>
  );
};

export default Chat;
