import { lazy } from 'react'
import NotaFiscal from '../pages/NF'

// use lazy for better code splitting, a.k.a. load faster
const Dashboard = lazy(() => import('../pages/Dashboard'))
const Forms = lazy(() => import('../pages/Forms'))
const Cards = lazy(() => import('../pages/Cards'))
const Charts = lazy(() => import('../pages/Charts'))
const Buttons = lazy(() => import('../pages/Buttons'))
const Modals = lazy(() => import('../pages/Modals'))
const ProductTables = lazy(() => import('../pages/Produtos'))
const Page404 = lazy(() => import('../pages/404'))
const Blank = lazy(() => import('../pages/Blank'))
const Vendas = lazy(() => import('../pages/Vendas'))
const CompanyTables = lazy(() => import('../pages/CadastroEmpresa'))
const ReportsProdutos = lazy(() => import('../pages/ReportsProdutos'))
const ReportsVendas = lazy(() => import('../pages/ReportsVendas'))
const NF = lazy(() => import('../pages/NF'))

/**
 * ⚠ These are internal routes!
 * They will be rendered inside the app, using the default `containers/Layout`.
 * If you want to add a route to, let's say, a landing page, you should add
 * it to the `App`'s router, exactly like `Login`, `CreateAccount` and other pages
 * are routed.
 *
 * If you're looking for the links rendered in the SidebarContent, go to
 * `routes/sidebar.js`
 */
const routes = [
  {
    path: '/dashboard', // the url
    component: Dashboard, // view rendered
  },
  {
    path: '/CadastroEmpresa',
    component: CompanyTables,
  },
  {
    path: '/forms',
    component: Forms,
  },
  {
    path: '/cards',
    component: Cards,
  },
  {
    path: '/charts',
    component: Charts,
  },
  {
    path: '/buttons',
    component: Buttons,
  },
  {
    path: '/modals',
    component: Modals,
  },
  {
    path: '/Produtos',
    component: ProductTables ,
  },
  {
    path: '/vendas',
    component: Vendas,
  },
  {
    path: '/404',
    component: Page404,
  },
  {
    path: '/reportsprodutos',
    component: ReportsProdutos,
  },
  {
    path:'/reportvendas',
    component: ReportsVendas,
  },
  {
    path: '/blank',
    component: Blank,
  },
  {
    path: '/NotaFiscal',
    component: NotaFiscal,
  }
]

export default routes
