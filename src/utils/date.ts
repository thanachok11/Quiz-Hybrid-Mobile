// src/utils/date.ts
export const formatThaiDateTime = (dateString: string) => {
    try {
        return new Date(dateString)
            .toLocaleString("th-TH", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            .replace("น.", "")
            .trim() + " น.";
    } catch {
        return "-";
    }
};
