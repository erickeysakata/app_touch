import React, { useEffect, useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Input, Label } from '@windmill/react-ui';

function CadastroEmpresa() {
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
    email: ''
  });
  const [loading, setLoading] = useState(false);



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/clientes/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erro ao cadastrar empresa.');
      alert('Empresa cadastrada com sucesso!');
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
        email: ''
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle>Cadastro de Cliente</PageTitle>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Label>
          <span>RUC</span>
          <Input name="ruc" value={formData.ruc} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Razao Social</span>
          <Input name="razao_social" value={formData.razao_social} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Numero da Casa</span>
          <Input name="numero_casa" value={formData.numero_casa} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Departamento</span>
          <Input name="departamento" value={formData.departamento} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Distrito</span>
          <Input name="distrito" value={formData.distrito} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Cidade</span>
          <Input name="cidade" value={formData.cidade} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Cidade Descrição</span>
          <Input name="cidade_descricao" value={formData.cidade_descricao} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Pais</span>
          <Input name="pais" value={formData.pais} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Celular</span>
          <Input name="celular" value={formData.celular} onChange={handleChange} required />
        </Label>
        <Label>
          <span>E-Mail</span>
          <Input name="email" value={formData.email} onChange={handleChange} required />
        </Label>
        <Button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar Cliente'}</Button>
      </form>
    </>
  );
}

export default CadastroEmpresa;