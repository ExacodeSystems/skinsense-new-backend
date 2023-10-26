# Node.js CRUD Application with Express and MySQL

This is a simple Node.js CRUD (Create, Read, Update, Delete) application built using Express.js as the web framework, MySQL as the database, and Mocha/Chai for testing the API endpoints. The application allows you to manage todo items by performing basic CRUD operations through RESTful API endpoints.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [API Endpoints](#api-endpoints)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before running this application, you need to have the following installed:

- Node.js (v14 or higher)
- MySQL Server
- npm (Node Package Manager)

## Getting Started

To get started with the development and running the application locally, follow these steps:

1. Clone the repository:

```
git clone https://github.com/your-username/node-express-mysql-crud.git
cd node-express-mysql-crud
```

2. Install the dependencies:

```
npm install
```

3. Configure the database connection:

   - Create a MySQL database for the application.
   - Rename the `.env.example` file to `.env`.
   - Update the `.env` file with your MySQL database credentials.

4. Run the application:

```
npm run dev
```

The server will start at `http://localhost:PORT`.

## Project Structure

The project has the following directory structure:

```
.
├── config
│   └── db.js
├── controllers
│   └── todoController.js
├── routes
│   └── todoRoutes.js
├── services
│   └── todoService.js
├── tests
│   └── api.test.js
├── app.js
├── package.json
└── README.md
```

- `config`: Contains the configuration file for the database connection.
- `controllers`: Contains the controller logic for handling API requests.
- `routes`: Defines the API routes and connects them to the controllers.
- `services`: Contains the business logic or services to handle database operations.
- `tests`: Contains the Mocha/Chai unit test file for testing API endpoints.
- `app.js`: The entry point of the application, where Express is configured and initialized.
- `package.json`: Contains the application's metadata and dependencies.

## Dependencies

The project uses the following major dependencies:

- Express: Web framework for Node.js.
- MySQL2: MySQL client for Node.js.
- Mocha: Testing framework for running unit tests.
- Chai: Assertion library for writing test cases.
- Chai-Http: Plugin to make HTTP requests for testing APIs.

For a complete list of dependencies, see the `package.json` file.

## API Endpoints

The API endpoints for this application are as follows:

- `POST /todos`: Create a new todo item.
- `GET /todos`: Get all todo items.
- `GET /todos/:id`: Get a todo item by ID.
- `PUT /todos/:id`: Update a todo item.
- `DELETE /todos/:id`: Delete a todo item.

For detailed information on the API endpoints and their request/response formats, please refer to the `routes/todoRoutes.js` file.

## Testing

The application includes Mocha/Chai unit tests for the API endpoints. To run the tests, use the following command:

```
npm test
```

The test cases are written in the `tests/todo.api.test.js` file and cover the CRUD operations for todo items.

## Contributing

Contributions to this project are welcome. Feel free to open issues, submit pull requests, or suggest improvements.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---
