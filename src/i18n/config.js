import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import headerAZ from "../i18n/locales/az/header.json"
import headerEN from "../i18n/locales/en/header.json"
import homeEN from "../i18n/locales/en/home.json"
import homeAZ from "../i18n/locales/az/home.json"
import contactAZ from "../i18n/locales/az/contact.json"
import contactEN from "../i18n/locales/en/contact.json"
import shopAZ from "../i18n/locales/az/shop.json"
import shopEN from "../i18n/locales/en/shop.json"
import blogAZ from "../i18n/locales/az/blog.json"
import blogEN from "../i18n/locales/en/blog.json"
import commonAZ from "../i18n/locales/az/common.json"
import commonEN from "../i18n/locales/en/common.json"
import dashboardAZ from "../i18n/locales/az/dashboard.json"
import dashboardEN from "../i18n/locales/en/dashboard.json"


export const SUPPORTED_LANGUAGES = ['az', 'en']

export const LANGUAGE_STORAGE_KEY = 'bokifa_lang'

const resources = {
    az: {
        header: headerAZ,
        home: homeAZ,
        contact: contactAZ,
        shop: shopAZ,
        blog: blogAZ,
        common: commonAZ,
        dashboard: dashboardAZ
    },
    en: {
        header: headerEN,
        home: homeEN,
        contact: contactEN,
        shop: shopEN,
        blog: blogEN,
        common: commonEN,
        dashboard: dashboardEN






    },
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        supportedLngs: SUPPORTED_LANGUAGES,
        ns: ['header', 'home', 'contact', 'shop', 'blog', 'common','dashboard'],
        defaultNS: 'header',
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: LANGUAGE_STORAGE_KEY,
            caches: ['localStorage'],
        },
    })

export default i18n