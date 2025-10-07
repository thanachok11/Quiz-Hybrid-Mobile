// src/utils/toast.ts
import { Alert } from "react-native";

export const showToast = (title: string, message?: string) => {
    Alert.alert(title, message || "", [{ text: "ตกลง" }]);
};
