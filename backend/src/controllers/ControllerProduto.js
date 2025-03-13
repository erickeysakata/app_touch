const db = require ('../configDB');

const createProdutos = (nome, preco, estoque,callback) => {
    const sql = `INSERT INTO PRODUTOS (nome, preco, estoque) VALUES (?, ?, ?)`
    db.run (sql, [nome, preco, estoque], function(err){
        callback(err, {id: this.lastID});
    })
}
const readProdutos = (callback) => {
    const sql = `select * from produtos`;
    db.all(sql,[],callback)
}
const updateProdutos = (id, nome, preco, estoque, callback) => {
    const sql= `UPDATE PRODUTOS SET nome = ?, preco = ?, estoque = ? WHERE id = ?`;
    db.run(sql, [nome, preco, estoque, id], callback)
}
const deleteProdutos = (id, callback) => {
    const sql = `DELETE FROM PRODUTOS WHERE id = ?`;
    db.run(sql, id, callback)
}
module.exports = {createProdutos, readProdutos, updateProdutos, deleteProdutos}