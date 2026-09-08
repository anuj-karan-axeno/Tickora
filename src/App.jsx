import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Login } from './page/Login'
import { AuthContextProvider } from './hooks/AuthContext'

function App() {

  return (
    <AuthContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Login />} />
        </Routes>
      </BrowserRouter>
    </AuthContextProvider>
  )
}

export default App
