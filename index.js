
//Startup Code
const mysql = require("mysql");
const inquirer = require("inquirer");
const { allowedNodeEnvironmentFlags } = require("process");
const { connect } = require("http2");
const database = require("./database");

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
            
            case "Add Roles":
                console.log("Add Role being called here:");
                addEmpRole();
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
                exit();
                break;

        }
    }).catch(function(err){
        if (err){
            console.log("Main menu error: " + err);
        }
    });
}

function addDepartment(){
    console.log("\n Enter Dpartment related information");
    inquirer.prompt({
        type: "input",
        name: "dept",
        message: "Enter a department name you want added to the Department Table:",
    }).then(function(answer){
        console.log("\nInserting Department...\n");
        let query = connection.query(
            "INSERT INTO department SET ?",
            {
                name : answer.dept
            },
            function(err, res) {
                if(err) throw err;
                console.log(res.affectedRows + "department inserted!\n");
                continuePrompt();
            }
        )
    });
}

function addEmpRole(){
    console.log("Enter Role related information as per the prmopts:");

    inquirer.prompt([
        {
            type: "input",
            name: "title",
            message: "Enter information on Title you want added to the Role Table:"
        },
        {
            type: "input",
            name: "salary",
            message: "Enter Salary of the Role:"
        },
        {
            type: "input",
            name: "deptId",
            message: "Enter the Dept-ID of this Role:"
        }
    ]).then(function(answer){
        console.log("\nInserting Role...\n");
        let query = connection.query(
            "INSERT INTO role SET ?",
            {
                title : answer.title,
                salary: answer.salary,
                department_id: answer.deptId
            },
            function(err, res) {
                if(err) throw err;
                console.log(res.affectedRows + "role inserted!\n");
                continuePrompt();
            }
        )
    });
}

function addEmployee(){
    console.log("Enter Employee related information as per the prmopts:");

    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "Enter First Name:"
        },
        {
            type: "input",
            name: "last_name",
            message: "Enter Last Name:"
        },
        {
            type: "input",
            name: "roleId",
            message: "Enter the Role-ID of this Employee:"
        },
        {
            type: "input",
            name: "managerId",
            message: "Enter the Manager-ID, if the Employee reports to a Manager:"
        }
    ]).then(function(answer){
        console.log("\nInserting Employee...\n");
        let query = connection.query(
            "INSERT INTO employee SET ?",
            {
                first_name : answer.first_name,
                last_name: answer.last_name,
                role_id: parseInt(answer.roleId),
                manager_id: parseInt(answer.managerId) || null
            },
            function(err, res) {
                if(err) throw err;
                console.log(res.affectedRows + "role inserted!\n");
                continuePrompt();
            }
        )
    });
}

function viewDepartment(){
    console.log("\nDepartment List:");
    // let deptArray = [
    //     {deptID: "department ID",
    //      deptName: "department Name"
    //     }
    // ];
    var query = "SELECT id, name FROM department order by id";
    console.log(`Department ID \t Department Name`); 
    connection.query(query, function(err, res){
        if (err){
            console.log("Error while selecting Department Table: " + err);
        }
        else{
            for (let i = 0; i < res.length; i++) {
                console.log(`${res[i].id} \t ${res[i].name}`);  
                continuePrompt();
            }
        }
    })

}

function viewRole(){
    console.log("\nDepartment Role List:");

    var query = "SELECT title, salary, department_id order by department_id";
    console.log(`Title || Salary || Dept_Id`);
    connection.query(query,function(err,res){
        if (err){
            console.log("Error while selecting Role Table: " + err);
        } else{
            for (let i = 0; i < res.length; i++) {
                console.log(`${res.title} || ${res.salary} || ${res.department_id} `);
                continuePrompt(); 
            }
        }
    })
}

function continuePrompt(){
    inquirer.prompt({
        type: "confirm",
        name: "continue",
        message: "Continue....?",
    }).then((answer) => {
        if (answer.continue){
            showMainMenu();
        } else{
            exit();
        }
    })
}

function exit(){
    console.log("Thanks for using Employ-E-manger!");
    console.log("Ending Connection!");
    connection.end();
}