import { FaSearch, FaBell } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";

function Header() {

    const { usuario } = useAuth();

    return (

        <header className="header">

            <div className="search-box">

                <FaSearch />

                <input
                    type="text"
                    placeholder="Buscar..."
                />

            </div>

            <div className="header-right">

                <FaBell className="icon"/>

                <div className="header-user">

                    <span>

                        {usuario?.nombreUsuario}

                    </span>

                    <small>

                        {usuario?.rolUsuario}

                    </small>

                </div>

            </div>

        </header>

    );

}

export default Header;