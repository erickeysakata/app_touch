import React, { useState } from 'react';
import { Modal, ModalHeader, ModalBody, Button, Input, Label } from '@windmill/react-ui';

const CustomerFormModal = ({ isOpen, onClose, onRegister }) => {
  const [formData, setFormData] = useState({
    ruc: '',
    razao_social: '',
    numero_casa: '',
    departamento: '',
    distrito: '',
    cidade: '',
    cidade_descricao: '',
    pais: '',
    celular: '',
    email: '',  
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    fetch('http://localhost:3001/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
      .then((data) => {
        onClose();
        setFormData({
          ruc: '',
          razao_social: '',
          numero_casa: '',
          departamento: '',
          distrito: '',
          cidade: '',
          cidade_descricao: '',
          pais: '',
          celular: '',
          email: '',
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="max-h-screen overflow-y-auto">
        <ModalHeader>Cadastrar Cliente</ModalHeader>
        <ModalBody>
        <div className="max-h-screen overflow-y-auto">
            {[
              { label: 'RUC', name: 'ruc' },
              { label: 'Razão Social', name: 'razao_social' },
              { label: 'Número da Casa', name: 'numero_casa' },
              { label: 'Departamento', name: 'departamento' },
              { label: 'Distrito', name: 'distrito' },
              { label: 'Cidade', name: 'cidade' },
              { label: 'Descrição da Cidade', name: 'cidade_descricao' },
              { label: 'País', name: 'pais' },
              { label: 'Celular', name: 'celular' },
              { label: 'Email', name: 'email' },
            ].map((field) => (
              <Label key={field.name}>
                <span>{field.label}</span>
                <Input
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleChange}
                />
              </Label>
            ))}
            <Button block onClick={handleSubmit}>
              Cadastrar Cliente
            </Button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

export default CustomerFormModal;
