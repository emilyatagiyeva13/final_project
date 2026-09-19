// src/hooks/useLocalize.js
import { useCallback } from "react";
import { useLanguage } from "../../context/LangContext";
export function useLocalize() {
    const { currentLang } = useLanguage();
    const lang = (currentLang || "en").split("-")[0];

    const localize = useCallback(
        (row, field) => row?.[`${field}_${lang}`] || row?.[field] || "",
        [lang]
    );

    return { localize, lang };
}