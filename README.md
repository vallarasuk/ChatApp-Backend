ChatApp Backend
Welcome to the ChatApp Backend! This project provides a backend server for a chat application, built with Node.js, Express, and MySQL, utilizing Knex.js for database management. This server handles user management including registration, authentication, and user data storage.

Table of Contents
Project Overview
Features
Prerequisites
Installation
Configuration
Running the Server
API Documentation
Database Migrations
Folder Structure
Contributing
License
Project Overview
This backend serves as the core service for the ChatApp, handling HTTP requests related to user operations such as creating new users and fetching user data. The server is built using:

Node.js: JavaScript runtime for server-side programming.
Express: Web framework for building API endpoints.
Knex.js: SQL query builder for managing database interactions.
MySQL: Relational database for storing user data.
Features
User registration with password encryption.
API endpoints for user management.
Middleware for handling JSON requests and responses.
Database migrations for managing schema changes.
Prerequisites
Before you begin, ensure you have the following installed on your local machine:

Node.js (v14 or later recommended)
MySQL (ensure the MySQL server is running)
Installation
Clone the repository:

git clone https://github.com/yourusername/chatapp-backend.git
cd chatapp-backend
Install dependencies:

npm install
Configuration
Environment Variables:

Create a .env file in the root of the project.
Add the following variables:

PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=chatapp
Knex Configuration:

Ensure knexfile.js matches your environment setup. Example configuration for development:
cript

module.exports = {
development: {
client: 'mysql',
connection: {
host: process.env.DB_HOST || '127.0.0.1',
user: process.env.DB_USER || 'root',
password: process.env.DB_PASSWORD || '',
database: process.env.DB_NAME || 'chatapp',
charset: 'utf8'
},
migrations: {
directory: './migrations'
}
}
};
Running the Server
Run database migrations:

npx knex migrate:latest --env development
Start the server:

npm start
The server should now be running on http://localhost:5000.

API Documentation
Create User
Endpoint: POST /api/users
Description: Creates a new user.
Request Body:

{
"username": "john_doe",
"email": "john@example.com",
"password": "password123",
"re_password": "password123"
}
Response:
Success: 201 Created

{
"message": "User created successfully"
}
Failure: 400 Bad Request

{
"errors": "Failed to create user"
}
Get All Users
Endpoint: GET /api/users
Description: Retrieves all users.
Response:
Success: 200 OK

[
{
"id": 1,
"username": "john_doe",
"email": "john@example.com"
}
// Other users...
]
Failure: 500 Internal Server Error

{
"error": "Failed to fetch users"
}
Database Migrations
Database migrations are managed using Knex.js.

Creating Migrations
To create a new migration file, run:

npx knex migrate:make migration_name --env development
Example:

npx knex migrate:make add_users_table --env development
Running Migrations
To apply all pending migrations, run:

npx knex migrate:latest --env development
Rolling Back Migrations
To rollback the last batch of migrations, run:

npx knex migrate:rollback --env development
Folder Structure
text

/chatapp-backend
├── /migrations # Database migration files
├── /services # Service layer for business logic
├── /node_modules # Node.js modules
├── .env # Environment variables
├── .gitignore # Git ignore file
├── knexfile.js # Knex configuration
├── package.json # Project dependencies and scripts
├── README.md # Project documentation
├── server.js # Main server file
Contributing
Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Notes on Customization
Update Links: Replace https://github.com/yourusername/chatapp-backend.git with the actual URL of your repository.
Environment Variables: Customize the environment variables as needed for your setup.
API Documentation: Expand the API documentation section with more endpoints as you add them.
Contribution Guidelines: Consider adding a CONTRIBUTING.md file for detailed contribution guidelines.
How to Use
Copy the Markdown: Copy the provided markdown content into a new README.md file in the root of your project directory.
Customize as Needed: Adjust the details to match your specific project setup and requirements.
This README.md serves as a comprehensive guide for users and contributors, providing all the necessary information to get started with your project.
