import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "./services/api";
import Home from "./pages/Home";
import ItemDetails from "./pages/ItemDetails";
import ItemForm from "./pages/ItemForm";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await api.get("/eu");
        setUser(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchUser();
  }, []);

  return (
    <BrowserRouter>
      <header>
        <h1>Achados e Perdidos</h1>
        {user ? <p>Olá, {user.nome}</p> : <p>Carregando usuário...</p>}
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/item/:id" element={<ItemDetails />} />
          <Route path="/novo" element={<ItemForm />} />
          <Route path="/editar/:id" element={<ItemForm />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;