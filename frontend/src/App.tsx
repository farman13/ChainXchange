import { Dashboard } from './pages/Dashboard'
import { LandingPage } from './pages/LandingPage'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
