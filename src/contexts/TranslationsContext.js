import { createContext, useState } from "react"
import TranslationsData from "../data/translationsData.json"

/**
 * Translations Context.
 * @type {object}.
 */
export const TranslationsContext = createContext()

/**
 * @component Translations Provider.
 * @param {object} children - The child of the component.
 * @returns {JSX.Element} - The Translations Provider component.
 */
export function TranslationsProvider({ children }) {
    /**
     * Language.
     * @type {[string, function]}.
     */
    const [language, setLanguage] = useState("EN")

    /**
     * The translations of the corresponding language.
     * @type {object}.
     */
    const translations = TranslationsData[language]


    /**
     * Handles change to the next Language.
     */
    function handleChangeLanguage() {
        setLanguage((prevLanguage) => {
            switch (prevLanguage) {
                case "ES":
                    return "FR"
                case "FR":
                    return "EN"
                case "EN":
                    return "PT"
                case "PT":
                    return "ES"
                default:
                    return "EN"
            }
        })
    }

    return (
        <TranslationsContext.Provider value={{ language, translations, changeLanguage: handleChangeLanguage }}>
            {children}
        </TranslationsContext.Provider>
    )
}