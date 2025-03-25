import { TranslationsProvider } from "../contexts/TranslationsContext"

/**
 * @component App Providers.
 * @param {object} children - The child of the component.
 * @returns {JSX.Element} - The App Providers component.
 */
const AppProviders = ({ children }) => {
  return (
    <TranslationsProvider>
      {children}
    </TranslationsProvider>
  )
}

export default AppProviders