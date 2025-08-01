const db = require('../configDB');



//função para criar uma nova venda
const createVendas = (total, callback) => {
    const sql = `INSERT INTO VENDAS (total) VALUES (?)`;
    db.run(sql, [total], function (err) {
        callback(err, { id: this.lastID});
    });
};
const linkClientToSale = (venda_id, cliente_id, callback) => {
    const sql = `UPDATE VENDAS SET clientes_id = ? WHERE id = ?`;
    db.run(sql, [cliente_id, venda_id], function (err) {
        callback(err);
    });
}




//função para ler todas as vendas associando tambem com a tabela venda produto
const readVendas = (callback) => {
    const sql = `SELECT * FROM VENDAS`;
    db.all(sql, [], callback);
    
};

const readVendasDetalhes = (venda_id, callback) => {
    db.all(
        `SELECT 
            P.id AS produto_id, P.nome, P.preco, VP.quantidade, VP.id AS venda_produto_id 
         FROM VENDA_PRODUTO VP
         JOIN PRODUTOS P ON VP.produto_id = P.id
         WHERE VP.venda_id = ?`,
        [venda_id],
        (err, produtos) => {
            if (err) {
                return callback(err);
            }
            callback(null, produtos);
        }
    );
}








const updateVendas = (id, total, pagamento, callback) => {
    const sql= `UPDATE VENDAS SET total = ?, pagamento = ? WHERE id = ?`;
    db.run(sql, [total,pagamento, id], callback)
}

//função para alterar o metodo de pagamento
const updatePagamento = (id, pagamento, callback) => {
    const sql= `UPDATE VENDAS SET pagamento = ? WHERE id = ?`;
    db.run(sql, [pagamento, id], callback)
}
const deleteVendas = (id, callback) => {
    const sql = `DELETE FROM VENDAS WHERE id = ?`;
    db.run(sql, id, callback)
}
module.exports = {createVendas, readVendas, updateVendas, deleteVendas, readVendasDetalhes,updatePagamento, linkClientToSale};