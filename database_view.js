
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


//Add Menu specific functionality

function viewDept(){
    console.log("\nViewing Department List:");
    let resultDisplay = [];
    var query = "SELECT id, name FROM department order by id";
    connection.query(query, function(err, res){
        if (err){
            console.log("Error while selecting Department Table: " + err);
        }
        else{
            for (let i = 0; i < res.length; i++) {
                let resultSet = [res[i].id, res[i].name];
                resultDisplay.push(resultSet);
            }
            console.table(["Department ID", "Department Name"],resultDisplay);
        }
    })

}


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
