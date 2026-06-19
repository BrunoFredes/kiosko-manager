import { useState } from "react";
import { login as loginService } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Login() {

    const { login } = useAuth();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent) {

        e.preventDefault();

        try {

            const usuario =
                await loginService(
                    email,
                    password
                );

            console.log(usuario);

            login(usuario);

            navigate("/caja");

        }
        catch (error: any) {

            alert(error.message);

        }

    }

    return (

        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-4">

                    <div className="card shadow">

                        <div className="card-body">

                            <h2 className="text-center mb-4">

                                Kiosko Manager

                            </h2>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label>Email</label>

                                    <input
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />

                                </div>

                                <div className="mb-3">

                                    <label>Contraseña</label>

                                    <input
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />

                                </div>

                                <button
                                    className="btn btn-primary w-100">

                                    Iniciar sesión

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );

}

export default Login;