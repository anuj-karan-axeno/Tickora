import { useState } from "react";
import heroImg from "./assets/hero.png";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./page/Login";
import { AuthContextProvider } from "./hooks/AuthContext";
import { Header } from "./components/header";
import Dashboard from "./page/Dashboard";
import { TicketContextProvider } from "./hooks/TicketContext";

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <TicketContextProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </TicketContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
