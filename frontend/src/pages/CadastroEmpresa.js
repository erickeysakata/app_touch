import React, { useState } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import { Button, Input, Label } from '@windmill/react-ui';

function CadastroEmpresa() {
  const [formData, setFormData] = useState({
    name: '',
    ruc: '',
    fantasyName: '',
    document: '',
    startNumber: '',
    timbrateDate: '',
    timbrateNumber: '',
    idCsc: '',
    csc: '',
    address: {
      street_name: '',
      city: '',
      street_number: '',
      state: '',
      zipcode: '',
      neighborhood: ''
    }
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const addressField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [addressField]: value }
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('http://localhost:3000/companies/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Erro ao cadastrar empresa.');
      alert('Empresa cadastrada com sucesso!');
      setFormData({
        name: '',
        ruc: '',
        fantasyName: '',
        document: '',
        startNumber: '',
        timbrateDate: '',
        timbrateNumber: '',
        idCsc: '',
        csc: '',
        address: {
          street_name: '',
          city: '',
          street_number: '',
          state: '',
          zipcode: '',
          neighborhood: ''
        }
      });
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageTitle>Cadastro de Empresa</PageTitle>
      <form onSubmit={handleSubmit} className="space-y-4">
      <Label>
          <span>RUC</span>
          <Input name="name" value={formData.ruc} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Nome da Empresa</span>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Nome Fantasia</span>
          <Input name="fantasyName" value={formData.fantasyName} onChange={handleChange} required />
        </Label>
        <Label>
          <span>CNPJ</span>
          <Input name="document" value={formData.document} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Número Inicial</span>
          <Input name="startNumber" value={formData.startNumber} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Data do Timbrado</span>
          <Input name="timbrateDate" type="date" value={formData.timbrateDate} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Número do Timbrado</span>
          <Input name="timbrateNumber" value={formData.timbrateNumber} onChange={handleChange} required />
        </Label>
        <Label>
          <span>ID CSC</span>
          <Input name="idCsc" value={formData.idCsc} onChange={handleChange} required />
        </Label>
        <Label>
          <span>CSC</span>
          <Input name="csc" value={formData.csc} onChange={handleChange} required />
        </Label>
        <PageTitle>Endereço</PageTitle>
        <Label>
          <span>Rua</span>
          <Input name="address.street_name" value={formData.address.street_name} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Número</span>
          <Input name="address.street_number" value={formData.address.street_number} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Bairro</span>
          <Input name="address.neighborhood" value={formData.address.neighborhood} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Cidade</span>
          <Input name="address.city" value={formData.address.city} onChange={handleChange} required />
        </Label>
        <Label>
          <span>Estado</span>
          <Input name="address.state" value={formData.address.state} onChange={handleChange} required />
        </Label>
        <Button type="submit" disabled={loading}>{loading ? 'Cadastrando...' : 'Cadastrar Empresa'}</Button>
      </form>
    </>
  );
}

export default CadastroEmpresa;