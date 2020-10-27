
//Startup Code
const mysql = require("mysql");
const cTable = require("console.table");
let connection;

function startConnection(){
    connection  = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "employees"
    });

    connection.connect(function(err){
        if (err) throw err;
        return true;
        //showMainMenu();
    });
}

module.exports = {
    startConnection: startConnection
}
