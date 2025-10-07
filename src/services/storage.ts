// src/services/storage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "auth_token_v1";

export const storage = {
  async getToken() {
    return AsyncStorage.getItem(KEY);
  },
  async setToken(token: string) {
    return AsyncStorage.setItem(KEY, token);
  },
  async clearToken() {
    return AsyncStorage.removeItem(KEY);
  },
};
