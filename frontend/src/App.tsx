import React, { Suspense, lazy } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./App.css"

const PropertyList = lazy(() => import("./components/PropertyList"))
const PropertyDetail = lazy(() => import("./components/PropertyDetail"))

const LoadingFallback: React.FC = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <p>Loading...</p>
  </div>
)

function App() {
  return (
    <Router>
      <div className="App">
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<PropertyList />} />
            <Route path="/property/:id" element={<PropertyDetail />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
