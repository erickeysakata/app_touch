import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  Input,
} from '@windmill/react-ui';

const ModalSelecionarCliente = ({ isOpen, onClose, onClienteSelecionado }) => {
  const [ruc, setRuc] = useState('');
  const [cliente, setCliente] = useState(null);
  const [novoCliente, setNovoCliente] = useState(false);
  const [formData, setFormData] = useState({ nome: '', email: '' });

  const handlePesquisar = async () => {
    try {
      const res = await fetch(`http://localhost:3001/clientes/ruc/${ruc}`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCliente(data);
      setNovoCliente(false);
    } catch {
      setCliente(null);
      setNovoCliente(true);
    }
  };

  const handleConfirmar = () => {
    if (novoCliente && (!formData.nome || !formData.email)) {
      alert('Preencha os campos para cadastrar o cliente.');
      return;
    }

    const clienteFinal = novoCliente ? { ruc, ...formData } : cliente;
    onClienteSelecionado(clienteFinal);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Selecionar Cliente</ModalHeader>
      <ModalBody>
        <Label>
          <span>RUC</span>
          <Input value={ruc} onChange={(e) => setRuc(e.target.value)} />
        </Label>
        <Button className="mt-2" onClick={handlePesquisar}>Pesquisar</Button>

        {cliente && (
          <div className="mt-4 space-y-2">
            <p><strong>Razão Social:</strong> {cliente.nome}</p>
            <p><strong>Email:</strong> {cliente.email}</p>
          </div>
        )}

        {novoCliente && (
          <div className="mt-4 space-y-2">
            <Label>
              <span>Nome</span>
              <Input
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </Label>
            <Label>
              <span>Email</span>
              <Input
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </Label>
          </div>
        )}
      </ModalBody>
      <ModalFooter>
        <Button layout="outline" onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirmar}>Confirmar Cliente</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalSelecionarCliente;
