
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Login } from "./page/Login";
import { AuthContextProvider } from "./hooks/AuthContext";
import { Header } from "./components/header";
import Dashboard from "./page/Dashboard";
import { TicketContextProvider } from "./hooks/TicketContext";
import './styles/main.scss'

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
