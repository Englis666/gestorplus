import React from 'react';

const Mensajes= ({ message }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <p>{message.message}</p>
    </div>
  );
};

export default Mensajes;
