
# Employee Tracker

Employee Tracker is a command-line application built to manage a company's employee database. It allows users to view and manage departments, roles, and employees, providing a user-friendly interface for interacting with a PostgreSQL database.

## Table of Contents

- [Employee Tracker](#employee-tracker)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Example Commands](#example-commands)
  - [Screenshot](#screenshot)
  - [Database Schema](#database-schema)
  - [Future Enhancements](#future-enhancements)
  - [Contributing](#contributing)
  - [License](#license)

## Features

- **View All Departments**: Display a formatted table showing department names and their IDs.
- **View All Roles**: Display a formatted table showing job titles, role IDs, associated department names, and salaries.
- **View All Employees**: Display a formatted table showing employee IDs, first names, last names, job titles, departments, salaries, and managers.
- **Add a Department**: Prompt the user to enter a department name, which is then added to the database.
- **Add a Role**: Prompt the user to enter the role title, salary, and department, which is then added to the database.
- **Add an Employee**: Prompt the user to enter the employee's first name, last name, role, and manager, which is then added to the database.
- **Update an Employee Role**: Prompt the user to select an employee and update their role in the database.

## Technologies Used

- **Node.js**: JavaScript runtime for executing server-side code.
- **PostgreSQL**: Relational database management system used for storing and managing data.
- **pg**: PostgreSQL client for Node.js.
- **Inquirer.js**: Command-line interface for interactive prompts.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/William-figure/EMPLOYEE-TRACKER cd employee-tracker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up PostgreSQL database**:

   - Ensure PostgreSQL is installed and running on your machine.
   - Update the `index.js` file with your PostgreSQL user credentials and configuration.

4. **Initialize the database**:

   The application will automatically create and set up the database schema when you run it.

## Usage

1. **Start the application**:

   ```bash
   node index.js
   ```

2. **Follow the prompts**:

   - Use the arrow keys to navigate the menu.
   - Follow the prompts to view data or add/update records in the database.

### Example Commands

- **View All Departments**: Displays a list of all departments.
- **Add a Role**: Prompts for the role's name, salary, and department.
- **Add an Employee**: Prompts for the employee's name, role, and manager.

## Screenshot

![Project Demo](./Screen%20Recording%202024-08-24%20220908.gif)

## Database Schema

The database consists of three tables:

1. **departments**:
   - `id` (SERIAL PRIMARY KEY): Unique identifier for the department.
   - `name` (VARCHAR): The name of the department.

2. **roles**:
   - `id` (SERIAL PRIMARY KEY): Unique identifier for the role.
   - `title` (VARCHAR): The title of the job role.
   - `salary` (NUMERIC): The salary for the role.
   - `department_id` (INTEGER): Foreign key referencing the `departments` table.

3. **employees**:
   - `id` (SERIAL PRIMARY KEY): Unique identifier for the employee.
   - `first_name` (VARCHAR): The employee's first name.
   - `last_name` (VARCHAR): The employee's last name.
   - `role_id` (INTEGER): Foreign key referencing the `roles` table.
   - `manager_id` (INTEGER): Foreign key referencing another record in the `employees` table, representing the employee's manager.

## Future Enhancements

- **Search Functionality**: Add the ability to search employees by name, department, or role.
- **Enhanced Validation**: Implement additional validation for user inputs to ensure data integrity.
- **Advanced Reporting**: Generate advanced reports such as salary breakdowns by department or role.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -m 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
