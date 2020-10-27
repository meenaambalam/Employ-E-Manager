
//Startup Code
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");
// const { allowedNodeEnvironmentFlags } = require("process");
// const { connect } = require("http2");
const dbConnection = require("./database_connection");
const dbAdd = require("./database_add");

dbConnection.startConnection();
showMainMenu();

function showMainMenu(){
    console.log("Welcome to Employ-E-Manager");

    inquirer.prompt(
        {type: "rawlist",
         name: "mainmenu_action",
         message: "Please selection one of the below actions to perform:",
         choices: [
             "Add data to Department/Role/Employee",
             "View Department/Role/Employee information",
             "Update Employee information",
             "Delete Department/Role/Employee",
             "Report - Total utilized budget by Department",
             "Exit"
         ]
        }
    ).then(function(answer){
        switch (answer.mainmenu_action){
            case "Add data to Department/Role/Employee":
                showAddMenu();
                break;
            
            case "View Department/Role/Employee information":
                showViewMenu();
                break;

            case "Update Employee information":
                showUpdateMenu();
                break;

            case "Delete Department/Role/Employee":
                showDeleteMenu();
                break;

            case "Report - Total utilized budget by Department":
                showReportMenu();
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

//Add functionality
function showAddMenu(){
    inquirer.prompt(
        {type: "rawlist",
         name: "add_action",
         message: "Add departments, roles, employees?",
         choices: [
             "Add Departments",
             "Add Roles",
             "Add Employees",
             "Return to Main Menu",
             "Exit"
         ]
        }
    ).then(function(answer){
        switch (answer.add_action){
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

            case "Return to Add Data Menu":
                showAddMenu();
                break;
            
            case "Return to Main Menu":
                showMainMenu();
                break;

            case "Exit":
                exit();
                break;

        }
    }).catch(function(err){
        if (err){
            console.log("Add Menu error: " + err);
        }
    });
}


//Add Menu specific functionality
function addDepartment(){
    console.log("\n Enter Department related information");
    inquirer.prompt({
        type: "input",
        name: "dept",
        message: "Enter a department name you want added to the Department Table:",
    }).then(function(answer){
        dbAdd.insertDept(answer.dept);
        continuePrompt();
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
        dbAdd.insertRole(answer.title, answer.salary, answer.deptId);
        continuePrompt();
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
        dbAdd.insertEmployee(answer.first_name, answer.last_name, answer.roleId, answer.managerId);
        continuePrompt();
    });
}

//View  menu related functionality

function showViewMenu(){
    inquirer.prompt(
        {type: "rawlist",
         name: "view_action",
         message: "View departments, roles, employees?",
         choices: [
             "View Departments",
             "View Roles",
             "View Employees",
             "View Employees by Manager",
             "View - Total utilized budget by Department",
             "Return to Main Menu",
             "Exit"
         ]
        }
    ).then(function(answer){
        switch (answer.view_action){
            case "View Departments":
                viewDepartment();
                break;

            case "View Roles":
                viewRole();
                break;

            case "View Employees":
                viewEmployee();
                break;
            
            case "View Employees by Manager":
                viewEmployeebyManager();
                break;

            case "View - Total utilized budget by Department":
                showReportMenu();
                break;

            case "Return to View Tables Menu":
                showViewMenu();
                break;

            case "Return to Main Menu":
                showMainMenu();
                break;

            case "Exit":
                exit();
                break;

        }
    }).catch(function(err){
        if (err){
            console.log("View Menu error: " + err);
        }
    });
}


function viewDepartment(){
    console.log("\nDepartment List:");
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
        continuePrompt();
    })

}

function viewRole(){
    console.log("\nDepartment Role List:");
    let resultDisplay = [];

    var query = "SELECT id, title, salary, department_id FROM role ORDER BY department_id";
    connection.query(query,function(err,res){
        if (err){
            console.log("Error while selecting Role Table: " + err);
        } else{
            for (let i = 0; i < res.length; i++) {
                let resultSet = [res[i].id,res[i].title,res[i].salary,res[i].department_id];
                resultDisplay.push(resultSet);
            }
            console.table(["ID", "Title", "Salary", "Dept_Id"],resultDisplay);
        }
        continuePrompt(); 
    });
}

function viewEmployee(){
    console.log("\nEmployee List:");
    let resultDisplay = [];

    var query = "SELECT e.id, e.first_name, e.last_name, e.role_id, r.title as 'role', e.manager_id, CONCAT(m.first_name,',',m.last_name) as manager";
    query += "  FROM employee e LEFT JOIN employee m ON e.manager_id = m.id";
    query += "  LEFT JOIN role r ON e.role_id = r.id";
    connection.query(query,function(err,res){
        if (err){
            console.log("Error while selecting Employee Table: " + err);
            return;
        } 
        if(res.length > 0){
            for (let i = 0; i < res.length; i++) {
                resultSet = [res[i].id,res[i].first_name,res[i].last_name,res[i].role_id,res[i].role,res[i].manager_id,res[i].manager];
                resultDisplay.push(resultSet);
            }
            console.table(["Employee_Id", "FirstName", "LastName", "RoleID", "Role", "ManagerID", "ManagerName"], resultDisplay);
        }
        continuePrompt(); 
    });
}

function viewEmployeebyManager(){
    console.log("\nEmployee List by Manager:\n");
    inquirer.prompt([
        {
        type:"input",
        name:"managerID",
        message: "Enter the Manager ID:"
        }
    ]).then(function(answer){

        var query = "SELECT e.id, e.first_name, e.last_name, e.role_id, r.title as 'role', e.manager_id, CONCAT(m.first_name,',',m.last_name) as manager";
        query += "  FROM employee e LEFT JOIN employee m ON e.manager_id = m.id";
        query += "  LEFT JOIN role r ON e.role_id = r.id WHERE e.manager_id = ?";
        
        connection.query(
            query,
            answer.managerID,
            function(err,res){
            if (err){
                console.log("Error while selecting Employee Table by Manager: " + err);
                return;
            } 
            if (res.length > 0){
                let resultDisplay = [];
                let resultSet = [];
                for (let i = 0; i < res.length; i++) {
                    resultSet = [res[i].id,res[i].first_name,res[i].last_name,res[i].role_id,res[i].role,res[i].manager_id,res[i].manager];
                    resultDisplay.push(resultSet);
                }
                console.table(["Employee_Id","FirstName","LastName","RoleID","Role","ManagerID","ManagerName"],resultDisplay);
            } else{
                console.log("\nNo records to Display!\n");
            }
            continuePrompt(); 
        });
    });
}

function showReportMenu(){
    console.log("\nTotal utilized budget of each department:\n");

    let query = "SELECT d.name as department, d.id as department_id, SUM(r.salary) as total_budget";
    query += " FROM employee e LEFT JOIN role r ON e.role_id = r.id"
    query += " LEFT JOIN department d ON r.department_id = d.id"
    query += " GROUP BY d.name";
    connection.query(query,function(err,res){
        if(err) {
            console.log("Error while selecting department total budget information" + err);
            return;
        } 
        if(res.length > 0) {
            let resultDisplay = [];
            let resultSet = [];
            for (let i = 0; i < res.length; i++) {
                resultSet = [res[i].department,res[i].department_id,res[i].total_budget];
                resultDisplay.push(resultSet);
            }
            console.table(["Department","Department_ID", "Total_Budget_Utilized"],resultDisplay);
        }
        continuePrompt(); 
    });
}

//Update menu related functionality
function showUpdateMenu(){
    inquirer.prompt(
        {type: "rawlist",
         name: "update_action",
         message: "What Employee information you want to Update?",
         choices: [
             "Update Employee Roles",
             "Update Employee Manager",
             "Return to Main Menu",
             "Exit"
         ]
        }
    ).then(function(answer){
        switch (answer.update_action){
            case "Update Employee Roles":
                updateEmpRole();
                break;
            
            case "Update Employee Manager":
                updateEmpMgr();
                break;

            case "Return to Update Menu":
                showUpdateMenu();
                break;
            
            case "Return to Main Menu":
                showMainMenu();
                break;

            case "Exit":
                exit();
                break;

        }
    }).catch(function(err){
        if (err){
            console.log("Update Menu error: " + err);
        }
    });
}


function updateEmpRole(){
    console.log("\nUpdating Employee Role\n");
    inquirer.prompt([
        {
            name: "employee_id",
            type: "input",
            message: "Enter the Employee Id you want to update:"
        },
        {
            name: "new_roleId",
            type: "input",
            message: "Enter the new role_id of the Employee:"
        }
    ]).then(function(answer){
        console.log("\nStarting to update\n");
        connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    role_id: answer.new_roleId
                },
                {
                    id: answer.employee_id 
                }
            ],
            function(err, res){
                if (err) {
                    console.log("Error while updating employee role!");
                } else{
                    console.log(res.affectedRows + " were updated in Employee Table");
                    continuePrompt(); 
                }
            }
        );
    });
}

