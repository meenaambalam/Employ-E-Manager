
//Startup Code
const mysql = require("mysql");
const cTable = require("console.table");
const dbConnection = require("./database_connection");

//Add Menu specific functionality

function insertDept(dept){
    console.log("\nInserting Department...\n");
        connection.query(
            "INSERT INTO department SET ?",
            {
                name : dept
            },
            function(err, res) {
                if(err){
                    console.log("Error while inserting data into Department table: "+ err);
                } else {
                    console.log(res.affectedRows + "department inserted!\n");
                }
            }
        )
};


function insertRole(title, salary, deptId){
    console.log("\nInserting Role...\n");
        connection.query(
            "INSERT INTO role SET ?",
            {
                title : title,
                salary: salary,
                department_id: deptId
            },
            function(err, res) {
                if(err){
                    console.log("Error while inserting data into Role Table: " + err);
                } else {
                    console.log(res.affectedRows + "role inserted!\n");
                }
            }
        )
};

function insertEmployee(firstname, lastname, roleId, managerId){
    console.log("\nInserting Employee...\n");
        connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name : firstname,
                last_name: lastname,
                role_id: parseInt(roleId),
                manager_id: parseInt(managerId) || null
            },
            function(err, res) {
                if(err){
                    console.log("Error while inserting data into Employee Table: " + err);
                } else{
                    console.log(res.affectedRows + "role inserted!\n");
                }
            }
        )
}

module.exports = {
    startConnection: startConnection,
    insertDept: insertDept,
    insertRole: insertRole,
    insertEmployee: insertEmployee
}
