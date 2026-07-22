import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from './context/ThemeContext';
import Login from "./pages/Login/Login";
import Caja from "./pages/Caja/Caja";
import Productos from "./pages/Productos/Productos";
import Usuarios from "./pages/Usuarios/Usuarios";

import AppLayout from "./layouts/AppLayout";

import { useAuth } from "./context/AuthContext";

function App() {

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {

        return <Login />;

    }

    return (
         <ThemeProvider>
        <Routes>

            <Route element={<AppLayout />}>

                <Route
                    path="/caja"
                    element={<Caja />}
                />

                <Route
                    path="/productos"
                    element={<Productos />}
                />
                <Route
                    path="/usuarios"
                    element={<Usuarios />}
                />
                <Route
                    path="*"
                    element={<Navigate to="/caja" />}
                />

            </Route>
            
        </Routes>
        </ThemeProvider>
    );

}

export default App;