const Chat = ({ selectedChat, mensajes, numDocUsuario }) => {
    console.log("Mensajes recibidos:", mensajes); // 👀

    return (
        <div>
            {mensajes.length === 0 ? (
                <p className="text-muted">No hay mensajes aún.</p>
            ) : (
                mensajes.map((msg, index) => (
                    <div
                        key={index}
                        className={`d-flex ${msg.num_doc === numDocUsuario ? "justify-content-end" : "justify-content-start"
                            } mb-2`}
                    >
                        <div
                            className={`p-2 rounded ${msg.num_doc === numDocUsuario ? "bg-primary text-white" : "bg-light"
                                }`}
                            style={{ maxWidth: "75%" }}
                        >
                            <small>{msg.mensaje}</small>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default Chat;