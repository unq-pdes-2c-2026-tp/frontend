import { useState } from "react";
import { useNavigate } from "react-router";
import { useNavigateByUserType } from "../routes/useNavigateByUserType"
import "../styles/Login.css";
import { login } from "../api/auth";

const Login = () => {
  const navigateByUserType = useNavigateByUserType();
  const navigate = useNavigate()
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (event) => {
    setData((currentData) => ({
      ...currentData,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await login(data);
      const authToken = response.headers?.authorization;

      localStorage.setItem("token", authToken);
      localStorage.setItem("userId", String(response.data.id));
      localStorage.setItem("userEmail", response.data.email || "");
      localStorage.setItem("userName", response.data.name || "");
      localStorage.setItem("userType", response.data.user_type || "");
      localStorage.setItem("user", JSON.stringify(response.data));
      navigateByUserType(response.data.user_type);
    } catch (requestError) {
      const message =
        requestError.response?.data || "Falló la conexión con el servidor";
      setError(
        typeof message === "string" ? message : "No se pudo iniciar sesión",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="login-page">
      <header className="login-topbar">
        <a
          className="login-brand"
          href="/login"
          aria-label="Comprá tu Viaje, inicio"
        >
          <span className="login-brand-mark">CTV</span>
          <span>Comprá tu Viaje</span>
        </a>
        <span className="login-topbar-copy">
          Tu próximo destino empieza acá
        </span>
      </header>

      <section className="login-layout">
        <div className="login-intro">
          <p className="login-eyebrow">Bienvenido de nuevo</p>
          <h1>Ingresá a tu cuenta</h1>
          <p>
            Gestioná tus viajes y encontrá nuevas propuestas de nuestras
            agencias asociadas.
          </p>
        </div>

        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-card-heading">
            <h2>Iniciar sesión</h2>
            <p>Completá tus datos para continuar.</p>
          </div>
          <label htmlFor="login-email">E-mail</label>
          <input
            id="login-email"
            name="email"
            type="text"
            placeholder="Ingresá tu email"
            value={data.email}
            onChange={handleInputChange}
            required
            autoComplete="email"
          />
          <label htmlFor="login-password">Contraseña</label>
          <input
            id="login-password"
            name="password"
            type="password"
            placeholder="Ingresá tu contraseña"
            value={data.password}
            onChange={handleInputChange}
            required
            autoComplete="current-password"
          />
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}
          <button
            className="login-submit"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Ingresar"}
          </button>
          <div className="login-register">
            ¿Todavía no tenés una cuenta?{" "}
            <button type="button" onClick={() => navigate("/register")}>
              Registrarme
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Login;
