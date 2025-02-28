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
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const resposta = await fetch(API_URL);
      const dados = await resposta.json();
      setProdutos(dados.sort((a, b) => a.id - b.id));
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  };

  const filtrarProdutos = () => 
    produtos.filter(produto => produto.name.toLowerCase().includes(termoPesquisa.toLowerCase()));

  const abrirModal = (produto = null) => {
    setProdutoEditando(produto ? { ...produto } : { name: "", price: "", description: "" });
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setProdutoEditando(null);
    setModalVisivel(false);
  };

  const salvarProduto = async (produto) => {
    const editando = !!produtoEditando?.id;
    const url = editando ? `${API_URL}/${produtoEditando.id}` : API_URL;
    const metodo = editando ? "PUT" : "POST";

    try {
      if (!editando) {
        produto.id = produtos.length > 0 ? Math.max(...produtos.map(p => p.id)) + 1 : 1;
      }

      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      });

      if (!resposta.ok) throw new Error("Erro ao salvar produto");

      const produtoAtualizado = await resposta.json();
      setProdutos(produtos => 
        editando ? produtos.map(p => (p.id === produtoEditando.id ? produtoAtualizado : p)) : [...produtos, produtoAtualizado].sort((a, b) => a.id - b.id)
      );

      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro);
    }
  };

  const excluirProduto = async (id) => {
    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      setProdutos(produtos => produtos.filter(produto => produto.id !== id));
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
    }
  };

  return (
    <div className="container">
      <h1>Gestão de Produtos</h1>
      <BarraPesquisa valor={termoPesquisa} aoMudar={setTermoPesquisa} />
      <Button type="primary" onClick={() => abrirModal()} className="btn-adicionar">
        Adicionar Produto
      </Button>
      <TabelaProdutos dados={filtrarProdutos()} aoEditar={abrirModal} aoExcluir={excluirProduto} />
      {modalVisivel && (
        <FormularioProduto
          key={produtoEditando?.id || "novo"}
          visivel={modalVisivel}
          aoCancelar={fecharModal}
          valoresIniciais={produtoEditando || { name: "", price: "", description: "" }}
          aoSalvar={salvarProduto}
        />
      )}
    </div>
  );
};

export default App;
