import { createContext, useContext, useEffect, useState } from "react";
import { translations } from "../i18n/translations";

const LanguageContext = createContext(null);

function getNested(obj, path) {
  return path.split(".").reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem("kp_lang") || "en");

  useEffect(() => {
    localStorage.setItem("kp_lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  function toggleLanguage() {
    setLang((l) => (l === "en" ? "hi" : "en"));
  }

  // t("home.heroTitle") looks up translations[lang].home.heroTitle,
  // falling back to English, then to the key itself.
  function t(key, vars) {
    let value = getNested(translations[lang], key);
    if (value === undefined) value = getNested(translations.en, key);
    if (value === undefined) return key;
    if (typeof value === "string" && vars) {
      return Object.entries(vars).reduce((str, [k, v]) => str.replaceAll(`{${k}}`, v), value);
    }
    return value;
  }

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