function updateEmpMgr(){
    console.log("\nUpdating Employee Manager\n");
    inquirer.prompt([
        {
            name: "employee_id",
            type: "input",
            message: "Enter the Employee Id you want to update:"
        },
        {
            name: "new_managerId",
            type: "input",
            message: "Enter the new Manager Id the employee will be reporting to:"
        }
    ]).then(function(answer){
        console.log("\nStarting to update\n");
        connection.query(
            "UPDATE employee SET ? WHERE ?",
            [
                {
                    manager_id: answer.new_managerId
                },
                {
                    id: answer.employee_id 
                }
            ],
            function(err, res){
                if (err) {
                    console.log("Error while updating employee Manager!");
                } else{
                    console.log(res.affectedRows + " were updated in Employee Table");
                    continuePrompt(); 
                }
            }
        );
    });
}

//delete functionality
function showDeleteMenu(){
    inquirer.prompt([
        {
            name: "delete_action",
            type: "rawlist",
            message: "What information you would like to Delete?",
            choices: [
                "Delete a Department?",
                "Delete a Role?",
                "Delete an Employee?"
            ]
        }
    ]).then(function(answer){
        console.log("\nDeleting....\n");
        switch (answer.delete_action){
            case "Delete a Department?":
                deleteDept();
                break;
            
            case "Delete a Role?":
                deleteRole();
                break;

            case "Delete an Employee?":
                deleteEmployee();
                break;
            
            case "Return to Delete Menu":
                showDeleteMenu();
                break;
    
            case "Return to Main Menu":
                showMainMenu();
                break;

            case "Exit":
                exit();
                break;

        }

    });
}

function deleteDept(){
    inquirer.prompt([
        {
            type: "input",
            name: "deptId",
            message: "Enter the department you want to delete:"
        }
    ]).then(function(answer){

    });
}

//common menu functionality
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
    console.log("\nThanks for using Employ-E-Manager!");
    console.log("Ending Connection!");
    connection.end();
}