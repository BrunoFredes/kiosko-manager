import { FaSearch,} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import "./Header.css";
import { useTheme } from "../../context/ThemeContext";
import {

    FaMoon,

    FaSun

} from "react-icons/fa";

function Header() {

    const { usuario } = useAuth();
    const { theme, toggleTheme } = useTheme();

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

                                <button

                                    className="theme-toggle-btn"

                                    onClick={toggleTheme}

                                >

                                    {

                                        theme === "light"

                                            ? <FaMoon/>

                                            : <FaSun/>

                                    }

                                </button>
                                 <div className="user-avatar">

                                    {usuario?.nombreUsuario.charAt(0)}

                                </div>
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