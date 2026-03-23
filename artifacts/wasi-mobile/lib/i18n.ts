import * as Localization from "expo-localization";
import ar from "@/translations/ar";
import en from "@/translations/en";

type TranslationShape = typeof ar;

const translations: Record<string, TranslationShape> = { ar, en };

function getDeviceLocale(): string {
  const locales = Localization.getLocales();
  const tag = locales?.[0]?.languageTag ?? "en";
  const lang = tag.split("-")[0].toLowerCase();
  return translations[lang] ? lang : "en";
}

export const locale = getDeviceLocale();
export const isRTL = locale === "ar";
export const t = translations[locale] as TranslationShape;
export default t;
