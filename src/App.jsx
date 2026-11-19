import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans">
        <header className="bg-sage px-6 py-5">
          <h1
            className="text-[30px] leading-tight text-header-cream tracking-tight"
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 500 }}
          >
            Parent Path
          </h1>
          <p className="text-sm text-header-subtitle mt-1">
            Find therapy for your child in Broward — and see who&apos;s really accepting new patients.
          </p>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        <footer className="bg-footer-bg border-t border-sand px-6 py-4 text-xs text-muted text-center">
          Not affiliated with any agency. Listings are not endorsements.
        </footer>
      </div>
    </BrowserRouter>
  )
}
