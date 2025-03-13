const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    }
    console.log('Connected to the database.');


    // Criação da tabela PRODUTOS
    db.run(
        `CREATE TABLE IF NOT EXISTS PRODUTOS (
        id INTEGER PRIMARY KEY, 
        nome TEXT,
        preco REAL NOT NULL, 
        estoque INTEGER NOT NULL)`, 
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table PRODUTOS created.');
            }
        }
    );

    // Criação da tabela VENDAS
    db.run(
        `CREATE TABLE IF NOT EXISTS VENDAS (
            id INTEGER PRIMARY KEY,
            data_hora TEXT DEFAULT (datetime('now','localtime')),
            total REAL NOT NULL
        )`,
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table VENDAS created.');
            }
        }
    ); 

    // Criação da tabela EMPRESA
     db.run(
        `CREATE TABLE IF NOT EXISTS EMPRESA (
            id INTEGER PRIMARY KEY,
            CNPJ TEXT NOT NULL,
            senha TEXT NOT NULL
        )`,
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table EMPRESA created.');
            }
        }
    );
    
    //criar uma tabela de venda de produtos
    db.run(
        `CREATE TABLE IF NOT EXISTS VENDA_PRODUTO (
            id INTEGER PRIMARY KEY,
            venda_id INTEGER NOT NULL,
            produto_id INTEGER NOT NULL,
            quantidade INTEGER NOT NULL,
            FOREIGN KEY(venda_id) REFERENCES VENDAS(id) on DELETE CASCADE,
            FOREIGN KEY(produto_id) REFERENCES PRODUTOS(id) on DELETE CASCADE
        )`,
        (err) => {
            if (err) {
                console.error(err.message);
            } else {
                console.log('Table VENDA_PRODUTO created.');
            }
        }
    );
db.run(`PRAGMA foreign_keys = ON`);



}
);



module.exports = db;
