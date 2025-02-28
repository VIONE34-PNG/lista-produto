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
      if (!resposta.ok) throw new Error("Erro ao carregar produtos");
      const dados = await resposta.json();
      setProdutos(dados.map(produto => ({ ...produto, id: String(produto.id) })).sort((a, b) => a.id - b.id));
    } catch (erro) {
      console.error("Erro ao carregar produtos:", erro);
    }
  };

  const filtrarProdutos = () =>
    produtos.filter(produto =>
      produto.name.toLowerCase().includes(termoPesquisa.toLowerCase())
    );

  const abrirModal = (produto = null) => {
    setProdutoEditando(
      produto ? { ...produto } : { name: "", price: "", description: "" }
    );
    setModalVisivel(true);
  };

  const fecharModal = () => {
    setProdutoEditando(null);
    setModalVisivel(false);
  };

  const salvarProduto = async produto => {
    const editando = !!produtoEditando?.id;
    const url = editando ? `${API_URL}/${produtoEditando.id}` : API_URL;
    const metodo = editando ? "PUT" : "POST";
    produto.id = editando ? String(produtoEditando.id) : String(produtos.length > 0 ? Math.max(...produtos.map(p => Number(p.id))) + 1 : 1);

    try {
      const resposta = await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(produto),
      });

      if (!resposta.ok) throw new Error("Erro ao salvar produto");
      await carregarProdutos();
      fecharModal();
    } catch (erro) {
      console.error("Erro ao salvar produto:", erro);
    }
  };

  const excluirProduto = async id => {
    const idString = String(id);
    console.log(`Tentando excluir produto com ID: ${idString}`);
    try {
      const resposta = await fetch(`${API_URL}/${idString}`, { method: "DELETE" });
      if (!resposta.ok) {
        const erroTexto = await resposta.text();
        throw new Error(`Erro ao excluir produto: ${erroTexto}`);
      }
      console.log(`Produto ${idString} excluído com sucesso.`);
      setProdutos(produtos => produtos.filter(produto => produto.id !== idString));
    } catch (erro) {
      console.error("Erro ao excluir produto:", erro);
      alert(`Erro ao excluir produto: ${erro.message}`);
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
