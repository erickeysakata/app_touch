const express = require('express');
const { createVendas, readVendas, updateVendas, deleteVendas, readVendasDetalhes,updatePagamento, linkClientToSale, 
 } = require('../controllers/ControllerVendas');

const router = express.Router();

// Rota para listar todas as vendas
router.get('/vendas', (req, res) => {
  readVendas((err, vendas) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(vendas);
    }
  });
});



// Rota para criar uma nova venda
router.post('/vendas', (req, res) => {
  const { total } = req.body;


  createVendas(total, (err, vendaId) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).json({id: vendaId});

    }
  });
});

// Rota para atualizar uma venda
router.put('/vendas/:id', (req, res) => {
  const { total } = req.body;
  const { pagamento } = req.body;
  updateVendas(req.params.id, total, pagamento, (err,venda) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send(venda);
    }
  });
});




// Rota para deletar uma venda
router.delete('/vendas/:id', (req, res) => {
  deleteVendas(req.params.id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send('Venda deletada com sucesso');
    }
  });
});


//Rota para listar os detalhes da venda
router.get('/venda_detalhe/:id', (req, res) => {
  readVendasDetalhes(req.params.id, (err, venda) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).json(venda);
    }
  });
});
// Rota para atualizar o pagamento de uma venda
router.put('/vendas/pagamento/:id', (req, res) => {
  const { pagamento } = req.body;
  updatePagamento(req.params.id, pagamento, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send('Pagamento atualizado com sucesso');
    }
  });
});

// Rota para associar um cliente a uma venda
router.put('/vendas/clientes/:id', (req, res) => {
  const { cliente_id } = req.body;
  linkClientToSale(req.params.id, cliente_id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send('Cliente associado à venda com sucesso');
    }
  });
});



module.exports = router;
