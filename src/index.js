import "./index.css"
import React from "react"
import App from "./components/App"
import ReactDOM from "react-dom/client"

/**
 * Entry point of the application.
 * - Renders the main App component to the root DOM element.
 * - Wraps the App component in React.StrictMode to enable additional checks and warnings.
 * @function render
 */
const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)