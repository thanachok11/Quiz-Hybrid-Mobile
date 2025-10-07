// src/screens/MembersScreen.tsx
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    SafeAreaView,
    Pressable,
    ActivityIndicator,
} from "react-native";
import { api, User } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle"; // ✅ import ปุ่มสลับธีม
import { useThemeContext } from "../context/ThemeContext"; // ✅ ใช้ theme


export default function MembersScreen() {
    const { token } = useAuth();
    const { theme } = useThemeContext(); // ✅ ดึงธีม

    const [members, setMembers] = useState<User[]>([]);
    const [selectedYear, setSelectedYear] = useState<string>("2565");
    const [loading, setLoading] = useState(true);

    // 🧠 ปีการศึกษา (boss เพิ่มได้ตามต้องการ)
    const classYears = ["2565", "2566", "2567"];

    const fetchClassMembers = async (year: string) => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await api.getClassMembers(year, token);
            setMembers(data || []);
        } catch (error) {
            console.error("❌ Fetch class members failed:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClassMembers(selectedYear);
    }, [selectedYear]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ปุ่มสลับธีม */}
            <View style={{ paddingHorizontal: 16, marginBottom: 40, marginTop: 0 }}>
                <ThemeToggle />
            </View>

            <Text style={[styles.header, { color: theme.text }]}>👥 สมาชิกชั้นเรียน</Text>

            {/* 🔘 ตัวเลือกปี */}
            <View style={styles.yearSelector}>
                {classYears.map((year) => {
                    const isActive = selectedYear === year;
                    return (
                        <Pressable
                            key={year}
                            onPress={() => setSelectedYear(year)}
                            style={[
                                styles.yearButton,
                                {
                                    backgroundColor: isActive ? theme.primary : theme.surface,
                                    borderColor: isActive ? theme.primary : theme.border,
                                },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.yearText,
                                    { color: isActive ? theme.surface : theme.text },
                                ]}
                            >
                                {year}
                            </Text>
                        </Pressable>
                    );
                })}
            </View>

            {/* 📋 รายชื่อสมาชิก */}
            {loading ? (
                <ActivityIndicator color={theme.primary} size="large" style={{ marginTop: 40 }} />
            ) : members.length === 0 ? (
                <Text style={[styles.noData, { color: theme.textMuted }]}>
                    ไม่พบสมาชิกในปี {selectedYear}
                </Text>
            ) : (
                <FlatList
                    data={members}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => (
                        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                            <Text style={[styles.name, { color: theme.text }]}>{item.firstname} {item.lastname}</Text>
                            <Text style={[styles.email, { color: theme.textMuted }]}>{item.email}</Text>
                            <Text style={[styles.meta, { color: theme.textMuted }]}>
                                รหัสนักศึกษา: {item.education?.studentId || "-"}
                            </Text>
                            <Text style={[styles.meta, { color: theme.textMuted }]}>
                                ปีเข้าเรียน: {item.education?.enrollmentYear || "-"}
                            </Text>
                            <Text style={[styles.meta, { color: theme.textMuted }]}>
                                สาขา: {item.education?.major || "-"}
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#0f172a", paddingTop: 20 },
    header: {
        color: "#e5e7eb",
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 12,
    },
    yearSelector: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 16,
        flexWrap: "wrap",
        gap: 8,
    },
    yearButton: {
        borderWidth: 1,
        borderColor: "#1f2937",
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 14,
        backgroundColor: "#1e293b",
    },
    yearButtonActive: {
        backgroundColor: "#22d3ee",
        borderColor: "#22d3ee",
    },
    yearText: { color: "#fff", fontWeight: "600" },
    yearTextActive: { color: "#00151a" },
    listContainer: { paddingHorizontal: 16, paddingBottom: 50 },
    card: {
        backgroundColor: "#1e293b",
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: "#1f2937",
    },
    name: { color: "#fff", fontSize: 16, fontWeight: "700" },
    email: { color: "#9ca3af", marginTop: 4 },
    meta: { color: "#a1a1aa", marginTop: 2 },
    noData: {
        color: "#9ca3af",
        textAlign: "center",
        marginTop: 60,
        fontSize: 16,
    },
});
