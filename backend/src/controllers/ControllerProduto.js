const db = require ('../configDB');

const createProdutos = (nome, preco,callback) => {
    const sql = `INSERT INTO PRODUTOS (nome, preco) VALUES (?, ?)`
    db.run (sql, [nome, preco], function(err){
        callback(err, {id: this.lastID});
    })
}
const readProdutos = (callback) => {
    const sql = `select * from produtos`;
    db.all(sql,[],callback)
}
const updateProdutos = (id, nome, preco, callback) => {
    const sql= `UPDATE PRODUTOS SET nome = ?, preco = ? WHERE id = ?`;
    db.run(sql, [nome, preco,id], callback)
}
const deleteProdutos = (id, callback) => {
    const sql = `DELETE FROM PRODUTOS WHERE id = ?`;
    db.run(sql, id, callback)
}
module.exports = {createProdutos, readProdutos, updateProdutos, deleteProdutos}