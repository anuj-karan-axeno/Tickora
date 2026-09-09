
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Login } from "./page/Login";
import { AuthContextProvider } from "./hooks/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Header } from "./components/header";
import Dashboard from "./page/Dashboard";
import HomePage from "./page/HomePage";
import { TicketContextProvider } from "./hooks/TicketContext";
import './styles/main.scss'

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <TicketContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </TicketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
