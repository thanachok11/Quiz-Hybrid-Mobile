import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { useThemeContext } from "../context/ThemeContext";

const ThemeToggle = () => {
    const { mode, toggleTheme, theme } = useThemeContext();

    return (
        <TouchableOpacity
            onPress={toggleTheme}
            activeOpacity={0.7}
            style={styles.container} // ปรับตำแหน่งขวาบน
        >
            <View
                style={[
                    styles.toggleBox,
                    { backgroundColor: theme.primary },
                ]}
            >
                <Text style={[styles.toggleText, { color: theme.surface }]}>
                    {mode === "dark" ? "🌙" : "☀️"}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

export default ThemeToggle;

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 16,
        right: 16,
        zIndex: 999,
        marginTop:10
    },
    toggleBox: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    toggleText: {
        fontSize: 18,
        fontWeight: "700",
    },
});

