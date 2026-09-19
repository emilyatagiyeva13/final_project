// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import i18n from "../i18n/config";
import { supabase } from "../supabaseClient.js";
import { useAuthStore } from "../store/authStore.js";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const user = useAuthStore((s) => s.user);

  // i18next artıq init zamanı localStorage/navigator-dan düzgün dili seçib
  // sadəcə onun cari dəyərini oxuyuruq
  const [currentLang, setCurrentLang] = useState(i18n.language);
  

  // i18next-in öz dəyişikliklərini (məsələn başqa yerdə changeLanguage çağırılsa) izləyirik
  useEffect(() => {
    const handleChange = (lng) => setCurrentLang(lng);
    i18n.on("languageChanged", handleChange);
    return () => i18n.off("languageChanged", handleChange);
  }, []);

  // İstifadəçi login olanda DB-dəki seçimi yoxla
  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    supabase
      .from("profiles")
      .select("preferred_lang")
      .eq("id", user.id)
      .single()
      .then(({ data, error }) => {
        if (!cancelled && !error && data?.preferred_lang && data.preferred_lang !== i18n.language) {
          i18n.changeLanguage(data.preferred_lang); // localStorage-ı da i18next özü yeniləyir
        }
      });

    return () => { cancelled = true; };
  }, [user?.id]);

  // İstifadəçi manual dəyişdikdə
  const changeLanguage = async (lang) => {
    i18n.changeLanguage(lang); // bu, localStorage-ı da avtomatik yeniləyir (caches: ['localStorage'])

    if (user) {
      await supabase.from("profiles").update({ preferred_lang: lang }).eq("id", user.id);
    }
  };

  return (
    <LanguageContext.Provider value={{ currentLang, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage yalnız LanguageProvider daxilində işlədilə bilər");
  return ctx;
}