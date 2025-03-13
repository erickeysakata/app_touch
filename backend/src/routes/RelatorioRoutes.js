const express = require('express');
const { getProdutosMaisVendidos, getTotalVendas } = require('../controllers/ControllerRelatorio');
const router = express.Router();

router.get('/relatorio/produtos_mais_vendidos', (req, res) => {
    getProdutosMaisVendidos((err, rows) => { 
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(rows); 
        }
    });
});

router.get('/relatorio/total_vendas', (req, res) => {
    getTotalVendas((err, row) => { 
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.status(200).json(row); 
        }
    });
});

module.exports = router;
