import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Button,
  Pagination,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Label,
} from '@windmill/react-ui';
import { EditIcon, TrashIcon } from '../icons';

function ProductTables() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  // Modal estados
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create' ou 'edit'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({ nome: '', preco: ''});

  // Buscar produtos
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/produtos');
      if (!response.ok) throw new Error('Erro ao buscar produtos.');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Criar produto
  const createProduct = async () => {
    try {
      const response = await fetch('http://localhost:3001/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchProducts();
        closeModal();
      } else {
        throw new Error('Erro ao criar produto.');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Atualizar produto
  const updateProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3001/produtos/${selectedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchProducts();
        closeModal();
      } else {
        throw new Error('Erro ao atualizar produto.');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Deletar produto
  const deleteProduct = async () => {
    try {
      const response = await fetch(`http://localhost:3001/produtos/${selectedProduct.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchProducts();
        closeConfirmModal();
      } else {
        throw new Error('Erro ao deletar produto.');
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  // Abrir modal de criação/edição
  const openModal = (type, product = null) => {
    setModalType(type);
    setSelectedProduct(product);
    setFormData(product || { nome: '', preco: ''});
    setIsModalOpen(true);
  };

  // Fechar modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
    setFormData({ nome: '', preco: ''});
  };

  // Abrir modal de confirmação para deletar
  const openConfirmModal = (product) => {
    setSelectedProduct(product);
    setIsConfirmModalOpen(true);
  };

  // Fechar modal de confirmação
  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setSelectedProduct(null);
  };

  // Manipular mudanças no formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Paginação
  const paginatedProducts = products.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  // Carregar produtos na montagem
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <>
      <PageTitle>Produtos</PageTitle>

      <Button className="mb-4" onClick={() => openModal('create')}>
        Registrar Produto
      </Button>

      <SectionTitle>Lista de Produtos</SectionTitle>
      <TableContainer className="mb-8">
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Nome</TableCell>
              <TableCell>Preço</TableCell>
              <TableCell>Ações</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.nome}</TableCell>
                <TableCell>R$ {product.preco.toFixed(2)}</TableCell>
                <TableCell>
                  <div className="flex items-center space-x-4">
                    <Button layout="link" size="icon" onClick={() => openModal('edit', product)}>
                      <EditIcon className="w-5 h-5" aria-hidden="true" />
                    </Button>
                    <Button layout="link" size="icon" onClick={() => openConfirmModal(product)}>
                      <TrashIcon className="w-5 h-5 text-red-600" aria-hidden="true" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={products.length}
            resultsPerPage={resultsPerPage}
            onChange={setCurrentPage}
            label="Navegação de tabela"
          />
        </TableFooter>
      </TableContainer>

      {/* Modal de Criação/Edição */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <ModalHeader>{modalType === 'create' ? 'Adicionar Produto' : 'Editar Produto'}</ModalHeader>
        <ModalBody>
          <Label>
            <span>Nome</span>
            <Input name="nome" value={formData.nome} required onChange={handleChange} />
          </Label>
          <Label className="mt-4">
            <span>Preço</span>
            <Input name="preco"  value={formData.preco} required onChange={handleChange} type="number" step="0.01" />
          </Label>
        </ModalBody>
        <ModalFooter>
          <Button onClick={modalType === 'create' ? createProduct : updateProduct}>
            {modalType === 'create' ? 'Adicionar' : 'Salvar'}
          </Button>
        </ModalFooter>
      </Modal>

      {/* Modal de Confirmação */}
      <Modal isOpen={isConfirmModalOpen} onClose={closeConfirmModal}>
        <ModalHeader>Confirmar Exclusão</ModalHeader>
        <ModalBody>Tem certeza que deseja excluir o produto "{selectedProduct?.nome}"?</ModalBody>
        <ModalFooter>
          <Button layout="outline" onClick={closeConfirmModal}>Cancelar</Button>
          <Button className="bg-red-600 text-white" onClick={deleteProduct}>Excluir</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default ProductTables;
