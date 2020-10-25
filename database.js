//Insert a Department

const mysql = require("mysql");

let insertDept = (row) => {
    return connection.query(
    "INSERT INTO department SET ?",
    {
        name : row.dept
    })
};
