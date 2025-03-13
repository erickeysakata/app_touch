const express = require('express');
const { createVendas, readVendas, updateVendas, deleteVendas, readVendasDetalhes, 
 } = require('../controllers/ControllerVendas');
const db = require('../configDB');

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
      res.status(201).send(`Venda criada com sucesso. ID: ${vendaId}`);
    }
  });
});

// Rota para atualizar uma venda
router.put('/vendas/:id', (req, res) => {
  const { total } = req.body;
  updateVendas(req.params.id, total, (err,venda) => {
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

module.exports = router;
