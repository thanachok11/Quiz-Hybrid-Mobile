import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import MembersScreen from "../screens/MembersScreen";
import ProfileScreen from "../screens/ProfileScreen";
import FeedScreen from "../screens/FeedScreen";
import HomeScreen from "../screens/HomeScreen";
import { useThemeContext } from "../context/ThemeContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const { theme } = useThemeContext();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.surface,
                    borderTopColor: theme.border,
                    height: 65,
                    paddingBottom: 6,
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textMuted,
                tabBarIcon: ({ color }) => {
                    let iconName: keyof typeof Ionicons.glyphMap = "ellipse";

                    if (route.name === "โพสต์") iconName = "chatbubbles-outline";
                    else if (route.name === "หน้าหลัก") iconName = "home-outline";
                    else if (route.name === "สมาชิก") iconName = "people-outline";
                    else if (route.name === "โปรไฟล์") iconName = "person-circle-outline";

                    return <Ionicons name={iconName} size={22} color={color} />;
                },
            })}
        >
            <Tab.Screen name="หน้าหลัก" component={HomeScreen} />
            <Tab.Screen name="โพสต์" component={FeedScreen} />
            <Tab.Screen name="สมาชิก" component={MembersScreen} />
            <Tab.Screen name="โปรไฟล์" component={ProfileScreen} />
        </Tab.Navigator>
    );
}
