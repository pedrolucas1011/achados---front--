import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function ItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    categoria: "",
    local: "",
    data_encontrado: ""
  });
  
  const [categorias, setCategorias] = useState([]);
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadOptions() {
      try {
        const [catsRes, locsRes] = await Promise.all([
          api.get("/categorias"),
          api.get("/locais")
        ]);
        setCategorias(catsRes.data);
        setLocais(locsRes.data);
      } catch (err) {
        alert("Erro ao carregar opções");
      }
    }
    loadOptions();
  }, []);

  useEffect(() => {
    if (isEditing) {
      async function loadItem() {
        try {
          const response = await api.get(`/itens/${id}`);
          setFormData({
            nome: response.data.nome,
            descricao: response.data.descricao,
            categoria: response.data.categoria,
            local: response.data.local,
            data_encontrado: response.data.data_encontrado
          });
        } catch (err) {
          alert("Erro ao carregar item");
        }
      }
      loadItem();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEditing) {
        await api.put(`/itens/${id}`, formData);
      } else {
        await api.post("/itens", formData);
      }
      navigate("/");
    } catch (err) {
      alert("Erro ao salvar item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>{isEditing ? "Editar item" : "Novo item"}</h2>
      <form onSubmit={handleSubmit}>
        <input name="nome" placeholder="Nome" value={formData.nome} onChange={handleChange} required />
        <textarea name="descricao" placeholder="Descrição" value={formData.descricao} onChange={handleChange} required />
        
        <select name="categoria" value={formData.categoria} onChange={handleChange} required>
          <option value="">Selecione a categoria</option>
          {categorias.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        <select name="local" value={formData.local} onChange={handleChange} required>
          <option value="">Selecione o local</option>
          {locais.map(l => <option key={l} value={l}>{l}</option>)}
        </select>

        <input type="date" name="data_encontrado" value={formData.data_encontrado} onChange={handleChange} required />
        
        <button type="submit" disabled={loading}>Salvar</button>
        <button type="button" onClick={() => navigate("/")}>Cancelar</button>
      </form>
    </div>
  );
}