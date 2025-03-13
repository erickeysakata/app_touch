import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'; // To redirect users
import ImageLight from '../assets/img/create-account-office.jpeg';
import ImageDark from '../assets/img/create-account-office-dark.jpeg';
import { Input, Label, Button } from '@windmill/react-ui';

class RegisterCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cnpj: '',
      password: '',
      confirmPassword: '',
      error: '',
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRegister = this.handleRegister.bind(this);
  }

  handleInputChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value });
  }

  handleRegister(event) {
    event.preventDefault();

    const { cnpj, password, confirmPassword } = this.state;

    // Validation
    if (!cnpj || !password || !confirmPassword) {
      this.setState({ error: 'All fields are required.' });
      return;
    }

    if (password !== confirmPassword) {
      this.setState({ error: 'Passwords do not match.' });
      return;
    }

    // API request
    fetch('http://localhost:3001/empresas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ cnpj, senha: password }),
    })
      .then((response) => {
        if (response.ok) {
          this.props.history.push('/login'); // Redirect to login on success
        } else {
          return response.json().then((data) => {
            this.setState({ error: data.message || 'Failed to register company.' });
          });
        }
      })
      .catch(() => {
        this.setState({ error: 'An error occurred. Please try again.' });
      });
  }

  render() {
    const { cnpj, password, confirmPassword, error } = this.state;

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
              <form onSubmit={this.handleRegister} className="w-full">
                <h1 className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200">
                  Registrar Empresa
                </h1>

                {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

                <Label>
                  <span>CNPJ</span>
                  <Input
                    className="mt-1"
                    type="text"
                    name="cnpj"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={this.handleInputChange}
                  />
                </Label>
                <Label className="mt-4">
                  <span>Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    name="password"
                    placeholder="***************"
                    value={password}
                    onChange={this.handleInputChange}
                  />
                </Label>
                <Label className="mt-4">
                  <span>Confirm Password</span>
                  <Input
                    className="mt-1"
                    type="password"
                    name="confirmPassword"
                    placeholder="***************"
                    value={confirmPassword}
                    onChange={this.handleInputChange}
                  />
                </Label>

                <Button type="submit" block className="mt-4">
                  Registrar Empresa
                </Button>

                <p className="mt-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Ja tem uma conta?{' '}
                  </span>
                  <a
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                    href="/login"
                  >
                    Login
                  </a>
                </p>
              </form>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(RegisterCompany);
