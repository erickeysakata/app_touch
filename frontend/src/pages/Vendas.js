import React, { Component } from 'react';
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
import { TrashIcon } from '../icons';

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
    };
  }

  componentDidMount() {
    this.fetchSales();
    this.fetchProducts();
  }

  // Buscar lista de vendas
  fetchSales = async () => {
    try {
      const response = await fetch('http://localhost:3001/vendas');
      if (!response.ok) throw new Error('Erro ao buscar vendas.');
      const data = await response.json();
      console.log('Vendas carregadas:', data);
      this.setState({ sales: data });
    } catch (error) {
      console.error(error.message);
    }
  };

  // Buscar lista de produtos
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

  // Criar uma nova venda
  createSale = async () => {
    try {
      const response = await fetch('http://localhost:3001/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: 0.0 }),
      });

      if (!response.ok) throw new Error('Erro ao criar a venda.');

      this.fetchSales();
    } catch (error) {
      console.error(error.message);
    }
  };

  // Buscar detalhes de uma venda específica
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

  // Adicionar produto à venda e atualizar total
  addProductToSale = async () => {
    const { selectedSale, selectedProductId, quantity, products, salesTotal } = this.state;
    if (!selectedProductId || quantity <= 0) {
      return;
    }

    const selectedProduct = products.find((p) => p.id === parseInt(selectedProductId));
    if (!selectedProduct) {
      alert('Produto inválido.');
      return;
    }


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
      await this.fetchSaleDetails(selectedSale);
      await this.fetchSales();

      const total = selectedProduct.preco * quantity + salesTotal;


      if (!response.ok) throw new Error('Erro ao adicionar produto à venda.');

      await fetch(`http://localhost:3001/vendas/${selectedSale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          total: total,
        }),
      });
      this.setState({ salesTotal: total });

      await this.fetchSaleDetails(selectedSale);
      await this.fetchSales();
      this.setState({ selectedProductId: '', quantity: 1 });

      await this.fetchSaleDetails(selectedSale);
    } catch (error) {
      console.error(error.message);
    }
  };

  // Excluir uma venda
  deleteSale = async (saleId) => {
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
  };


  
  deleteProductFromSale = async (vendaProdutoId) => {
    const { selectedSale, saleDetails, salesTotal } = this.state;
  
    // Encontrar o produto que será deletado
    const deletedItem = saleDetails.find(item => item.venda_produto_id === vendaProdutoId);
    if (!deletedItem) return;
  
    const subtotal = deletedItem.preco * deletedItem.quantidade; // Calcular subtotal do produto deletado
  
    try {
      // Deletar o produto da venda
      const response = await fetch(`http://localhost:3001/venda_produtos/${vendaProdutoId}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) throw new Error('Erro ao deletar produto da venda.');
  
      // Atualizar o total da venda subtraindo o subtotal do item deletado
      await this.fetchSaleDetails(selectedSale);
      await this.fetchSales();
      const updatedTotal = salesTotal - subtotal;
  
      await fetch(`http://localhost:3001/vendas/${selectedSale}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total: updatedTotal }),
      });
  
      // Atualizar detalhes da venda e a lista de vendas
      await this.fetchSaleDetails(selectedSale);
      await this.fetchSales();
  
      // Atualizar o estado com o novo total
      this.setState({ salesTotal: updatedTotal });
    } catch (error) {
      console.error(error.message);
    }
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  render() {
    const { sales, selectedSale, saleDetails, products, selectedProductId, quantity, currentPage, resultsPerPage } =
      this.state;

    const paginatedSales = sales.slice((currentPage - 1) * resultsPerPage, currentPage * resultsPerPage);

    return (
      <>
        <PageTitle>Vendas</PageTitle>

        {!selectedSale ? (
          <>
            <SectionTitle>Selecione uma venda</SectionTitle>

            <Button className="mb-4" onClick={this.createSale}>
              Criar Nova Venda
            </Button>

            <TableContainer className="mb-8">
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>ID da Venda</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Horario</TableCell>
                    <TableCell>Ações</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {paginatedSales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>{sale.id}</TableCell>
                      <TableCell>R$ {sale.total.toFixed(2)}</TableCell>
                      <TableCell>{sale.data_hora}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => {
                            this.setState({ selectedSale: sale.id, salesTotal: sale.total });
                            this.fetchSaleDetails(sale.id);
                          }}
                        >
                          Ver Detalhes
                        </Button>
                        <Button className="ml-2" onClick={() => this.deleteSale(sale.id)}>
                          Excluir
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Pagination totalResults={sales.length} resultsPerPage={resultsPerPage} onChange={this.handlePageChange} />
            </TableContainer>
          </>
        ) : (
          <>
            <SectionTitle>Detalhes da Venda #{selectedSale}</SectionTitle>
            <Button className="mb-4" onClick={() => this.setState({ selectedSale: null })}>
              ← Voltar para lista de vendas
            </Button>

            <div className="flex space-x-4 mb-4">
              <Select value={selectedProductId} onChange={(e) => this.setState({ selectedProductId: e.target.value })}>
                <option value="">Selecione um Produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.nome}
                  </option>
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
                    <TableRow key={item.produto_id}>
                      <TableCell>{item.nome}</TableCell>
                      <TableCell>{item.quantidade}</TableCell>
                      <TableCell>R$ {(item.preco * item.quantidade).toFixed(2)}</TableCell>
                      <TableCell>
                        <Button
                          layout="link"
                          size="icon"
                          onClick={() => this.deleteProductFromSale(item.venda_produto_id)}
                        >
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
      </>
    );
  }
}

export default SalesTables;
