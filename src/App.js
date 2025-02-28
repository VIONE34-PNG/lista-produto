import React, { useState, useEffect } from "react";
import { Button } from "antd";
import BarraPesquisa from "./components/BarraPesquisa";
import FormularioProduto from "./components/FormularioProduto";
import TabelaProdutos from "./components/TabelaProdutos";
import "./App.css";

const API_URL = "http://localhost:3001/products";

const App = () => {
  const [produtos, setProdutos] = useState([]);
  const [termoPesquisa, setTermoPesquisa] = useState("");
  const [modalVisivel, setModalVisivel] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState(null);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();
      setProdutos(dados.sort((a, b) => a.id - b.id));
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  };

  const filtrarProdutos = () => {
    return produtos.filter(produto =>
      produto.name.toLowerCase().includes(termoPesquisa.toLowerCase())
    );
  };

  const abrirModal = (produto = null) => {
    setProdutoEditando(produto ? { ...produto } : { name: "", price: "", description: "" });
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setProdutoEditando(null);
    setModalVisivel(false);
  };

  const salvarProduto = async (valores) => {
    const isEditando = !!produtoEditando?.id;
    const url = isEditando ? `${API_URL}/${produtoEditando.id}` : API_URL;
    const metodo = isEditando ? "PUT" : "POST";

    try {
      if (!isEditando) {
        valores.id = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
      }

      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(valores),
      });

      if (!resposta.ok) throw new Error("Erro ao salvar produto");

      const produtoAtualizado = await resposta.json();
      setProdutos(prevProdutos => {
        return isEditando
          ? prevProdutos.map(p => (p.id === produtoEditando.id ? produtoAtualizado : p))
          : [...prevProdutos, produtoAtualizado].sort((a, b) => a.id - b.id);
      });

      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro);
    }
  };

  const excluirProduto = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setProdutos(prevProdutos => prevProdutos.filter(produto => produto.id !== id));
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
    }
  };

  return (
    <div className="container">
      <h1>Gestão de Produtos</h1>
      <BarraPesquisa valor={termoPesquisa} aoMudar={setTermoPesquisa} />
      <Button type="primary" onClick={() => abrirModal()} style={{ marginBottom: 20 }}>
        Adicionar Produto
      </Button>
      <TabelaProdutos dados={filtrarProdutos()} aoEditar={abrirModal} aoExcluir={excluirProduto} />
      <FormularioProduto
        visivel={modalVisivel}
        aoCancelar={fecharModal}
        valoresIniciais={produtoEditando || { name: "", price: "", description: "" }}
        aoSalvar={salvarProduto}
      />
    </div>
  );
};

export default App;
