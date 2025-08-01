import React, { useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Input, Label } from '@windmill/react-ui';

function NotaFiscal() {
  const [companyId, setCompanyId] = useState('');
  const [companyKey, setCompanyKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [cliente, setCliente] = useState({
    RUC: '',
    Razao_Social: '',
    Direção: '',
    NumeroCasa: '',
    Departamento: '',
    Distrito: '',
    Cidade: '',
    CidadeDescrição: '',
    Pais: '',
    Celular: '',
    Email: ''
  });
  const [itens, setItens] = useState([]);
  const [novoItem, setNovoItem] = useState({ 
    Codigo: '',
    Descrição: '',
    NCM: '',
    Quantidade: 1,
    PreçoUnitario: 0,
    Pais: '',
    PaisDescrição: '',
    ivaTipo: '',
    ivaBase: '',
    iva: ''
  });

  const handleGenerate = async () => {
    if (!companyId || !companyKey) {
      alert('Por favor, insira o ID da empresa e a chave da empresa.');
      return;
    }

    const requestBody = {
      name: 'Nova Nota Fiscal',
      data: {
        cliente,
        items: itens
      }
    };

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/receipt/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company': companyId,
          'x-api-key': companyKey
        },
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) throw new Error('Erro ao gerar a nota fiscal.');
      alert('Nota fiscal gerada com sucesso!');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const adicionarItem = () => {
    setItens([...itens, novoItem]);
    setNovoItem({ Codigo: '', Descrição: '', NCM: '', Quantidade: 1, PreçoUnitario: 0, Pais: '', PaisDescrição: '', ivaTipo: '', ivaBase: '', iva: '' });
  };

  const removerItem = (index) => {
    const confirmDelete = window.confirm("Tem certeza que deseja remover este item?");
    if (confirmDelete) {
      setItens(itens.filter((_, i) => i !== index));
    }
  };

  return (
    <>
      <PageTitle>Gerenciar Notas Fiscais</PageTitle>
      <div className="light-gray-box">
        <Label>
          <span>ID da Empresa</span>
          <Input type="text" value={companyId} onChange={(e) => setCompanyId(e.target.value)} placeholder="ID da empresa" />
        </Label>
        <Label className="mt-2">
          <span>Chave da Empresa</span>
          <Input type="text" value={companyKey} onChange={(e) => setCompanyKey(e.target.value)} placeholder="Chave da empresa" />
        </Label>
      </div>
      
      <div className="mt-6">
        <h2>Dados do Cliente</h2>
        {Object.keys(cliente).map((key) => (
          <Label key={key} className="mt-2">
            <span>{key}</span>
            <Input type="text" value={cliente[key]} onChange={(e) => setCliente({ ...cliente, [key]: e.target.value })} placeholder={key} />
          </Label>
        ))}
      </div>
      
      <div className="mt-6">
        <h2>Itens da Nota Fiscal</h2>
        {Object.keys(novoItem).map((key) => (
          <Label key={key} className="mt-2">
            <span>{key}</span>
            <Input type="text" value={novoItem[key]} onChange={(e) => setNovoItem({ ...novoItem, [key]: e.target.value })} placeholder={key} />
          </Label>
        ))}
        <Button className="mt-2" onClick={adicionarItem}>Adicionar Item</Button>
      </div>

      <div className="mt-6">
        <h2>Itens Adicionados</h2>
        {itens.map((item, index) => (
          <div key={index} className="mt-2 p-2 border rounded bg-gray-900 text-white">
            {Object.keys(item).map((key) => (
              <p key={key}><strong>{key}:</strong> {item[key]}</p>
            ))} 
            <Button className="mt-2" onClick={() => removerItem(index)}>Remover</Button>
          </div>
        ))}
      </div>
      
      <Button className="mt-4" onClick={handleGenerate} disabled={loading}>
        {loading ? 'Gerando' : 'Gerar Nota Fiscal'}
      </Button>
    </>
  );
}

export default NotaFiscal;
