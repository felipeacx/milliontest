import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import { monitorWebVitals, performanceMonitor } from "./utils/performance"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

monitorWebVitals()
reportWebVitals()

if (process.env.NODE_ENV === "development") {
  ;(window as any).performanceMonitor = performanceMonitor
}
