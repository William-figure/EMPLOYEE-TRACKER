const { Client } = require('pg');
const inquirer = require('inquirer');
const fs = require('fs');
const path = require('path');

// Database connection configuration
const client = new Client({
  user: 'postgres', // replace with your PostgreSQL username
  host: 'localhost', // replace with your host, usually localhost
  database: 'employee_tracker', // replace with your PostgreSQL database name
  password: 'Wyc007898$', // replace with your PostgreSQL password
  port: 5432, // default PostgreSQL port
});

// Connect to the PostgreSQL database
client.connect()
  .then(() => {
    console.log('Connected to the PostgreSQL database.');
    manageDatabase(); // Initialize the database setup
  })
  .catch(err => {
    console.error('Connection error:', err.stack);
    process.exit(1);
  });

// Function to run schema.sql to drop and recreate the database
function manageDatabase() {
  const schemaPath = path.join(__dirname, 'db', 'schema.sql');
  fs.readFile(schemaPath, 'utf8', (err, sql) => {
    if (err) {
      console.error('Error reading schema file:', err.stack);
      process.exit(1);
    }

    client.query(sql)
      .then(() => {
        console.log('Database schema created or verified successfully.');
        mainMenu(); // Start the application after setting up the database
      })
      .catch(err => {
        console.error('Error executing schema file:', err.stack);
        process.exit(1);
      });
  });
}

// CRUD operation functions
function getAllDepartments(callback) {
  const query = 'SELECT * FROM departments';
  client.query(query)
    .then(result => callback(null, result.rows))
    .catch(err => callback(err, null));
}

function getAllRoles(callback) {
  const query = `
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    JOIN departments ON roles.department_id = departments.id
  `;
  client.query(query)
    .then(result => callback(null, result.rows))
    .catch(err => callback(err, null));
}

function getAllEmployees(callback) {
  const query = `
    SELECT employees.id, employees.first_name, employees.last_name, roles.title AS job_title, 
           departments.name AS department, roles.salary, 
           CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees
    JOIN roles ON employees.role_id = roles.id
    JOIN departments ON roles.department_id = departments.id
    LEFT JOIN employees AS manager ON employees.manager_id = manager.id
  `;
  client.query(query)
    .then(result => callback(null, result.rows))
    .catch(err => callback(err, null));
}

function addDepartment(name, callback) {
  const query = 'INSERT INTO departments (name) VALUES ($1) RETURNING *';
  client.query(query, [name])
    .then(result => callback(null, result.rows[0]))
    .catch(err => callback(err, null));
}

function addRole(title, salary, department_id, callback) {
  const query = 'INSERT INTO roles (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *';
  client.query(query, [title, salary, department_id])
    .then(result => callback(null, result.rows[0]))
    .catch(err => callback(err, null));
}

function addEmployee(first_name, last_name, role_id, manager_id, callback) {
  const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *';
  client.query(query, [first_name, last_name, role_id, manager_id])
    .then(result => callback(null, result.rows[0]))
    .catch(err => callback(err, null));
}

function updateEmployeeRole(employee_id, new_role_id, callback) {
  const query = 'UPDATE employees SET role_id = $1 WHERE id = $2 RETURNING *';
  client.query(query, [new_role_id, employee_id])
    .then(result => callback(null, result.rows[0]))
    .catch(err => callback(err, null));
}

// Function to map user actions to corresponding functions
const actionHandlers = {
  'View all departments': function() {
    getAllDepartments((err, departments) => {
      if (err) {
        console.error('Error fetching departments:', err);
        return mainMenu(); // Return to main menu in case of error
      }
      console.table(departments);
      mainMenu(); // Return to main menu after operation
    });
  },
  'View all roles': function() {
    getAllRoles((err, roles) => {
      if (err) {
        console.error('Error fetching roles:', err);
        return mainMenu(); // Return to main menu in case of error
      }
      console.table(roles);
      mainMenu(); // Return to main menu after operation
    });
  },
  'View all employees': function() {
    getAllEmployees((err, employees) => {
      if (err) {
        console.error('Error fetching employees:', err);
        return mainMenu(); // Return to main menu in case of error
      }
      console.table(employees);
      mainMenu(); // Return to main menu after operation
    });
  },
  'Add a department': promptAddDepartment,
  'Add a role': promptAddRole,
  'Add an employee': promptAddEmployee,
  'Update an employee role': promptUpdateEmployeeRole,
  'Exit': function() {
    console.log('Goodbye!');
    client.end(); // Close the database connection before exiting
    process.exit(); // Exit the application
  }
};

