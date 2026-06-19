import { createContext, useContext, useState } from "react";

interface Usuario {
    idUsuario: number;
    nombreUsuario: string;
    rolUsuario: string;
}

interface AuthContextType {
    usuario: Usuario | null;
    login: (usuario: Usuario) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {

    const [usuario, setUsuario] = useState<Usuario | null>(null);

    function login(usuario: Usuario) {
        setUsuario(usuario);
    }

    function logout() {
        setUsuario(null);
    }

    return (
        <AuthContext.Provider
            value={{
                usuario,
                login,
                logout,
                isAuthenticated: usuario != null
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}