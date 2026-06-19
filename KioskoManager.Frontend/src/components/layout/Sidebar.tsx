import {
    FaCashRegister,
    FaChartBar,
    FaBoxOpen,
    FaWarehouse,
    FaUsers,
    FaCog,
    FaSignOutAlt,
    FaStore
} from "react-icons/fa";

import { Link } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

import "./Sidebar.css";

function Sidebar() {

    const { usuario } = useAuth();

    return (

        <aside className="sidebar">

            <div>

                

                <div className="sidebar-user">

                    <div className="avatar">

                       <FaStore size={28} />

                    </div>

                    <div>

                        <strong>

                            {usuario?.nombreUsuario}

                        </strong>

                        <small>

                            {usuario?.rolUsuario}

                        </small>

                    </div>

                </div>

                <nav>

                    <Link
                        to="/caja"
                        className="menu-item"
                    >

                        <FaCashRegister />

                        Caja

                    </Link>

                    <Link
                        to="/dashboard"
                        className="menu-item"
                    >

                        <FaChartBar />

                        Dashboard

                    </Link>

                    <Link
                        to="/productos"
                        className="menu-item"
                    >

                        <FaBoxOpen />

                        Productos

                    </Link>

                    <Link
                        to="/stock"
                        className="menu-item"
                    >

                        <FaWarehouse />

                        Stock

                    </Link>

                    <Link
                        to="/usuarios"
                        className="menu-item"
                    >

                        <FaUsers />

                        Empleados

                    </Link>

                    <Link
                        to="/configuracion"
                        className="menu-item"
                    >

                        <FaCog />

                        Configuración

                    </Link>

                </nav>

            </div>

            <button className="logout-button">

                <FaSignOutAlt />

                Cerrar sesión

            </button>

        </aside>

    );

}

export default Sidebar;