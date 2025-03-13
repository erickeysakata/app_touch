const express = require('express');
const { createVendaProduto, deleteVendaProduto } = require('../controllers/ControllerVendaProduto');

const router = express.Router();

// Rota para criar uma nova venda produto
router.post('/venda_produtos', (req, res) => {
  const { venda_id, produto_id, quantidade } = req.body;

  createVendaProduto(venda_id, produto_id, quantidade, (err, vendaProdutoId) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(201).send(`Venda produto criada com sucesso. ID: ${vendaProdutoId}`);
    }
  });
});

router.delete('/venda_produtos/:id', (req, res) => {


  deleteVendaProduto(req.params.id, (err) => {
    if (err) {
      res.status(500).send(err.message);
    } else {
      res.status(200).send('Venda produto deletada com sucesso');
    }
  });
});

module.exports = router;