// src/utils/helpers.ts
export const truncate = (text: string, maxLength = 100) =>
    text.length > maxLength ? text.substring(0, maxLength) + "..." : text;

export const isEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const logDev = (...args: any[]) => {
    if (__DEV__) console.log(...args);
};
