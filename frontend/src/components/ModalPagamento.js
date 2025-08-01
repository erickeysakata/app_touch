
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

const ModalPagamento = ({ isOpen, onClose, valorTotal, onConfirm }) => {
  const [formaPagamento, setFormaPagamento] = useState('');

  const formasDePagamento = [
    ' Dinheiro ',
    ' Crédito ',
    ' Débito ',
    ' Pix ',
  ];

  const handleConfirmar = () => {
    if (formaPagamento) {
      onConfirm(formaPagamento);
      onClose();
    } else {
      alert('Selecione uma forma de pagamento.');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader>Selecionar Forma de Pagamento</ModalHeader>
      <ModalBody>
        <div className="space-y-2">
          {formasDePagamento.map((forma, idx) => (
            <Label key={idx} check>
              <Input type= "checkbox"
                name="pagamento"
                value={forma}
                checked={formaPagamento === forma}
                onChange={() => setFormaPagamento(forma)}
              />
              <span className="ml-2 ">{forma}</span>
            </Label>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-100 rounded text-center">
          <p className="text-sm text-gray-600">Valor Total da Compra</p>
          <p className="text-xl font-bold text-gray-800">
            R$ {valorTotal.toFixed(2)}
          </p>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button layout="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleConfirmar}>Confirmar Pagamento</Button>
      </ModalFooter>
    </Modal>
  );
};

export default ModalPagamento;