// Main menu function
function mainMenu() {
  console.log('Displaying main menu...'); // Debug log to confirm function call
  inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'What would you like to do?',
        choices: Object.keys(actionHandlers) // Use keys from the actionHandlers object
      }
    ])
    .then((answers) => {
      console.log('User selected:', answers.action); // Debug log to track user choice
      const action = answers.action;
      actionHandlers[action](); // Call the corresponding function based on user choice
    })
    .catch((error) => {
      console.error('An error occurred in main menu:', error); // Log error for debugging
      mainMenu(); // Return to main menu in case of error
    });
}

// Function to prompt user to add a department
function promptAddDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'name',
      message: 'Enter the name of the department:',
    }
  ]).then((answers) => {
    addDepartment(answers.name, (err, newDepartment) => {
      if (err) {
        console.error('Error adding department:', err);
        return mainMenu(); // Return to main menu in case of error
      }
      console.log(`Department added: ${newDepartment.name}`);
      mainMenu(); // Return to main menu after operation
    });
  }).catch(err => {
    console.error('An error occurred while adding a department:', err);
    mainMenu(); // Return to main menu in case of error
  });
}

// Function to prompt user to add a role
function promptAddRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: 'Enter the role title:',
    },
    {
      type: 'input',
      name: 'salary',
      message: 'Enter the role salary:',
    },
    {
      type: 'input',
      name: 'department_id',
      message: 'Enter the department ID for this role:',
    }
  ]).then((answers) => {
    addRole(answers.title, answers.salary, answers.department_id, (err, newRole) => {
      if (err) {
        console.error('Error adding role:', err);
        return mainMenu(); // Return to main menu in case of error
      }
      console.log(`Role added: ${newRole.title}`);
      mainMenu(); // Return to main menu after operation
    });
  }).catch(err => {
    console.error('An error occurred while adding a role:', err);
    mainMenu(); // Return to main menu in case of error
  });
}

// Function to prompt user to add an employee
function promptAddEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: "Enter the employee's first name:",
    },
    {
      type: 'input',
      name: 'last_name',
      message: "Enter the employee's last name:",
    },
    {
      type: 'input',
      name: 'role_id',
      message: "Enter the employee's role ID:",
    },
    {
      type: 'input',
      name: 'manager_id',
      message: "Enter the employee's manager ID (if any):",
    }
  ]).then((answers) => {
    // Convert empty manager_id to null
    const manager_id = answers.manager_id.trim() === '' ? null : parseInt(answers.manager_id, 10);

    addEmployee(answers.first_name, answers.last_name, parseInt(answers.role_id, 10), manager_id, (err, newEmployee) => {
      if (err) {
        console.error('Error adding employee:', err);
        return mainMenu(); // Return to main menu in case of error
      }
      console.log(`Employee added: ${newEmployee.first_name} ${newEmployee.last_name}`);
      mainMenu(); // Return to main menu after operation
    });
  }).catch(err => {
    console.error('An error occurred while adding an employee:', err);
    mainMenu(); // Return to main menu in case of error
  });
}

// Function to prompt user to update an employee's role
function promptUpdateEmployeeRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employee_id',
      message: 'Enter the ID of the employee you want to update:',
    },
    {
      type: 'input',
      name: 'new_role_id',
      message: 'Enter the new role ID for this employee:',
    }
  ]).then((answers) => {
    updateEmployeeRole(answers.employee_id, answers.new_role_id, (err, updatedEmployee) => {
      if (err) {
        console.error('Error updating employee role:', err);
        return mainMenu(); // Return to main menu in case of error
      }
      console.log(`Employee updated: ${updatedEmployee.first_name} ${updatedEmployee.last_name} is now in role ID ${updatedEmployee.role_id}`);
      mainMenu(); // Return to main menu after operation
    });
  }).catch(err => {
    console.error('An error occurred while updating an employee role:', err);
    mainMenu(); // Return to main menu in case of error
  });
}
