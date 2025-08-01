import React, { Component } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  Button,
  Card,
  CardBody,
} from '@windmill/react-ui';  
import ModalPagamento from '../components/ModalPagamento';
import ModalSelecionarCliente from '../components/ModalSelecionarCliente';

class ReportsVendas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      cart: [],
      isPagamentoOpen: false,
      isClienteOpen: false,
      pagamentoSelecionado: '',
    };
  }

  componentDidMount() {
    this.fetchProducts();
  }

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

  addToCart = (product) => {
    this.setState((prevState) => {
      const existingItem = prevState.cart.find((item) => item.id === product.id);
      if (existingItem) {
        return {
          cart: prevState.cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      } else {
        return {
          cart: [...prevState.cart, { ...product, quantity: 1 }],
        };
      }
    });
  };

  removeFromCart = (productId) => {
    this.setState((prevState) => ({
      cart: prevState.cart.filter((item) => item.id !== productId),
    }));
  };

  updateQuantity = (productId, delta) => {
    this.setState((prevState) => ({
      cart: prevState.cart.map((item) =>
        item.id === productId ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
      ),
    }));
  };

  getCartTotal = () => {
    return this.state.cart.reduce((sum, item) => sum + item.preco * item.quantity, 0);
  };

  handlePagamentoConfirmado = (formaPagamento) => {
    this.setState({ pagamentoSelecionado: formaPagamento, isClienteOpen: true });
  };

  handleClienteSelecionado = async (clienteInput) => {
    const { cart, pagamentoSelecionado } = this.state;
    const total = this.getCartTotal();
    try {
      // 1. Criar a venda
      const vendaRes = await fetch('http://localhost:3001/vendas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ total }),
      });
  
      if (!vendaRes.ok) throw new Error('Erro ao criar venda');
      const vendaJson = await vendaRes.json();
      let vendaId = vendaJson.id
      if (typeof vendaId === 'object' && vendaId !== null) { // logica para extrair o id e não inserir um objeto em vendaId
        vendaId = Object.values(vendaId)[0]; // extrai o primeiro valor do objeto
      }

      // 2. Atualizar o pagamento
      const pagamentoRes = await fetch(`http://localhost:3001/vendas/pagamento/${vendaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pagamento: pagamentoSelecionado }),
      });
      if (!pagamentoRes.ok) throw new Error('Erro ao atualizar pagamento');
  
      // 3. Verificar se cliente existe
      let clienteExistenteRes = await fetch(`http://localhost:3001/clientes/ruc/${clienteInput.ruc}`);
      let clienteData;
  
      if (clienteExistenteRes.ok) {
        clienteData = await clienteExistenteRes.json();
      }
  
      let clienteId;
      if (clienteData && clienteData.id) {
        clienteId = clienteData.id; // cliente já existe
      } else {
        // cliente não existe, cadastrar
        const novoClienteRes = await fetch('http://localhost:3001/clientes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(clienteInput),
        });
        if (!novoClienteRes.ok) throw new Error('Erro ao cadastrar cliente');
        const novoClienteJson = await novoClienteRes.json();
        clienteId = novoClienteJson.id;
        if (typeof clienteId === 'object' && clienteId !== null) { // logica para extrair o id e não inserir um objeto em vendaId
          clienteId = Object.values(clienteId)[0]; // extrai o primeiro valor do objeto
        }
      }
  
      // 4. Associar cliente à venda
  
      const clienteRes = await fetch(`http://localhost:3001/vendas/clientes/${vendaId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cliente_id: clienteId }),
      });
      if (!clienteRes.ok) throw new Error('Erro ao associar cliente à venda');
  
      // 5. Cadastrar produtos
      for (const item of cart) {
        const produtoRes = await fetch('http://localhost:3001/venda_produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            venda_id: vendaId,
            produto_id: item.id,
            quantidade: item.quantity,
          }),
        });
        if (!produtoRes.ok) throw new Error('Erro ao adicionar produto à venda');
      }
  
      alert('Venda finalizada com sucesso!');
      this.setState({ cart: [], isClienteOpen: false });
  
    } catch (err) {
      alert('Erro ao finalizar venda.');
      console.error(err);
    } 
  };
  
  

  render() {
    const { products, cart, isPagamentoOpen, isClienteOpen } = this.state;

    return (
      <>
        <PageTitle>Venda</PageTitle>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <TableCell>Produto</TableCell>
                    <TableCell>Preço</TableCell>
                    <TableCell>Ação</TableCell>
                  </tr>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.nome}</TableCell>
                      <TableCell>R$ {product.preco.toFixed(2)}</TableCell>
                      <TableCell>
                        <Button size="small" onClick={() => this.addToCart(product)}>Adicionar</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>

          <div>
            <Card>
              <CardBody>
                <h2 className="text-lg font-semibold text-white mb-4">Carrinho</h2>
                {cart.length === 0 ? (
                  <p className="text-sm text-white">Nenhum produto no carrinho.</p>
                ) : (
                  <ul className="space-y-2">
                    {cart.map((item) => (
                      <li key={item.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-white">{item.nome}</p>
                          <p className="text-sm text-white">
                            {item.quantity} x R$ {item.preco.toFixed(2)} = R$ {(item.quantity * item.preco).toFixed(2)}
                          </p>
                          <div className="flex space-x-2 mt-1">
                            <Button size="small" onClick={() => this.updateQuantity(item.id, -1)}>-</Button>
                            <Button size="small" onClick={() => this.updateQuantity(item.id, 1)}>+</Button>
                            <Button size="small" layout="outline" onClick={() => this.removeFromCart(item.id)}>Remover</Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-4 border-t pt-4">
                  <p className="text-sm font-semibold text-white">
                    Total: R$ {this.getCartTotal().toFixed(2)}
                  </p>
                  <Button className="mt-2 w-full" onClick={() => this.setState({ isPagamentoOpen: true })}>
                    Finalizar Pedido
                  </Button>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <ModalPagamento
          isOpen={isPagamentoOpen}
          onClose={() => this.setState({ isPagamentoOpen: false })}
          valorTotal={this.getCartTotal()}
          onConfirm={this.handlePagamentoConfirmado}
        />

        <ModalSelecionarCliente
          isOpen={isClienteOpen}
          onClose={() => this.setState({ isClienteOpen: false })}
          onClienteSelecionado={this.handleClienteSelecionado}
        />
      </>
    );
  }
}

export default ReportsVendas;