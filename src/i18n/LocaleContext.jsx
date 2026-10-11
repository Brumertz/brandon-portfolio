import { createContext, useContext, useEffect, useMemo, useState } from "react";

import en from "./en";
import es from "./es";

const DICTS = { en, es };
const STORAGE_KEY = "brtz-lang";

const LocaleContext = createContext({
  lang: "en",
  setLang: () => {},
  content: en,
});

const getInitialLang = () => {
  if (typeof window === "undefined") return "en";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && DICTS[stored]) return stored;
    const browser = window.navigator.language?.slice(0, 2);
    if (browser === "es") return "es";
  } catch {
    /* storage unavailable — fall through to default */
  }
  return "en";
};

export const LocaleProvider = ({ children }) => {
  const [lang, setLang] = useState(getInitialLang);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* ignore */
    }
    document.documentElement.lang = lang;
    document.title = DICTS[lang].meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", DICTS[lang].meta.description);
  }, [lang]);

  const value = useMemo(
    () => ({ lang, setLang, content: DICTS[lang] }),
    [lang]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
};

export const useLocale = () => useContext(LocaleContext);
