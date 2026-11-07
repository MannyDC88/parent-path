import { BrowserRouter, Route, Routes } from 'react-router-dom'

function Home() {
  return (
    <main className="flex-1 p-6">
      <p className="text-gray-500">Provider directory coming soon.</p>
    </main>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans">
        <header className="bg-blue-700 text-white px-6 py-4 shadow">
          <h1 className="text-2xl font-bold tracking-tight">Parent Path</h1>
          <p className="text-sm text-blue-200 mt-0.5">
            Broward County Early Intervention &amp; Provider Directory
          </p>
        </header>

        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>

        <footer className="bg-gray-100 border-t border-gray-200 px-6 py-4 text-xs text-gray-500 text-center">
          Not affiliated with any agency. Listings are not endorsements.
        </footer>
      </div>
    </BrowserRouter>
  )
}
