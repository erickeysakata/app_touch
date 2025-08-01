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
} from '@windmill/react-ui';

class Reports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsReport: [],

    };
  }

  componentDidMount() {
    this.fetchProductsReport();
  }

  // Buscar relatório de produtos vendidos
  fetchProductsReport = async () => {
    try {
      const response = await fetch('http://localhost:3001/relatorio/produtos_mais_vendidos');
      if (!response.ok) throw new Error('Erro ao buscar relatório de produtos.');
      const data = await response.json();
      this.setState({ productsReport: data });
    } catch (error) {
      console.error(error.message);
    }
  };


  render() {
    const { productsReport} = this.state;

    return (
      <>
        <PageTitle>Relatórios</PageTitle>
   

        {/* Relatório de Produtos Vendidos */}
        <SectionTitle>Produtos Vendidos</SectionTitle>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Produto</TableCell>
                <TableCell>Quantidade Vendida</TableCell>
                <TableCell>Faturamento</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {productsReport.map((product) => (
                <TableRow key={product.produto_id}>
                  <TableCell>{product.nome}</TableCell>
                  <TableCell>{product.total}</TableCell>
                  <TableCell>R${(product.total*product.preco).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
}

export default Reports;
