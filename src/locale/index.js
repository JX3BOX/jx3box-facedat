import zhCN from "./zh-CN";
import zhTW from "./zh-TW";
import enUS from "./en-US";
import vi from "./vi";

export const FACEDAT_FALLBACK_LOCALE = "zh-CN";
export const FACEDAT_AVAILABLE_LOCALES = ["zh-CN", "zh-TW", "en-US", "vi"];

export const facedatMessages = {
    "zh-CN": zhCN,
    "zh-TW": zhTW,
    "en-US": enUS,
    vi,
};

export function normalizeFacedatLocale(locale) {
    const value = String(locale || "").replace(/_/g, "-").toLowerCase();
    if (["zh-tw", "zh-hk", "zh-mo", "zh-hant"].includes(value)) return "zh-TW";
    if (value === "vi" || value.startsWith("vi-")) return "vi";
    if (value === "en" || value.startsWith("en-")) return "en-US";
    return "zh-CN";
}

function getMessageValue(locale, key) {
    const path = key.split(".");
    let value = facedatMessages[locale];
    for (const segment of path) {
        value = value?.[segment];
        if (value === undefined) return undefined;
    }
    return value;
}

function interpolate(message, params) {
    if (typeof message !== "string") return message;
    return message.replace(/\{(\w+)\}/g, (source, name) =>
        Object.prototype.hasOwnProperty.call(params, name) ? String(params[name]) : source
    );
}

export function translateFacedat(locale, key, params = {}, fallback = "") {
    const normalizedLocale = normalizeFacedatLocale(locale);
    const value =
        getMessageValue(normalizedLocale, key) ?? getMessageValue(FACEDAT_FALLBACK_LOCALE, key) ?? fallback ?? key;
    return interpolate(value, params);
}

export function mergeFacedatLocaleMessages(i18n) {
    const global = i18n?.global;
    if (!global?.mergeLocaleMessage) return i18n;
    for (const locale of FACEDAT_AVAILABLE_LOCALES) {
        global.mergeLocaleMessage(locale, facedatMessages[locale]);
    }
    return i18n;
}
