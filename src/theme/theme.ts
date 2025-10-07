// src/theme/theme.ts
import { useColorScheme } from "react-native";

export const darkTheme = {
    background: "#0f172a",
    surface: "#1e293b",
    surfaceAlt: "#0f172a",
    primary: "#22d3ee",
    text: "#e5e7eb",
    textMuted: "#9ca3af",
    danger: "#f87171",
    success: "#4ade80",
    border: "#1f2937",
};

export const lightTheme = {
    background: "#f8fafc",
    surface: "#ffffff",
    surfaceAlt: "#f1f5f9",
    primary: "#0284c7",
    text: "#0f172a",
    textMuted: "#475569",
    danger: "#dc2626",
    success: "#16a34a",
    border: "#e2e8f0",
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
};

export const radius = {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
};

// ✅ Hook ใช้ในทุกหน้าจอ
export const useAppTheme = (override?: "light" | "dark") => {
    const system = useColorScheme();
    const mode = override || system || "light";
    return mode === "dark" ? darkTheme : lightTheme;
};
