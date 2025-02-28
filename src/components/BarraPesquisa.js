import React from 'react';
import { Input } from 'antd';

const BarraPesquisa = ({ valor, aoMudar }) => (
  <Input
    placeholder="Pesquisar produtos..."
    value={valor}
    onChange={(e) => aoMudar(e.target.value)}
    style={{ marginBottom: 20 }}
  />
);

export default BarraPesquisa;
