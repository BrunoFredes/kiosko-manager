import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode
} from "react";

type Theme = "light" | "dark";

interface ThemeContextType {

    theme: Theme;

    toggleTheme: () => void;

}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({

    children

}:{

    children: ReactNode

}){

    const [theme,setTheme] = useState<Theme>(()=>{

        return (

            localStorage.getItem("theme") as Theme

        ) || "light";

    });

    useEffect(()=>{

        document.documentElement.setAttribute(

            "data-theme",

            theme

        );

        document.documentElement.setAttribute(

            "data-bs-theme",

            theme

        );

        localStorage.setItem(

            "theme",

            theme

        );

    },[theme]);

    function toggleTheme(){

        setTheme(

            t=>t==="light"

                ? "dark"

                : "light"

        );

    }

    return(

        <ThemeContext.Provider

            value={{

                theme,

                toggleTheme

            }}

        >

            {children}

        </ThemeContext.Provider>

    );

}

export function useTheme(){

    const context = useContext(ThemeContext);

    if(!context)

        throw new Error(

            "useTheme debe usarse dentro del ThemeProvider"

        );

    return context;

}