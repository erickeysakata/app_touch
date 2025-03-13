const express = require('express');
const { createEmpresa, readEmpresas, updateEmpresa, deleteEmpresa, loginEmpresa } = require('../controllers/ControllerEmpresa');

const router = express.Router();

// Rota para listar todas as empresas
router.get('/empresas', (req, res) => {
    readEmpresas((err, empresas) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).json(empresas);
        }
    });
});

// Rota para criar uma nova empresa
router.post('/empresas', (req, res) => {
    const { cnpj,senha} = req.body;
    createEmpresa(cnpj,senha, (err, empresa) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(201).send(`Empresa criada com sucesso. ID: ${empresa.id}`);
        }
    });
});

// Rota para atualizar uma empresa
router.put('/empresas/:id', (req, res) => {
    const { cnpj, senha } = req.body;
    updateEmpresa(req.params.id, cnpj,senha, (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Empresa atualizada com sucesso');
        }
    });
});

// Rota para deletar uma empresa
router.delete('/empresas/:id', (req, res) => {
    deleteEmpresa(req.params.id, (err) => {
        if (err) {
            res.status(500).send(err.message);
        } else {
            res.status(200).send('Empresa deletada com sucesso');
        }
    });
});

// Rota para logar uma empresa
router.post('/empresas/login', (req, res) => {
    const { cnpj, senha } = req.body;
    loginEmpresa(cnpj, senha, (err, empresa) => {
        if (err) {
            res.status(500).send(err.message);
        } else if (empresa) {
            res.status(200).json(empresa);
        } else {
            res.status(401).send('CNPJ ou senha inválidos');
        }
    });
});

module.exports = router;
