
//Startup Code
const mysql = require("mysql");
const inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");
const { connect } = require("http2");

const connection  = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "employees"
});

connection.connect(function(err){
    if (err) throw err;
    showMainMenu();
});

function showMainMenu(){
    console.log("Welcome to Employ-E-Manager");

    inquirer.prompt(
        {type: "rawlist",
         name: "action",
         message: "Add departmetns, roles, employees?",
         choices: [
             "Add Departments",
             "Add Roles",
             "Add Employees",
             "View Departments",
             "View Roles",
             "View Employees",
             "Update Employee Roles",
             "Additional Features",
             "Exit"
         ]
        }
    ).then(function(answer){
        switch (answer.action){
            case "Add Departments":
                addDepartment();
                break;
            
            case "Add roles":
                addRole();
                break;

            case "Add Employees":
                addEmployee();
                break;

            case "View Departments":
                viewDepartment();
                break;

            case "View Roles":
                viewRole();
                break;

            case "view Employees":
                viewEmployee();
                break;

            case "Update Employee Roles":
                updateEmpRoles();
                break;

            case "Additional Features":
                miscMenu();
                break;

            case "Exit":
                console.log("Thanks Message");
                endConnection();
                break;

        }
    });
}

function addDepartment(){
    inquirer.prompt({
        type: "input",
        name: "dept",
        message: "Enter a department name you want added to the Department Table:",
    }).then(function(answer){
        console.log("Inserting Department...\n");
        let query = connection.query(
            "INSERT INTO department SET ?",
            {
                name : answer.dept
            },
            function(err, res) {
                if(err) throw err;
                console.log(res.affectedRows + "department inserted!\n");
                showMainMenu();
            }
        )
    });
}

function addRole(){
    inquirer.prompt(
        {
            type: "input",
            name: "title",
            message: "Enter information on Title you want added to the Role Table:",
        },
        {
            type: "input",
            name: "salary",
            message: "Enter Salary of the Role:",
        },
        {
            type: "input",
            name: "deptId",
            message: "Enter the Dept-ID of this Role:"
        }
    ).then(function(answer){
        console.log("Inserting Role...\n");
        let query = connection.query(
            "INSERT INTO role SET ?",
            {
                title : answer.title,
                salary: answer.salary,
                department_id: answer.deptId
            },
            function(err, res) {
                if(err) throw err;
                console.log(res.affectedRows + "department inserted!\n");
                showMainMenu();
            }
        )
    });
}

function endConnection(){
    connection.end();
}