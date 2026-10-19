import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Home() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [busca, setBusca] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        setError(false);
        const params = {};
        if (busca) params.busca = busca;
        if (status) params.status = status;
        
        const response = await api.get("/itens", { params });
        setItems(response.data);
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, [busca, status]);

  return (
    <div>
      <div className="filtros">
        <input 
          type="text" 
          placeholder="Buscar por nome ou descrição..." 
          value={busca} 
          onChange={(e) => setBusca(e.target.value)} 
        />
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Todos os status</option>
          <option value="aguardando">Aguardando</option>
          <option value="devolvido">Devolvido</option>
        </select>
        <Link to="/novo"><button>+ Novo item</button></Link>
      </div>

      {loading && <p>Carregando itens...</p>}
      {error && <p>Não foi possível carregar. Verifique sua chave.</p>}
      {!loading && !error && items.length === 0 && <p>Nenhum item encontrado.</p>}
      
      {!loading && !error && items.length > 0 && (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <h3>{item.nome}</h3>
              <p>Status: {item.status}</p>
              <Link to={`/item/${item.id}`}>Ver detalhes</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}