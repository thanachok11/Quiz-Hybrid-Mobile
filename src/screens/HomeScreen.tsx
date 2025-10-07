import React from "react";
import { View, Text } from "react-native";
import { useThemeContext } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export default function HomeScreen() {
    const { theme, mode } = useThemeContext();

    return (
        <View
            style={{
                flex: 1,
                backgroundColor: theme.background,
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <Text style={{ color: theme.text, fontSize: 22 }}>
                🏠 หน้าหลัก ({mode === "light" ? "☀️ Light" : "🌙 Dark"})
            </Text>

            {/* ปุ่มสลับธีม อยู่ใต้ชื่อ */}
            <View style={{ marginTop: 20, alignItems: "center" ,left:50}}>
                <ThemeToggle />
            </View>

        </View>
    );
}
