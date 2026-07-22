import { useEffect, useState } from "react";

import {
    obtenerTodosUsuarios,
    buscarUsuarios,
    cambiarEstadoUsuario
} from "../../services/usuarioService";

import UsuarioModal from "./UsuarioModal";

import "./Usuarios.css";

interface Usuario {
    idUsuario: number;
    nombreUsuario: string;
    apellidoUsuario: string;
    emailUsuario: string;
    rolUsuario: string;
    activoUsuario: boolean;
}

function Usuarios() {

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [busqueda, setBusqueda] = useState("");

    const [mostrarModal, setMostrarModal] = useState(false);

    const [usuarioSeleccionado,
        setUsuarioSeleccionado] =
        useState<Usuario | null>(null);

    async function cargarUsuarios() {

        try {

            if (busqueda.trim() === "") {

                const data =
                    await obtenerTodosUsuarios();

                setUsuarios(data);

            } else {

                const data =
                    await buscarUsuarios(busqueda);

                setUsuarios(data);

            }

        } catch (error) {

            console.error(
                "Error cargando usuarios:",
                error
            );

        }

    }

    async function toggleActivo(id: number) {

        try {

            await cambiarEstadoUsuario(id);

            await cargarUsuarios();

        } catch (error) {

            console.error(error);

            alert(
                "No se pudo cambiar el estado del usuario"
            );

        }

    }

    useEffect(() => {

        cargarUsuarios();

    }, [busqueda]);

    return (

        <div className="usuarios-page">

            <div className="usuarios-header">

                <h2>Usuarios</h2>

                <input
                    className="buscar-usuario"
                    placeholder="Buscar usuario..."
                    value={busqueda}
                    onChange={(e) =>
                        setBusqueda(e.target.value)
                    }
                />

                <button
                    className="btn-agregar"
                    onClick={() => {

                        setUsuarioSeleccionado(null);

                        setMostrarModal(true);

                    }}
                >
                    + Agregar Usuario
                </button>

            </div>

            <div className="tabla-container">

                <table className="tabla-usuarios">

                    <thead>

                        <tr>

                            <th>Nombre</th>

                            <th>Apellido</th>

                            <th>Email</th>

                            <th>Rol</th>

                            <th>Activo</th>

                            <th>Acciones</th>

                        </tr>

                    </thead>

                    <tbody>

                        {usuarios.map(usuario => (

                            <tr
                                key={usuario.idUsuario}
                            >

                                <td>
                                    {usuario.nombreUsuario}
                                </td>

                                <td>
                                    {usuario.apellidoUsuario}
                                </td>

                                <td>
                                    {usuario.emailUsuario}
                                </td>

                                <td>
                                    {usuario.rolUsuario}
                                </td>

                                <td>

                                    <label className="switch-toggle">

                                        <input
                                            type="checkbox"
                                            checked={
                                                usuario.activoUsuario
                                            }
                                            onChange={() =>
                                                toggleActivo(
                                                    usuario.idUsuario
                                                )
                                            }
                                        />

                                        <span className="slider round"></span>

                                    </label>

                                </td>

                                <td>

                                    <button
                                        className="btn-editar"
                                        onClick={() => {

                                            setUsuarioSeleccionado(
                                                usuario
                                            );

                                            setMostrarModal(true);

                                        }}
                                    >
                                        ✏ Editar
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

            <UsuarioModal
                abierto={mostrarModal}
                usuario={usuarioSeleccionado}
                onCerrar={() => {

                    setMostrarModal(false);

                    setUsuarioSeleccionado(null);

                }}
                onGuardado={() => {

                    cargarUsuarios();

                    setMostrarModal(false);

                    setUsuarioSeleccionado(null);

                }}
            />

        </div>

    );

}

export default Usuarios;