import { useState } from "react";
import imagen from "../assets/2.png";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import { logearse } from "../services/Auth";
import "../css/forms/login.css";
import { notificarExito } from "../utils/notificaciones";

const Login = () => {
  const [formData, setFormData] = useState({ num_doc: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();
  const { login } = useUser();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "num_doc" && !/^\d{0,10}$/.test(value)) return;
    setFormData({ ...formData, [name]: value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.num_doc || !formData.password) {
      setErrorMsg("Por favor complete todos los campos.");
      return;
    }
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      const res = await logearse(formData.num_doc, formData.password);
      if (res.status === "success") {
        notificarExito("Inicio de sesión exitoso");
        login({ token: res.token });
        // Decodifica el token para obtener el rol
        const payload = res.token.split(".")[1];
        const decoded = JSON.parse(atob(payload));
        const role = decoded?.data?.rol;
        localStorage.setItem("rol", role);
        localStorage.setItem("jornadaFinalizada", "false");
        if (["1", "2", "3"].includes(role)) {
          navigate("/Inicio");
        } else {
          navigate("/aspirante/inicio");
        }
      } else {
        setErrorMsg(res.message || "Error en el inicio de sesión");
        setIsSubmitting(false);
      }
    } catch (err) {
      setErrorMsg("Error al iniciar sesión. Intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-container">
        <div className="login-side">
          <img src={imagen} alt="logo" className="login-side-img" />
          <h2 className="login-side-title">GestorPlus</h2>
          <p className="login-side-desc">
            Bienvenido a la plataforma de Recursos Humanos <br />
            <span>La Fayette</span>
          </p>
        </div>
        <div className="login-form-wrap">
          <form
            className="login-form form-show"
            onSubmit={handleSubmit}
            autoComplete="off"
          >
            <h3 className="login-title">Iniciar Sesión</h3>
            <div className="login-field">
              <label htmlFor="num_doc">Número de Documento</label>
              <div className="login-input-wrap">
                <span className="material-icons login-icon">person</span>
                <input
                  type="text"
                  name="num_doc"
                  id="num_doc"
                  placeholder="Ej: 1234567890"
                  value={formData.num_doc}
                  onChange={handleChange}
                  maxLength="10"
                  className={errorMsg && !formData.num_doc ? "login-error" : ""}
                  autoFocus
                />
              </div>
            </div>
            <div className="login-field">
              <label htmlFor="password">Contraseña</label>
              <div className="login-input-wrap">
                <span className="material-icons login-icon">lock</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  id="password"
                  placeholder="Contraseña"
                  value={formData.password}
                  onChange={handleChange}
                  className={
                    errorMsg && !formData.password ? "login-error" : ""
                  }
                />
                <button
                  type="button"
                  className="login-eye"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  <span className="material-icons">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>
            {errorMsg && <div className="login-alert">{errorMsg}</div>}
            <button className="login-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <span className="login-spinner"></span>
              ) : (
                "Ingresar"
              )}
            </button>
            <div className="login-links">
              <button
                type="button"
                className="login-link"
                onClick={() => navigate("/Registro")}
              >
                Crear una cuenta
              </button>
              <button
                type="button"
                className="login-link"
                onClick={() => navigate("/RecuperarPassword")}
              >
                Recuperar contraseña
              </button>
            </div>
          </form>
          <div className="login-copyright">
            © {new Date().getFullYear()} GestorPlus - La Fayette
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
