const db = require('../configDB');

const getTotalVendas = (callback) => {
    const sql = `SELECT COUNT(id) as num_vendas, SUM(total) as total  FROM VENDAS`;
    db.get(sql, [], (err, row) => { 
        if (err) return callback(err, null);
        callback(null, row);
    });
}

const getProdutosMaisVendidos = (callback) => {
    const sql = `SELECT P.id, P.nome,P.preco, SUM(VP.quantidade) as total, P.estoque FROM VENDA_PRODUTO VP
    JOIN PRODUTOS P ON VP.produto_id = P.id
    GROUP BY P.id
    ORDER BY total DESC`;

    db.all(sql, [], (err, rows) => { 
        if (err) return callback(err, null);
        callback(null, rows);
    });
}

module.exports = { getTotalVendas, getProdutosMaisVendidos };
