const mysql = require("mysql");
connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "mydb4"
});

connection.connect((error) => {
    if (error) {
        console.error("Error de conexión " + error.stack)
        return;
    }
    console.log("Conectado a la base de datos")
});

module.exports = connection;