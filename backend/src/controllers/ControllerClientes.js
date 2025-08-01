const db = require ('../configDB');


const createCliente = (ruc,nome,email, callback) => {
    const sql = `INSERT INTO CLIENTES (ruc,nome,email) VALUES (?, ?, ?)`;
    db.run(sql, [ruc,nome,email], function (err) {
        callback(err, { id: this.lastID });
    });
}

const readClientes = (callback) => {
    const sql = `SELECT * FROM CLIENTES`;
    db.all(sql, [], (err, rows) => {
        callback(err, rows);
    });
}
const readClientebyRuc = (ruc, callback) => {
    const sql = `SELECT * FROM CLIENTES WHERE ruc = ?`;
    db.get(sql, [ruc], (err, row) => {
        callback(err, row);
    });
}

module.exports = {createCliente, readClientes, readClientebyRuc};