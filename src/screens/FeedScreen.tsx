import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    StyleSheet,
    SafeAreaView,
    ActivityIndicator,
    TouchableOpacity,
    Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "../components/ThemeToggle"; // ✅ import ปุ่มสลับธีม
import { useThemeContext } from "../context/ThemeContext"; // ✅ ใช้ theme

interface LikeUser {
    _id: string;
    email: string;
}
interface Comment {
    _id: string;
    content: string;
    createdAt: string;
    createdBy: { _id: string; email: string };
}
interface Post {
    _id: string;
    content: string;
    createdAt: string;
    createdBy: { _id: string; email: string };
    like: LikeUser[];
    comment: Comment[];
}

export default function FeedScreen() {
    const { token, user } = useAuth();
    const { theme } = useThemeContext(); // ✅ ดึงธีม
    const [posts, setPosts] = useState<Post[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [expanded, setExpanded] = useState<string | null>(null);
    const [commentText, setCommentText] = useState<{ [key: string]: string }>({});

    const fetchPosts = async () => {
        if (!token) return;
        try {
            setLoading(true);
            const data = await api.getPosts(token);
            setPosts(
                Array.isArray(data)
                    ? data.sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    )
                    : []
            );
        } catch (error) {
            console.error("❌ Fetch posts failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePost = async () => {
        if (!content.trim()) return;
        try {
            setSubmitting(true);
            await api.createPost(content.trim(), token!);
            setContent("");
            await fetchPosts();
        } catch (error) {
            console.error("❌ Create post failed:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleLike = async (statusId: string, isLiked: boolean) => {
        if (!token) return;
        await api.toggleLike(statusId, isLiked, token);
        await fetchPosts();
    };


    const handleAddComment = async (statusId: string) => {
        const text = commentText[statusId]?.trim();
        if (!text || !token) return;
        await api.addComment(statusId, text, token);
        setCommentText((prev) => ({ ...prev, [statusId]: "" }));
        await fetchPosts();
    };

    const handleDeletePost = async (statusId: string) => {
        Alert.alert("ยืนยันการลบ", "คุณต้องการลบโพสต์นี้หรือไม่?", [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ลบ",
                style: "destructive",
                onPress: async () => {
                    await api.deletePost(statusId, token!);
                    await fetchPosts();
                },
            },
        ]);
    };

    const handleDeleteComment = async (statusId: string, commentId: string) => {
        Alert.alert("ลบความคิดเห็น", "ต้องการลบความคิดเห็นนี้หรือไม่?", [
            { text: "ยกเลิก", style: "cancel" },
            {
                text: "ลบ",
                style: "destructive",
                onPress: async () => {
                    await api.deleteComment(statusId, commentId, token!);
                    await fetchPosts();
                },
            },
        ]);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            {/* ปุ่มสลับธีม */}
            <View style={{ paddingHorizontal: 16, marginBottom: 40,marginTop:0 }}>
                <ThemeToggle />
            </View>

            <Text style={[styles.header, { color: theme.text }]}>📢 โพสต์สถานะ</Text>

            {/* ฟอร์มโพสต์ */}
            <View style={[styles.newPostCard, { backgroundColor: theme.surface }]}>
                <TextInput
                    placeholder="คุณกำลังคิดอะไรอยู่..."
                    placeholderTextColor={theme.textMuted}
                    multiline
                    value={content}
                    onChangeText={setContent}
                    style={[styles.input, { backgroundColor: theme.surfaceAlt, color: theme.text }]}
                />
                <Pressable
                    onPress={handleCreatePost}
                    disabled={submitting}
                    style={[
                        styles.postButton,
                        { opacity: submitting || !content.trim() ? 0.6 : 1 },
                        { backgroundColor: "#22ee7eff" } // ✅ สีคงที่ ไม่เปลี่ยนตามธีม
                    ]}
                >
                    <Text style={[styles.postButtonText, { color: "#00151a" }]}>
                        {submitting ? "กำลังโพสต์..." : "โพสต์"}
                    </Text>
                </Pressable>

            </View>

            {/* รายการโพสต์ */}
            {loading ? (
                <ActivityIndicator color={theme.primary} size="large" style={{ marginTop: 40 }} />
            ) : posts.length === 0 ? (
                <Text style={[styles.noData, { color: theme.textMuted }]}>ยังไม่มีโพสต์</Text>
            ) : (
                <FlatList
                    data={posts}
                    keyExtractor={(item) => item._id}
                    contentContainerStyle={styles.listContainer}
                    renderItem={({ item }) => {
                        const isExpanded = expanded === item._id;
                        const commentCount = item.comment?.length || 0;
                        const likeCount = item.like?.length || 0;
                        const isLiked = item.like.some((u) => u._id === user?._id);

                        return (
                            <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                                {/* หัวโพสต์ */}
                                <View style={styles.headerRow}>
                                    <View>
                                        <Text style={[styles.author, { color: theme.primary }]}>
                                            {item.createdBy?.email}
                                        </Text>
                                        <Text style={[styles.date, { color: theme.textMuted }]}>
                                            {new Date(item.createdAt).toLocaleString("th-TH")}
                                        </Text>
                                    </View>

                                    {/* แสดงปุ่มลบถ้าเป็นโพสต์ของเรา */}
                                    {item.createdBy?._id === user?._id && (
                                        <TouchableOpacity onPress={() => handleDeletePost(item._id)}>
                                            <Ionicons name="trash-outline" size={20} color={theme.danger} />
                                        </TouchableOpacity>
                                    )}
                                </View>

                                <Text style={[styles.content, { color: theme.text }]}>{item.content}</Text>

                                {/* Action: like / comment */}
                                <View style={styles.actionsRow}>
                                    <TouchableOpacity
                                        onPress={() => handleToggleLike(item._id, isLiked)}
                                        style={styles.actionItem}
                                    >
                                        <Ionicons
                                            name={isLiked ? "heart" : "heart-outline"}
                                            size={18}
                                            color={isLiked ? theme.danger : theme.textMuted}
                                        />
                                        <Text style={[styles.countText, { color: theme.textMuted }]}>{likeCount}</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => setExpanded(isExpanded ? null : item._id)}
                                        style={styles.actionItem}
                                    >
                                        <Ionicons name="chatbubble-outline" size={18} color={theme.primary} />
                                        <Text style={[styles.countText, { color: theme.textMuted }]}>{commentCount}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* แสดงคอมเมนต์ */}
                                {isExpanded && (
                                    <View style={styles.commentSection}>
                                        {item.comment.map((c) => (
                                            <View key={c._id} style={[styles.commentBubble, { backgroundColor: theme.surfaceAlt }]}>
                                                <View style={styles.commentHeader}>
                                                    <Text style={[styles.commentAuthor, { color: theme.primary }]}>
                                                        {c.createdBy.email}
                                                    </Text>

                                                    {c.createdBy._id === user?._id && (
                                                        <TouchableOpacity
                                                            onPress={() => handleDeleteComment(item._id, c._id)}
                                                        >
                                                            <Ionicons
                                                                name="trash-outline"
                                                                size={16}
                                                                color={theme.danger}
                                                            />
                                                        </TouchableOpacity>
                                                    )}
                                                </View>
                                                <Text style={[styles.commentText, { color: theme.text }]}>{c.content}</Text>
                                            </View>
                                        ))}

                                        {/* กล่องคอมเมนต์ใหม่ */}
                                        <View style={[styles.commentInputContainer, { backgroundColor: theme.surfaceAlt }]}>
                                            <TextInput
                                                placeholder="เขียนความคิดเห็น..."
                                                placeholderTextColor={theme.textMuted}
                                                value={commentText[item._id] || ""}
                                                onChangeText={(t) =>
                                                    setCommentText((prev) => ({ ...prev, [item._id]: t }))
                                                }
                                                style={[styles.commentInput, { color: theme.text }]}
                                            />
                                            <Pressable
                                                onPress={() => handleAddComment(item._id)}
                                                style={[styles.sendButton, { backgroundColor: theme.primary }]}
                                            >
                                                <Ionicons name="send" size={18} color={theme.surface} />
                                            </Pressable>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                />
            )}
        </SafeAreaView>
    );
}

// --- styles เหมือนเดิม boss ---
const styles = StyleSheet.create({
    container: { flex: 1, paddingTop: 20 },
    header: {
        fontSize: 22,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 10,
    },
    newPostCard: {
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 16,
        marginBottom: 12,
    },
    input: {
        borderRadius: 10,
        padding: 10,
        minHeight: 60,
        textAlignVertical: "top",
    },
    postButton: {
        borderRadius: 10,
        marginTop: 10,
        paddingVertical: 10,
    },
    postButtonText: {
        textAlign: "center",
        fontWeight: "700",
        fontSize: 16,
    },
    listContainer: { paddingHorizontal: 16, paddingBottom: 50 },
    card: {
        borderRadius: 14,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    author: { fontSize: 16, fontWeight: "700" },
    date: { fontSize: 12 },
    content: { fontSize: 15, lineHeight: 20, marginTop: 6 },
    actionsRow: {
        flexDirection: "row",
        marginTop: 10,
        gap: 16,
        alignItems: "center",
    },
    actionItem: { flexDirection: "row", alignItems: "center", gap: 4 },
    countText: { fontSize: 13 },
    commentSection: { marginTop: 10, gap: 6 },
    commentBubble: {
        borderRadius: 10,
        padding: 8,
    },
    commentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    commentAuthor: { fontWeight: "600" },
    commentText: {},
    commentInputContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 8,
        borderRadius: 8,
        paddingHorizontal: 8,
    },
    commentInput: { flex: 1, paddingVertical: 6 },
    sendButton: {
        borderRadius: 8,
        padding: 6,
        marginLeft: 6,
    },
    noData: { textAlign: "center", marginTop: 40, fontSize: 16 },
});