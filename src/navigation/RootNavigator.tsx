import React from "react";
import { NavigationContainer, DarkTheme, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import AppNavigator from "./AppNavigator";
import { useAuth } from "../context/AuthContext";
import { useThemeContext } from "../context/ThemeContext";

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
    const { user } = useAuth();
    const { mode } = useThemeContext();

    const navigationTheme = mode === "dark" ? DarkTheme : DefaultTheme;

    return (
        <NavigationContainer theme={navigationTheme}>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!user ? (
                    <Stack.Screen name="Login" component={LoginScreen} />
                ) : (
                    <Stack.Screen name="App" component={AppNavigator} />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
}
