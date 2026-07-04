import { useState } from "react";
import { login as loginService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";   // ← Asegúrate de importar esto

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        try {
            const usuario = await loginService(email, password);
            login(usuario);
            navigate("/caja");
        }
        catch (error: any) {
            alert(error.message || "Credenciales incorrectas");
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">

                <div className="login-header">
                    <h2>Kiosko Manager</h2>
                    <p>Sistema de Gestión</p>
                </div>

                <div className="login-body">
                    <form onSubmit={handleSubmit}>

                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="text"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoFocus
                            />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn-login w-100"
                        >
                            Iniciar sesión
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}

export default Login;