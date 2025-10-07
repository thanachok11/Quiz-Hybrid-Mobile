import React, { createContext, useContext, useState, ReactNode } from "react";
import { darkTheme, lightTheme } from "../theme/theme";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
    theme: typeof lightTheme;
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
    theme: lightTheme,
    mode: "light",
    toggleTheme: () => { },
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [mode, setMode] = useState<ThemeMode>("dark");

    const toggleTheme = () => {
        setMode((prev) => (prev === "light" ? "dark" : "light"));
    };

    const theme = mode === "dark" ? darkTheme : lightTheme;

    return (
        <ThemeContext.Provider value={{ theme, mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeContext = () => useContext(ThemeContext);
