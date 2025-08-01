const express = require('express');
const { createCliente,readClientes, readClientebyRuc} = require('../controllers/ControllerClientes');
const router = express.Router();

router.post('/clientes', (req, res) => {
    const {ruc,nome,email} = req.body;
    createCliente(ruc,nome,email,  (err, clientes) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).json(clientes);
        }
    })
}  );
// Rota para listar todos os clientes
router.get('/clientes', (req, res) => {
    readClientes((err, clientes) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).json(clientes);
        }
    });
});
// Rota para buscar cliente por RUC
router.get('/clientes/ruc/:ruc', (req, res) => {
    const { ruc } = req.params;
    readClientebyRuc(ruc, (err, cliente) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (!cliente) {
            res.status(404).send('Cliente não encontrado');
        } else {
            res.status(200).json(cliente);
        }
    });
});

module.exports = router;