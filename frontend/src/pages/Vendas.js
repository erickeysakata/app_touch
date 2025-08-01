import React, { Component } from 'react';
import CustomerFormModal from '../components/CadastrarCliente';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Button,
  Pagination,
  Select,
  Input,
} from '@windmill/react-ui';
import { TrashIcon, EditIcon } from '../icons';

class SalesTables extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: [],
      selectedSale: null,
      saleDetails: [],
      products: [],
      selectedProductId: '',
      quantity: 1,
      currentPage: 1,
      resultsPerPage: 10,
      salesTotal: 0.0,
      pagamento: '',
      clients: [],
      selectedClientId: '',
      isCustomerModalOpen: false,
      isContinuingSale: false,
      isSelectingClient: false,
    };
  }

  componentDidMount() {
    this.fetchSales();
    this.fetchProducts();
    this.fetchClients();
  }

  fetchSales = async () => {
    try {
      const response = await fetch('http://localhost:3001/vendas');
      if (!response.ok) throw new Error('Erro ao buscar vendas.');
      const data = await response.json();
      this.setState({ sales: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:3001/produtos');
      if (!response.ok) throw new Error('Erro ao buscar produtos.');
      const data = await response.json();
      this.setState({ products: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchClients = async () => {
    try {
      const response = await fetch('http://localhost:3001/clientes');
      if (!response.ok) throw new Error('Erro ao buscar clientes.');
      const data = await response.json();
      this.setState({ clients: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  openCustomerModal = () => {
    this.setState({ isCustomerModalOpen: true });
  };

  closeCustomerModal = async () => {
    this.setState({ isCustomerModalOpen: false });
    await this.fetchClients(); // Atualiza a lista após novo cadastro
  };

  createSale = async () => {
    try {
      const response = await fetch('http://localhost:3001/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: 0.0 }),
      });

      if (!response.ok) throw new Error('Erro ao criar a venda.');
      const novaVenda = await response.json();
      let id = novaVenda.id;
      if (typeof id === 'object' && id !== null) { // logica para extrait o id e não inserir um objeto em selectedSale
        id = Object.values(id)[0]; // extrai o primeiro valor do objeto
      }
      console.log(id);  
      this.setState({
        selectedSale: id,
      });
      await this.fetchSaleDetails(novaVenda.id);
      await this.fetchSales();
    } catch (error) {
      console.error(error.message);
    }
  };

  fetchSaleDetails = async (saleId) => {
    try {
      const response = await fetch(`http://localhost:3001/venda_detalhe/${saleId}`);
      if (!response.ok) throw new Error('Erro ao buscar detalhes da venda.');
      const data = await response.json();
      this.setState({ saleDetails: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  addProductToSale = async () => {
    const { selectedSale, selectedProductId, quantity, products, salesTotal } = this.state;
    if (!selectedProductId || quantity <= 0) return;
    const selectedProduct = products.find((p) => p.id === parseInt(selectedProductId));
    if (!selectedProduct) return alert('Produto inválido.');
    try {
      const response = await fetch('http://localhost:3001/venda_produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          venda_id: selectedSale,
          produto_id: selectedProduct.id,
          quantidade: quantity,
        }),
      });

      const total = selectedProduct.preco * quantity + salesTotal;

      if (!response.ok) throw new Error('Erro ao adicionar produto à venda.');

      await fetch(`http://localhost:3001/vendas/${selectedSale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: total }),
      });

      this.setState({ salesTotal: total, selectedProductId: '', quantity: 1 });

      await this.fetchSaleDetails(selectedSale);
      await this.fetchSales();
    } catch (error) {
      console.error(error.message);
    }
  };

  deleteSale = async (saleId) => {
    const isConfirmed = window.confirm('Você tem certeza que deseja excluir esta venda?');
    if (isConfirmed) {
      try {
        const response = await fetch(`http://localhost:3001/vendas/${saleId}`, {
          method: 'DELETE',
        });

        if (!response.ok) throw new Error('Erro ao excluir a venda.');

        this.setState({ selectedSale: null, saleDetails: [] });
        await this.fetchSales();
      } catch (error) {
        console.error(error.message);
      }
    }
  };
  continuarVenda = () => {
    this.setState({ isContinuingSale: true });
  };

  adicionarMetodoPagamento = async () => {
    const { selectedSale, pagamento } = this.state;
    if (!pagamento) return alert('Por favor, insira a forma de pagamento.');
    try {
      const response = await fetch(`http://localhost:3001/vendas/pagamento/${selectedSale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagamento }),
      });
      if (!response.ok) throw new Error('Erro ao adicionar método de pagamento.');
      this.setState({ pagamento: '', isSelectingClient: true }); // Avança para próxima etapa
    } catch (error) {
      console.error(error.message);
    }
  };

  salvarClienteNaVenda = async () => {
    const { selectedSale, selectedClientId } = this.state;
    if (!selectedClientId) return alert('Selecione um cliente.');

    try {
      const response = await fetch(`http://localhost:3001/vendas/clientes/${selectedSale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: selectedClientId }),
      });
      if (!response.ok) throw new Error('Erro ao vincular cliente à venda.');
      alert('Cliente vinculado com sucesso!');
      this.setState({ selectedSale: null, saleDetails: [], isSelectingClient: false });
      await this.fetchSales();
    } catch (error) {
      console.error(error.message);
    }
  };
  gerarNota = async () => {
    const { selectedSale, saleDetails, clients, selectedClientId, sales } = this.state;
  
    const venda = sales.find((s) => s.id === selectedSale);
    const cliente = clients.find((c) => c.id === parseInt(selectedClientId));
  
    if (!venda || !cliente || saleDetails.length === 0) {
      alert('Certifique-se de que a venda, cliente e produtos estão corretamente selecionados.');
      return;
    }
  
    const notaData = {
      venda: {
        id: venda.id,
        total: venda.total,
        data_hora: venda.data_hora,
        pagamento: venda.pagamento,
      },
      cliente: {
        id: cliente.id,
        nome: cliente.nome,
        ruc: cliente.ruc,
        endereco: cliente.endereco,
        telefone: cliente.telefone,
      },
      produtos: saleDetails.map((item) => ({
        id: item.produto_id,
        nome: item.nome,
        preco: item.preco,
        quantidade: item.quantidade,
        subtotal: item.preco * item.quantidade,
      })),
    };
  
    try {
      const response = await fetch('http://localhost:3000/receipt/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notaData),
      });
  
      if (!response.ok) throw new Error('Erro ao gerar nota.');
  
      alert('Nota gerada com sucesso!');
    } catch (error) {
      console.error(error.message);
      alert('Erro ao gerar nota. Verifique o console para mais detalhes.');
    }
  };
  

  deleteProductFromSale = (vendaProdutoId) => {
    const isConfirmed = window.confirm('Você tem certeza que deseja excluir este produto da venda?');
    if (isConfirmed) this.confirmDeleteProduct(vendaProdutoId);
  };

  confirmDeleteProduct = async (vendaProdutoId) => {
    const { selectedSale, saleDetails, salesTotal } = this.state;
    const deletedItem = saleDetails.find(item => item.venda_produto_id === vendaProdutoId);
    if (!deletedItem) return;

    const subtotal = deletedItem.preco * deletedItem.quantidade;

    try {
      const response = await fetch(`http://localhost:3001/venda_produtos/${vendaProdutoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao deletar produto da venda.');

      const updatedTotal = salesTotal - subtotal;

      await fetch(`http://localhost:3001/vendas/${selectedSale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: updatedTotal }),
      });

      this.setState({ salesTotal: updatedTotal });

      await this.fetchSaleDetails(selectedSale);
      await this.fetchSales();
    } catch (error) {
      console.error(error.message);
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const {
      sales, selectedSale, saleDetails, products, selectedProductId, quantity,
      currentPage, resultsPerPage, pagamento, isContinuingSale, isSelectingClient,
      clients, selectedClientId, isCustomerModalOpen,
    } = this.state;

    const paginatedSales = sales.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

    return (
      <>
        <PageTitle>Vendas</PageTitle>

        {!selectedSale ? (
          <>
            <SectionTitle>Selecione uma venda</SectionTitle>
            <Button className="mb-4" onClick={this.createSale}>Criar Nova Venda</Button>

            <TableContainer className="mb-8">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>ID da Venda</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Horario</TableCell>
                    <TableCell>Forma de Pagamento</TableCell>
                    <TableCell>Cliente</TableCell>
                    <TableCell>Ações</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {paginatedSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>R$ {sale.total.toFixed(2)}</TableCell>
                      <TableCell>{sale.data_hora}</TableCell>
                      <TableCell>{sale.pagamento}</TableCell>
                      <TableCell>{sale.clientes_id}</TableCell>
                      <TableCell>
                        <Button layout="link" size="icon" onClick={() => {
                          this.setState({ selectedSale: sale.id, isContinuingSale: false, isSelectingClient: false });
                          this.fetchSaleDetails(sale.id);
                        }}>
                          <EditIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button layout="link" size="icon" onClick={() => this.deleteSale(sale.id)}>
                          <TrashIcon className="w-5 h-5 text-red-600" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination totalResults={sales.length} resultsPerPage={resultsPerPage} onChange={this.handlePageChange} />
            </TableContainer>
          </>
        ) : isSelectingClient ? (
          <>
            <SectionTitle>Selecionar Cliente</SectionTitle>
            <div className="flex space-x-4 mb-4">
              <Select value={selectedClientId} onChange={(e) => this.setState({ selectedClientId: e.target.value })}>
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>{client.ruc}</option>
                ))}
              </Select>
              <Button onClick={this.salvarClienteNaVenda}>Vincular Cliente</Button>
              <Button onClick={this.openCustomerModal}>Cadastrar Novo Cliente</Button>
            </div>
            <div className= "flex space-x-4 mb-4">
            <Button onClick={this.gerarNota}>Gerar Nota</Button>


            </div>
          </>
        ) : isContinuingSale ? (
          <>
            <SectionTitle>Adicionar Pagamento</SectionTitle>
            <Button className="mb-4" onClick={() => this.setState({ isContinuingSale: false })}>
              ← Voltar para Detalhes da Venda
            </Button>
            <div className="flex space-x-4 mb-4">
              <Select value={pagamento} onChange={(e) => this.setState({ pagamento: e.target.value })}>
                <option value="">Selecione a forma de pagamento</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="PIX">PIX</option>
                <option value="Transferência Bancária">Transferência Bancária</option>
                <option value="Outro">Outro</option>
              </Select>
              <Button onClick={this.adicionarMetodoPagamento}>Salvar Pagamento</Button>
            </div>
          </>
        ) : (
          <>
            <SectionTitle>Detalhes da Venda</SectionTitle>
            <Button className ="mb-4" onClick={() => this.setState({ selectedSale: null, saleDetails: [] })}>
              ← Voltar para Lista de Vendas 
            </Button>
            <Button className="mb-4" onClick={this.continuarVenda}>
              Continuar Venda (Adicionar Pagamento)
            </Button>
            <div className="flex space-x-4 mb-4">
              <Select value={selectedProductId} onChange={(e) => this.setState({ selectedProductId: e.target.value })}>
                <option value="">Selecione um Produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>{product.nome}</option>
                ))}
              </Select>
              <Input type="number" value={quantity} min="1" onChange={(e) => this.setState({ quantity: parseInt(e.target.value) })} />
              <Button onClick={this.addProductToSale}>Adicionar Produto</Button>
            </div>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>Produto</TableCell>
                    <TableCell>Quantidade</TableCell>
                    <TableCell>Subtotal</TableCell>
                    <TableCell>Ações</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {saleDetails.map((item) => (
                    <TableRow key={item.venda_produto_id}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>R$ {(item.preco * item.quantidade).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button layout="link" size="icon" onClick={() => this.deleteProductFromSale(item.venda_produto_id)}>
                          <TrashIcon className="w-5 h-5 text-red-600" aria-hidden="true" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}

        <CustomerFormModal
          isOpen={isCustomerModalOpen}
          onClose={this.closeCustomerModal}
        />
      </>
    );
  }
}

export default SalesTables;
