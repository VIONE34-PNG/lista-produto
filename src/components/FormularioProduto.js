import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const FormularioProduto = ({ visivel, aoCancelar, valoresIniciais, aoSalvar }) => (
  <Modal
    title={valoresIniciais ? 'Editar Produto' : 'Adicionar Produto'}
    visible={visivel}
    onCancel={aoCancelar}
    footer={null}
  >
    <Form initialValues={valoresIniciais || { name: '', quantity: '', location: '' }} onFinish={aoSalvar}>
      <Form.Item
        label="Nome"
        name="name"
        rules={[{ required: true, message: 'Por favor, insira o nome!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Quantidade"
        name="quantity"
        rules={[{ required: true, message: 'Por favor, insira a quantidade!' }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Localização"
        name="location"
        rules={[{ required: true, message: 'Por favor, insira a localização!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Salvar
        </Button>
      </Form.Item>
    </Form>
  </Modal>
);

export default FormularioProduto;
