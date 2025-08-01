const express = require('express');
const { createProdutos, readProdutos, updateProdutos, deleteProdutos } = require('../controllers/ControllerProduto');

const router = express.Router();

router.get('/produtos', (req,res) => {
    readProdutos((err, produtos) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).json(produtos);
        }
    });
} )

router.post('/produtos', (req, res) => {
    const {nome, preco} = req.body;
    createProdutos(nome, preco, (err, produto) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).send(`Produto inserido com sucesso. ID: ${produto.id}`);
        }
    })
})

router.put('/produtos/:id', (req, res) => {
    const {nome, preco} = req.body;
    updateProdutos(req.params.id, nome, preco,(err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Produto atualizado com sucesso');
        }
    })
}
)

router.delete('/produtos/:id', (req, res) => {
    deleteProdutos(req.params.id, (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Produto deletado com sucesso');
        }
    } )
})

module.exports = router;