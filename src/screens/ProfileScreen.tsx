// src/screens/ProfileScreen.tsx
import React from "react";
import { View, Text, StyleSheet, SafeAreaView, Image, Pressable } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";
import ThemeToggle from "../components/ThemeToggle";

export default function ProfileScreen() {
    const { user, logout } = useAuth();
    const { theme, mode } = useThemeContext();

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={styles.errorText}>ไม่พบข้อมูลผู้ใช้</Text>
            </SafeAreaView>
        );
    }

    const fullname = `${user.firstname || ""} ${user.lastname || ""}`.trim();
    const major = user.education?.major || "-";
    const studentId = user.education?.studentId || "-";
    const enrollmentYear = user.education?.enrollmentYear || "-";
    const role = user.role === "user" ? "นักศึกษา" : user.role;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ปุ่มสลับธีม */}
            <View style={{ 
                paddingHorizontal: 12, 
                marginBottom: 12 ,
                position: "absolute",
                top: 20,
                right: 20,
                zIndex: 999,
                }}>
                <ThemeToggle />
            </View>

            <View style={[styles.card, { backgroundColor: theme.surface }]}>
                {/* รูปโปรไฟล์ */}
                <Image
                    source={
                        user.image
                            ? { uri: user.image }
                            : require("../../assets/avatar-placeholder.png")
                    }
                    style={[styles.avatar, { borderColor: theme.primary }]}
                />

                {/* ข้อมูลผู้ใช้ */}
                <Text style={[styles.name, { color: theme.text }]}>{fullname}</Text>
                <Text style={[styles.email, { color: theme.textMuted }]}>{user.email}</Text>

                <View style={[styles.infoBox, { backgroundColor: theme.background }]}>
                    <Text style={[styles.label, { color: theme.textMuted }]}>บทบาท</Text>
                    <Text style={[styles.value, { color: theme.text }]}>{role}</Text>
                </View>

                <View style={[styles.infoBox, { backgroundColor: theme.background }]}>
                    <Text style={[styles.label, { color: theme.textMuted }]}>รหัสนักศึกษา</Text>
                    <Text style={[styles.value, { color: theme.text }]}>{studentId}</Text>
                </View>

                <View style={[styles.infoBox, { backgroundColor: theme.background }]}>
                    <Text style={[styles.label, { color: theme.textMuted }]}>สาขา</Text>
                    <Text style={[styles.value, { color: theme.text }]}>{major}</Text>
                </View>

                <View style={[styles.infoBox, { backgroundColor: theme.background }]}>
                    <Text style={[styles.label, { color: theme.textMuted }]}>ปีที่เข้าเรียน</Text>
                    <Text style={[styles.value, { color: theme.text }]}>{enrollmentYear}</Text>
                </View>

                {/* ปุ่ม Logout */}
                <Pressable
                    onPress={logout}
                    style={[styles.logoutButton, { backgroundColor: theme.danger }]} // ใช้ danger แทน error
                >
                    <Text style={[styles.logoutText, { color: theme.surface }]}>ออกจากระบบ</Text>
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
        backgroundColor: "#1e293b",
        width: "85%",
        borderRadius: 20,
        padding: 24,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.3,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
        elevation: 5,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 16,
        borderWidth: 2,
        borderColor: "#22d3ee",
    },
    name: {
        color: "#fff",
        fontSize: 22,
        fontWeight: "700",
    },
    email: {
        color: "#9ca3af",
        fontSize: 14,
        marginBottom: 20,
    },
    infoBox: {
        width: "100%",
        marginBottom: 10,
        backgroundColor: "#0f172a",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 16,
    },
    label: {
        color: "#9ca3af",
        fontSize: 13,
    },
    value: {
        color: "#e2e8f0",
        fontSize: 16,
        fontWeight: "600",
    },
    logoutButton: {
        marginTop: 20,
        backgroundColor: "#ef4444",
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 30,
    },
    logoutText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
    },
    errorText: {
        color: "#f87171",
        fontSize: 16,
        textAlign: "center",
    },
});
