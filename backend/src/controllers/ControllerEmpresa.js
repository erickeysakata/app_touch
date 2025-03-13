const db = require('../configDB');

// Função para criar uma nova empresa
const createEmpresa = (cnpj,senha, callback) => {
    const sql = `INSERT INTO EMPRESA (CNPJ,senha) VALUES (?, ?)`;
    db.run(sql, [cnpj,senha], function (err) {
        callback(err, { id: this.lastID });
    });
};

// Função para ler todas as empresas
const readEmpresas = (callback) => {
    const sql = `SELECT * FROM EMPRESA`;
    db.all(sql, [], callback);
};

// Função para atualizar os dados de uma empresa
const updateEmpresa = (cnpj,senha, callback) => {
    const sql = `UPDATE EMPRESA SET CNPJ = ?,senha = ? WHERE id = ?`;
    db.run(sql, [cnpj,senha, id], callback);
};

// Função para deletar uma empresa
const deleteEmpresa = (id, callback) => {
    const sql = `DELETE FROM EMPRESA WHERE id = ?`;
    db.run(sql, id, callback);
};

// Função para logar uma empresa
const loginEmpresa = (cnpj,senha, callback) => {
    const sql = `SELECT * FROM EMPRESA WHERE CNPJ = ? AND senha = ?`;
    db.get(sql, [cnpj,senha], callback);
};



module.exports = { createEmpresa, readEmpresas, updateEmpresa, deleteEmpresa, loginEmpresa };
