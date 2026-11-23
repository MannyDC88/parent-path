import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import ChatAssistant from './components/ChatAssistant'
import PageFeedback from './components/PageFeedback'
import Logo from './components/Logo'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-cream text-charcoal font-sans">
        <header className="bg-sage">
          <div className="max-w-5xl mx-auto px-6 py-5 flex items-center gap-4">
            {/* Logo — 56px desktop, 38px mobile */}
            <span className="hidden sm:block"><Logo size={56} /></span>
            <span className="block sm:hidden"><Logo size={38} /></span>

            <div>
              <h1
                className="leading-tight tracking-tight"
                style={{
                  fontFamily: 'Fraunces, serif',
                  fontWeight: 500,
                  fontSize: 'clamp(28px, 5vw, 42px)',
                }}
              >
                <span
                  style={{
                    color: '#FFFFFF',
                    fontWeight: 600,
                    fontVariationSettings: "'SOFT' 100",
                  }}
                >
                  Parent{' '}
                </span>
                <em
                  style={{
                    color: '#F2D57E',
                    fontStyle: 'italic',
                    fontWeight: 500,
                  }}
                >
                  Path
                </em>
              </h1>
              <p
                className="text-header-subtitle mt-0.5"
                style={{ fontSize: 'clamp(14px, 2vw, 15px)' }}
              >
                Find therapy for your child in Broward — and see who&apos;s really accepting new patients.
              </p>
            </div>
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
