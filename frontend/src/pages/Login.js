import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import ImageLight from '../assets/img/login-office.jpeg';
import ImageDark from '../assets/img/login-office-dark.jpeg';
import { Label, Input, Button } from '@windmill/react-ui';

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      cnpj: '',
      senha: '',
      error: '',
    };
  }

  handleInputChange = (event) => {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    const { cnpj, senha } = this.state;

    axios
      .post('http://localhost:3001/empresas/login', { cnpj,senha })
      .then((response) => {
        if (response.status === 200) {
          
          localStorage.setItem('empresaId', response.data.id);
          this.props.history.push('/app');
        }
      })
      .catch(() => {
        this.setState({ error: 'Login falhou. CNPJ ou senha estão incorretos.'});
      });
  };

  render() {
    const { cnpj, senha, error } = this.state;

    return (
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
        <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full dark:hidden"
                src={ImageLight}
                alt="Office"
              />
              <img
                aria-hidden="true"
                className="hidden object-cover w-full h-full dark:block"
                src={ImageDark}
                alt="Office"
              />
            </div>
            <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              <div className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">Login</h1>

                {error && <p className="mb-4 text-sm text-red-500">{error}</p>}

                <form onSubmit={this.handleSubmit}>
                  <Label>
                    <span>CNPJ</span>
                    <Input
                      className="mt-1"
                      type="text"
                      placeholder="Insira seu CNPJ"
                      name="cnpj"
                      value={cnpj}
                      onChange={this.handleInputChange}
                      required
                    />
                  </Label>

                  <Label className="mt-4">
                    <span>Password</span>
                    <Input
                      className="mt-1"
                      type="password"
                      placeholder="Insira sua senha"
                      name="senha"
                      value={senha}
                      onChange={this.handleInputChange}
                      required
                    />
                  </Label>

                  <Button className="mt-4" block type="submit">
                    Login
                  </Button>
                </form>

                <hr className="my-8" />

                <p className="mt-1">
                  <Link
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    to="/create-account"
                  >
                    Create account
                  </Link>
                </p>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
