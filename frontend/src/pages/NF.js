import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Input, Label, Table, TableHeader, TableCell, TableRow, TableBody, TableContainer } from '@windmill/react-ui';

function NotaFiscal() {
  const [companyId, setCompanyId] = useState('');
  const [companyKey, setCompanyKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [notas, setNotas] = useState([]);
  const [notaId, setNotaId] = useState('');
  const [notaDetalhe, setNotaDetalhe] = useState(null);

  const handleGenerate = async () => {
    if (!companyId || !companyKey) {
      alert('Por favor, insira o ID da empresa e a chave da empresa.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/receipt/api/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-company': companyId,
          'x-api-key': companyKey
        },
        body: JSON.stringify({ name: 'Nova Nota Fiscal' })
      });
      
      if (!response.ok) throw new Error('Erro ao gerar a nota fiscal.');
      alert('Nota fiscal gerada com sucesso!');
      fetchNotas();
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/receipt`, {
        method: 'GET',
        headers: { 'x-company': companyId }
      });
      
      if (!response.ok) throw new Error('Erro ao obter notas fiscais.');
      const data = await response.json();
      setNotas(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotaById = async () => {
    if (!notaId) {
      alert('Digite o ID da nota fiscal.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/receipt/${notaId}`, {
        method: 'GET',
        headers: { 'x-company': companyId }
      });
      
      if (!response.ok) throw new Error('Nota fiscal não encontrada.');
      const data = await response.json();
      setNotaDetalhe(data);
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (companyId) fetchNotas();
  }, [companyId]);

  return (
    <>
      <PageTitle>Gerenciar Notas Fiscais</PageTitle>
      <div className="light-gray-box">
        <Label>
          <span>ID da Empresa</span>
          <Input 
            type="text" 
            value={companyId} 
            onChange={(e) => setCompanyId(e.target.value)} 
            placeholder="ID da empresa" 
          />
        </Label>
        <Label className="mt-2">
          <span>Chave da Empresa</span>
          <Input 
            type="text" 
            value={companyKey} 
            onChange={(e) => setCompanyKey(e.target.value)} 
            placeholder="Chave da empresa" 
          />
        </Label>
        <Button className="mt-4" onClick={handleGenerate} disabled={loading}>
          {loading ? 'Gerando...' : 'Gerar Nota Fiscal'}
        </Button>
      </div>
      
      <div className="mt-6">  
        <Label>
          <span>Buscar Nota Fiscal por ID</span>
          <Input 
            type="text" 
            value={notaId} 
            onChange={(e) => setNotaId(e.target.value)} 
            placeholder="ID da nota fiscal" 
          />
        </Label>
        <Button className="mt-2" onClick={fetchNotaById} disabled={loading}>
          {loading ? 'Buscando...' : 'Buscar Nota Fiscal'}
        </Button>
      </div>
      
      {notaDetalhe && (
        <div className="mt-6 p-4 border rounded">
          <h2>Detalhes da Nota Fiscal</h2>
          <p><strong>ID:</strong> {notaDetalhe._id}</p>
          <p><strong>Descrição:</strong> {notaDetalhe.descrição}</p>
          <p><strong>Criado em:</strong> {notaDetalhe.data}</p>
        </div>
      )}
      
      <TableContainer className="mt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Descrição</TableCell>
              <TableCell>Data de Criação</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {notas.map((nota) => (
              <TableRow key={nota._id}>
                <TableCell>{nota._id}</TableCell>
                <TableCell>{nota.descrição}</TableCell>
                <TableCell>{nota.data}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
} 

export default NotaFiscal;