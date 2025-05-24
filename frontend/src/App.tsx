import { Dashboard } from './pages/Dashboard'
import { LandingPage } from './pages/LandingPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" reverseOrder={false} toastOptions={{
        duration: 4000,
        style: {
          minWidth: '350px',
          maxWidth: '800px',
          padding: '16px 24px',
          borderRadius: '8px',
          background: '#fff',
          color: '#333',
          boxShadow: '0 4px 14px rgba(0,0,0,0.1)',
          fontSize: '16px',
          fontWeight: '500',
        },
      }} />
    </>
  )
}

export default App
