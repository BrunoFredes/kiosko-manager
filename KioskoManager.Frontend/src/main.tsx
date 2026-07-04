import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/variables.css";
import "./styles/global.css";
import { ThemeProvider } from "./context/ThemeContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import "./styles/theme.css";
import "./styles/global-theme.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ThemeProvider>
            <BrowserRouter>
                <AuthProvider>
                    <App />
                    <Toaster
                        position="bottom-right"
                        reverseOrder={false}
                        gutter={12}
                        toastOptions={{
                            duration: 3000,
                            style: {
                                borderRadius: "12px",
                                background: "var(--surface)",
                                color: "var(--text)",
                                border: "1px solid var(--border)",
                                boxShadow: "var(--shadow)"
                            }
                        }}
                    />
                </AuthProvider>
            </BrowserRouter>
        </ThemeProvider>
    </StrictMode>
);  
