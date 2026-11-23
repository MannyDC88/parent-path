import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ChatAssistant from './components/ChatAssistant'
import PageFeedback from './components/PageFeedback'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans">
        <header className="bg-sage">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <h1
              className="text-[30px] leading-tight text-header-cream tracking-tight"
              style={{ fontFamily: 'Fraunces, serif', fontWeight: 500 }}
            >
              Parent Path
            </h1>
            <p className="text-sm text-header-subtitle mt-1">
              Find therapy for your child in Broward — and see who&apos;s really accepting new patients.
            </p>
          </div>
          {/* Decorative 4-color stripe */}
          <div aria-hidden="true" className="flex h-[5px] w-full">
            <div className="flex-1" style={{ backgroundColor: '#6F95C7' }} />
            <div className="flex-1" style={{ backgroundColor: '#E8C766' }} />
            <div className="flex-1" style={{ backgroundColor: '#D9776B' }} />
            <div className="flex-1" style={{ backgroundColor: '#7FAE72' }} />
          </div>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        <footer className="bg-footer-bg border-t border-sand px-6 py-6 text-xs text-muted">
          <div className="max-w-5xl mx-auto flex flex-col gap-5">
            <PageFeedback />
            <p className="text-center">Not affiliated with any agency. Listings are not endorsements.</p>
          </div>
        </footer>

        <ChatAssistant />
      </div>
    </BrowserRouter>
  )
}
