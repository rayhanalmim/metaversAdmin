import { createContext, useCallback, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { translations, Language, DEFAULT_LANGUAGE } from './translations';

const STORAGE_KEY = 'admin_dashboard_lang';

interface I18nContextValue {
    lang: Language;
    setLang: (l: Language) => void;
    t: (key: string, vars?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

function readSavedLang(): Language {
    try {
        const v = localStorage.getItem(STORAGE_KEY);
        if (v === 'en' || v === 'ja') return v;
    } catch {
        /* SSR or storage disabled */
    }
    return DEFAULT_LANGUAGE;
}

function interpolate(s: string, vars?: Record<string, string | number>): string {
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (_, k) => (vars[k] !== undefined ? String(vars[k]) : `{${k}}`));
}

export function I18nProvider({ children }: { children: ReactNode }) {
    const [lang, setLangState] = useState<Language>(() => readSavedLang());

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, lang);
        } catch {
            /* ignore */
        }
        if (typeof document !== 'undefined') {
            document.documentElement.lang = lang;
        }
    }, [lang]);

    const setLang = useCallback((l: Language) => setLangState(l), []);

    const t = useCallback(
        (key: string, vars?: Record<string, string | number>) => {
            const raw =
                translations[lang]?.[key] ??
                translations.en?.[key] ??
                key;
            return interpolate(raw, vars);
        },
        [lang],
    );

    const value = useMemo<I18nContextValue>(() => ({ lang, setLang, t }), [lang, setLang, t]);

    return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
    const ctx = useContext(I18nContext);
    if (!ctx) {
        // Fallback so components don't crash if used outside provider during HMR / tests.
        return {
            lang: DEFAULT_LANGUAGE,
            setLang: () => undefined,
            t: (k) => translations[DEFAULT_LANGUAGE]?.[k] ?? k,
        };
    }
    return ctx;
}

/** Convenience: returns just the translator. */
export function useT(): I18nContextValue['t'] {
    return useI18n().t;
}
