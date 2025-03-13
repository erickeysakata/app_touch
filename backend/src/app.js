const express = require('express');
const cors = require('cors');
const app = express();
const produtoRouter = require('./routes/ProdutoRoutes');
const vendasRouter = require('./routes/VendasRoutes');
const empresaRouter = require('./routes/EmpresaRoutes');
const vendasProdutoRouter = require('./routes/VendaProdutoRoutes');
const relatorioRouter = require('./routes/RelatorioRoutes');
app.use(cors());
app.use(express.json());

app.use('/', produtoRouter);
app.use('/', vendasRouter);
app.use('/', empresaRouter);
app.use('/',vendasProdutoRouter );
app.use('/', relatorioRouter);



app.listen(3001, () => {
    console.log('Server está rodando 3001')
})

module.exports = app;