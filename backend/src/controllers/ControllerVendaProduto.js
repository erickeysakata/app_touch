const db = require('../configDB');

//função para criar uma nova venda produto
const createVendaProduto = (venda_id, produto_id, quantidade, callback) => {
    const sql = `INSERT INTO VENDA_PRODUTO (venda_id, produto_id, quantidade) VALUES (?, ?, ?)`;
    db.run(sql, [venda_id, produto_id, quantidade], function (err) {
        callback(err, { id: this.lastID });
    });
};

const deleteVendaProduto = (id, callback) => {
    const sql = `DELETE FROM VENDA_PRODUTO WHERE id = ?`;
    db.run(sql, id, callback);
}




module.exports = { createVendaProduto, deleteVendaProduto };