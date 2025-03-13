/**
 * ⚠ These are used just to render the Sidebar!
 * You can include any link here, local or external.
 *
 * If you're looking to actual Router routes, go to
 * `routes/index.js`
 */
const routes = [
  /*
  {
    path: '/app/dashboard', // the url
    icon: 'HomeIcon', // the component being exported from icons/index.js
    name: 'Dashboard', // name that appear in Sidebar
  },
  {
    path: '/app/forms',
    icon: 'FormsIcon',
    name: 'Forms',
  },
  {
    path: '/app/cards',
    icon: 'CardsIcon',
    name: 'Cards',
  },
  {
    path: '/app/charts',
    icon: 'ChartsIcon',
    name: 'Charts',
  },
  {
    path: '/app/buttons',
    icon: 'ButtonsIcon',
    name: 'Buttons',
  },
  {
    path: '/app/modals',
    icon: 'ModalsIcon',
    name: 'Modals',
  },
  */
  {
    path: '/app/Produtos',
    icon: 'TablesIcon',
    name: 'Produtos',
  },
  {
    path: '/app/Vendas',
    icon: 'CartIcon',
    name: 'Vendas',
  },
  {
    path: '/app/ReportsProdutos',
    icon: 'SearchIcon',
    name: 'Relatório dos Produtos',
  },
  {
    path: '/app/ReportVendas',
    icon: 'SearchIcon',
    name: 'Relatório de Vendas',
  },
  {
    path: '/app/NotaFiscal',
    icon: 'SearchIcon',
    name: 'Nota Fiscal',
  },
  {
    path: '/app/CadastroEmpresa',
    icon: 'SearchIcon',
    name: 'Cadastro de Empresa',
  }

  /*
  {
    icon: 'PagesIcon',
    name: 'Pages',
    routes: [
      // submenu
      {
        path: '/login',
        name: 'Login',
      },
      {
        path: '/create-account',
        name: 'Create account',
      },
      {
        path: '/forgot-password',
        name: 'Forgot password',
      },
      {
        path: '/app/404',
        name: '404',
      },
      {
        path: '/app/blank',
        name: 'Blank',
      },
    ],
  },
  */
]

export default routes
