import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login/Login";
import Caja from "./pages/Caja/Caja";

import AppLayout from "./layouts/AppLayout";

import { useAuth } from "./context/AuthContext";

function App() {

    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {

        return <Login />;

    }

    return (

        <Routes>

            <Route element={<AppLayout />}>

                <Route
                    path="/caja"
                    element={<Caja />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/caja" />}
                />

            </Route>

        </Routes>

    );

}

export default App;