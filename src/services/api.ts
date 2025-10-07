// src/services/api.ts
import axios from "axios";

export interface Education {
    major?: string;
    enrollmentYear?: string;
    studentId?: string;
}

export interface User {
    _id: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
    type: string;
    confirmed: boolean;
    image?: string;
    education?: Education;
    token?: string;
}

const API_BASE = "https://cis.kku.ac.th/api";
const API_KEY =
    "03e8b6f26b0b058c16e48359cb05028434639ddcaaf2d7a93b425fef24f547df";

const apiClient = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
        "x-api-key": API_KEY,
    },
});

const handleError = (error: any) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || "API Error";
        console.error("❌ API Error:", message);
        throw new Error(message);
    }
    throw error;
};

export const api = {
    // ✅ ใช้ endpoint จริง
    async login(email: string, password: string) {
        try {
            const res = await apiClient.post("/classroom/signin", { email, password });
            const data = res.data?.data;
            if (!data || !data.token) throw new Error("ไม่สามารถเข้าสู่ระบบได้");
            return {
                token: data.token,
                user: data as User,
            };
        } catch (error) {
            handleError(error);
        }
    },

    // 👤 ดึงข้อมูลผู้ใช้ปัจจุบัน
    async getCurrentUser(token: string) {
        try {
            const res = await apiClient.get("/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            return res.data as User;
        } catch (error) {
            handleError(error);
        }
    },

    // 👥 ดึงรายชื่อสมาชิกตามปีที่เข้าเรียน
    // ✅ ดึงสมาชิกของชั้นเรียน พร้อมแนบ token
    async getClassMembers(year: string, token: string) {
        try {
            const res = await apiClient.get(`/classroom/class/${year}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = res.data?.data;
            if (!data) throw new Error("ไม่พบข้อมูลสมาชิก");
            return data as User[];
        } catch (error) {
            handleError(error);
        }
    },


    // 🧠 ดึงโพสต์ทั้งหมด
    async getPosts(token: string) {
        try {
            const res = await apiClient.get("/classroom/status", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ ป้องกัน undefined
            const data = res?.data?.data ?? [];
            if (!Array.isArray(data)) return [];

            return data;
        } catch (error) {
            handleError(error);
            return []; // ✅ ป้องกัน crash ถ้า error
        }
    },

    // ➕ สร้างโพสต์ใหม่
    async createPost(content: string, token: string) {
        try {
            const res = await apiClient.post(
                "/classroom/status",
                { content },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ ป้องกัน undefined
            const data = res?.data?.data;
            if (!data) {
                console.warn("⚠️ createPost: response ไม่มี data");
                return null;
            }

            return data;
        } catch (error) {
            handleError(error);
            return null; // ✅ ป้องกัน crash ถ้า error
        }
    },

    // ❤️ Like / Unlike
    // ❤️ Like / 💔 Unlike
    async toggleLike(statusId: string, isLiked: boolean, token: string) {
        try {
            const method = isLiked ? "delete" : "post";
            const res = await apiClient.request({
                url: "/classroom/like",
                method,
                data: { statusId },
                headers: { Authorization: `Bearer ${token}` },
            });

            return res?.data?.data;
        } catch (error) {
            console.error("❌ toggleLike error:", error);
            return null;
        }
    },

    // 💬 แสดงความคิดเห็น
    async addComment(statusId: string, content: string, token: string) {
        try {
            const res = await apiClient.post(
                "/classroom/comment",
                { statusId, content },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            return res?.data?.data;
        } catch (error) {
            console.error("❌ addComment error:", error);
            return null;
        }
    },

    // 🗑️ ลบโพสต์ของตัวเอง (ตาม Swagger)
    async deletePost(statusId: string, token: string) {
        const url = `/classroom/status/${statusId}`;
        console.log("🚀 [deletePost] DELETE", { url });

        try {
            const res = await apiClient.delete(url, {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("✅ [deletePost] สำเร็จ:", res.data);
            return res?.data?.data;
        } catch (error: any) {
            if (error.response) {
                console.error("❌ [deletePost] Response Error:", {
                    status: error.response.status,
                    data: error.response.data,
                });
            } else {
                console.error("❌ [deletePost] Error:", error.message);
            }
            return null;
        }
    },


    // 💬 ลบความคิดเห็นของตัวเอง (ตาม Swagger)
    async deleteComment(statusId: string, commentId: string, token: string) {
        const url = `/classroom/comment/${commentId}`;
        const body = { statusId };

        console.log("🚀 [deleteComment] DELETE", { url, body });

        try {
            const res = await apiClient.delete(url, {
                headers: { Authorization: `Bearer ${token}` },
                data: body, // 👈 axios รองรับ data ใน DELETE
            });

            console.log("✅ [deleteComment] สำเร็จ:", res.data);
            return res?.data?.data;
        } catch (error: any) {
            if (error.response) {
                console.error("❌ [deleteComment] Response Error:", {
                    status: error.response.status,
                    data: error.response.data,
                });
            } else {
                console.error("❌ [deleteComment] Error:", error.message);
            }
            return null;
        }
    },

};
