import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
    crearUsuario,
    actualizarUsuario
} from "../../services/usuarioService";

import "./UsuarioModal.css";

interface Usuario {

    idUsuario?: number;

    nombreUsuario: string;

    apellidoUsuario: string;

    emailUsuario: string;

    password?: string;

    rolUsuario: string;

    activoUsuario?: boolean;

}

interface Props {

    abierto: boolean;

    usuario: Usuario | null;

    onCerrar: () => void;

    onGuardado: () => void;

}

const usuarioVacio: Usuario = {

    nombreUsuario: "",

    apellidoUsuario: "",

    emailUsuario: "",

    password: "",

    rolUsuario: "Empleado"

};

function UsuarioModal({

    abierto,

    usuario,

    onCerrar,

    onGuardado

}: Props) {

    const esEdicion = !!usuario;

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [formData, setFormData] =
        useState<Usuario>(usuarioVacio);

    useEffect(() => {

        if (!abierto)
            return;

        if (usuario)
            setFormData(usuario);

        else
            setFormData(usuarioVacio);

        setError("");

    }, [abierto, usuario]);

    function handleChange(

        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement
        >

    ) {

        const {

            name,

            value

        } = e.target;

        setFormData(prev => ({

            ...prev,

            [name]: value

        }));

    }

    async function handleSubmit(
        e: React.FormEvent
    ) {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            if (esEdicion && usuario?.idUsuario) {

                await actualizarUsuario(

                    usuario.idUsuario,

                    formData

                );

                toast.success(
                    "Usuario actualizado."
                );

            }
            else {

                await crearUsuario(formData);

                toast.success(
                    "Usuario creado."
                );

            }

            onGuardado();

        }
        catch (err: any) {

            setError(err.message);

            toast.error(err.message);

        }
        finally {

            setLoading(false);

        }

    }

    if (!abierto)
        return null;

    return (

        <div
            className="modal-overlay"
            onClick={onCerrar}
        >

            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >

                <div className="modal-header">

                    <h3>

                        {

                            esEdicion

                                ?

                                "Editar Usuario"

                                :

                                "Nuevo Usuario"

                        }

                    </h3>

                    <button

                        className="btn-cerrar"

                        onClick={onCerrar}

                    >

                        ✕

                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="modal-body">

                        {

                            error &&

                            <div className="error-message">

                                {error}

                            </div>

                        }

                        <div className="form-row">

                            <div className="form-group">

                                <label>Nombre</label>

                                <input

                                    name="nombreUsuario"

                                    value={formData.nombreUsuario}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                            <div className="form-group">

                                <label>Apellido</label>

                                <input

                                    name="apellidoUsuario"

                                    value={formData.apellidoUsuario}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                        </div>

                        <div className="form-group">

                            <label>Email</label>

                            <input

                                type="email"

                                name="emailUsuario"

                                value={formData.emailUsuario}

                                onChange={handleChange}

                                required

                            />

                        </div>

                        {

                            !esEdicion &&

                            <div className="form-group">

                                <label>Contraseña</label>

                                <input

                                    type="password"

                                    name="password"

                                    value={formData.password}

                                    onChange={handleChange}

                                    required

                                />

                            </div>

                        }

                        <div className="form-group">

                            <label>Rol</label>

                            <select

                                name="rolUsuario"

                                value={formData.rolUsuario}

                                onChange={handleChange}

                            >

                                <option value="Administrador">

                                    Administrador

                                </option>

                                <option value="Empleado">

                                    Empleado

                                </option>

                            </select>

                        </div>

                    </div>

                    <div className="modal-footer">

                        <button

                            type="button"

                            className="btn-cancelar"

                            onClick={onCerrar}

                        >

                            Cancelar

                        </button>

                        <button

                            type="submit"

                            className="btn-guardar"

                            disabled={loading}

                        >

                            {

                                loading

                                    ?

                                    "Guardando..."

                                    :

                                    esEdicion

                                        ?

                                        "Guardar Cambios"

                                        :

                                        "Crear Usuario"

                            }

                        </button>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default UsuarioModal;