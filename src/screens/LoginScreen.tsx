import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle"; // ✅ import ปุ่มสลับธีม
import { useThemeContext } from "../context/ThemeContext"; // ✅ ใช้ theme


export default function LoginScreen() {
    const { login } = useAuth();
    const [email, setEmail] = useState("thanachok.s@kkumail.com");
    const { theme } = useThemeContext(); // ✅ ดึงธีม

    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        try {
            setError(null);
            setLoading(true);
            await login(email.trim(), password.trim());
        } catch (e: any) {
            setError(e.message || "ไม่สามารถเข้าสู่ระบบได้");
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ปุ่มสลับธีม ด้านบน */}
            <View style={{ width: "100%", alignItems: "center", marginTop: 20, marginBottom: 20,right:20 }}>
                <ThemeToggle />
            </View>

            {/* การ์ด login */}
            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                <Text style={[styles.title, { color: theme.text }]}>เข้าสู่ระบบ</Text>

                {/* Email */}
                <Text style={[styles.label, { color: theme.textMuted }]}>อีเมล</Text>
                <TextInput
                    placeholder="you@kkumail.com"
                    placeholderTextColor={theme.textMuted}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    style={[styles.input, { backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }]}
                />

                {/* Password */}
                <Text style={[styles.label, { color: theme.textMuted }]}>รหัสผ่าน</Text>
                <View style={styles.passwordContainer}>
                    <TextInput
                        placeholder="••••••••"
                        placeholderTextColor={theme.textMuted}
                        secureTextEntry={!showPassword}
                        value={password}
                        onChangeText={setPassword}
                        style={[styles.input, { flex: 1, backgroundColor: theme.surfaceAlt, color: theme.text, borderColor: theme.border }]}
                    />
                    <Pressable onPress={() => setShowPassword(!showPassword)} style={styles.toggleButton}>
                        <Text style={{ color: theme.primary, fontWeight: "600" }}>
                            {showPassword ? "ซ่อน" : "แสดง"}
                        </Text>
                    </Pressable>
                </View>

                {error && <Text style={[styles.error, { color: theme.danger }]}>{error}</Text>}

                <Pressable
                    onPress={handleLogin}
                    style={({ pressed }) => [
                        styles.button,
                        pressed && { opacity: 0.8 },
                        loading && { opacity: 0.5 },
                        { backgroundColor: theme.primary },
                    ]}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color={theme.surface} />
                    ) : (
                        <Text style={[styles.buttonText, { color: theme.surface }]}>เข้าสู่ระบบ</Text>
                    )}
                </Pressable>
            </View>
        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#0f172a",
        justifyContent: "center",
        alignItems: "center",
    },
    card: {
        width: "85%",
        backgroundColor: "#1e293b",
        padding: 24,
        borderRadius: 16,
        gap: 14,
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 8,
        elevation: 6,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },
    label: { color: "#9ca3af", fontSize: 14, marginTop: 4 },
    input: {
        backgroundColor: "#0f172a",
        color: "#fff",
        padding: 12,
        borderRadius: 10,
        marginTop: 4,
        borderWidth: 1,
        borderColor: "#1f2937",
    },
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
    },
    toggleButton: {
        marginLeft: 8,
        paddingHorizontal: 8,
        paddingVertical: 6,
    },
    error: {
        color: "#f87171",
        textAlign: "center",
        marginTop: 6,
        fontWeight: "600",
    },
    button: {
        backgroundColor: "#22d3ee",
        paddingVertical: 12,
        borderRadius: 10,
        marginTop: 12,
    },
    buttonText: {
        color: "#00151a",
        fontWeight: "700",
        textAlign: "center",
        fontSize: 16,
    },
});
