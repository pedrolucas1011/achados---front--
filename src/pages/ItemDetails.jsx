import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    async function fetchItem() {
      try {
        const response = await api.get(`/itens/${id}`);
        setItem(response.data);
      } catch (err) {
        alert("Erro ao carregar item");
      } finally {
        setLoading(false);
      }
    }
    fetchItem();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
      try {
        await api.delete(`/itens/${id}`);
        navigate("/");
      } catch (err) {
        alert("Erro ao excluir");
      }
    }
  };

  const handleDevolver = async () => {
    if (!receiver) return alert("Informe para quem foi devolvido");
    try {
      await api.patch(`/itens/${id}/devolver`, { devolvido_para: receiver });
      const response = await api.get(`/itens/${id}`);
      setItem(response.data);
      setReceiver("");
    } catch (err) {
      alert("Erro ao devolver");
    }
  };

  if (loading) return <p>Carregando...</p>;
  if (!item) return <p>Item não encontrado</p>;

  return (
    <div>
      <button onClick={() => navigate(-1)}>Voltar</button>
      <h2>{item.nome} ({item.status})</h2>
      <p>Descrição: {item.descricao}</p>
      <p>Categoria: {item.categoria}</p>
      <p>Local: {item.local}</p>
      <p>Encontrado em: {item.data_encontrado}</p>
      
      {item.status === "devolvido" && (
        <p>Devolvido para: {item.devolvido_para} em {item.data_devolucao}</p>
      )}

      {item.status === "aguardando" && (
        <div>
          <input 
            type="text" 
            placeholder="Nome de quem recebeu" 
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <button onClick={handleDevolver}>Marcar como devolvido</button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        <Link to={`/editar/${item.id}`}><button>Editar</button></Link>
        <button onClick={handleDelete}>Excluir</button>
      </div>
    </div>
  );
}