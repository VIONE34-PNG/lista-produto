import React from 'react';
import { Table, Button, Space } from 'antd';

const { Column } = Table;

const TabelaProdutos = ({ dados, aoEditar, aoExcluir }) => (
  <Table dataSource={dados} rowKey="id">
    <Column title="ID" dataIndex="id" key="id" />
    <Column title="Nome" dataIndex="name" key="name" />
    <Column title="Quantidade" dataIndex="quantity" key="quantity" />
    <Column title="Localização" dataIndex="location" key="location" />
    <Column
      title="Ações"
      key="acoes"
      render={(_, produto) => (
        <Space size="middle">
          <Button onClick={() => aoEditar(produto)}>Editar</Button>
          <Button danger onClick={() => aoExcluir(produto.id)}>Excluir</Button>
        </Space>
      )}
    />
  </Table>
);

export default TabelaProdutos;
