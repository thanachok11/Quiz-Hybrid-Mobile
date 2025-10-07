// src/context/AuthContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api, User } from "../services/api";
import { storage } from "../services/storage";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (email: string, password?: string) => Promise<void>;
    logout: () => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        (async () => {
            try {
                const storedToken = await storage.getToken();
                if (storedToken) {
                    setToken(storedToken);
                    const me = await api.getCurrentUser(storedToken);
                    setUser(me || null);
                }
            } catch (err) {
                console.warn("Auth init failed:", err);
                await storage.clearToken();
                setUser(null);
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    const login = async (email: string, password = "") => {
        const res = await api.login(email, password);
        const token = res?.token ?? null;
        const user = res?.user ?? null;

        if (!token || !user) throw new Error("เข้าสู่ระบบไม่สำเร็จ");

        await storage.setToken(token);
        setToken(token);
        setUser(user);
    };

    const logout = async () => {
        await storage.clearToken();
        setUser(null);
        setToken(null);
    };

    const value = useMemo(
        () => ({ user, token, login, logout, loading }),
        [user, token, loading]
    );

    if (loading) return null;

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
