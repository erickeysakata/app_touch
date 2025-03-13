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
  Card,
  CardBody,
} from '@windmill/react-ui';

class ReportsVendas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsReport: [],
      salesReport:{
        totalSales: 0,
        totalRevenue: 0.00,
      },
      sales: [],
    };
  }

  componentDidMount() {
    this.fetchSalesReport();
    this.fetchSales();
  }


  // Buscar resumo de vendas
  fetchSalesReport = async () => {
    try {
      const response = await fetch('http://localhost:3001/relatorio/total_vendas');
      if (!response.ok) throw new Error('Erro ao buscar resumo de vendas.');
      const data = await response.json();
      this.setState({ salesReport: data });

    } catch (error) {
      console.error(error.message);
    }

  };
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

  render() {
    const { salesReport,sales } = this.state;

    return (
      <>
        <PageTitle>Relatório das Vendas</PageTitle>
            <Card className="mb-8">
              <CardBody>
                <SectionTitle>Total das Vendas</SectionTitle>
                <p className="text-gray-400">Total de Vendas: {salesReport.num_vendas}</p>
                <p className="text-gray-400">Receita Total: R${Number(salesReport.total).toFixed(2)}</p>

              </CardBody>
            </Card>

            {/* Resumo de Vendas */}
        <SectionTitle>Vendas</SectionTitle>
        <TableContainer>
          <Table>
            <TableHeader>
              <tr>
                <TableCell>ID da Venda</TableCell>
                <TableCell>Total da Venda</TableCell>
                <TableCell>Horario da Venda</TableCell>
              </tr>
            </TableHeader>
            <TableBody>
              {sales.map((sales) => (
                <TableRow key={sales.id}>
                  <TableCell>{sales.id}</TableCell>
                  <TableCell>R${sales.total.toFixed(2)}</TableCell>
                  <TableCell>{sales.data_hora}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>




        
      </>
    );
  }
}

export default ReportsVendas;
