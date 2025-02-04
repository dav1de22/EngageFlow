Employee Productivity Dashboard
React
.NET
Azure
SQL Server

The Employee Productivity Dashboard is a full-stack web application designed to help organizations track and manage employee tasks. It features a React frontend and a .NET Core backend, with data stored in a SQL Server database. The app allows users to view, create, and update tasks, providing a seamless experience for managing productivity.

Features
Task Management:

View a list of tasks with details such as title, description, deadline, and status.

Click on a task to edit its details.

Mark tasks as completed.

Modern Tech Stack:

Frontend: React with Material-UI for a polished user interface.

Backend: .NET Core Web API for handling business logic and data.

Database: SQL Server for storing task data.

Cloud-Ready:

Built with Azure in mind, making it easy to deploy to the cloud.

Responsive Design:

The React frontend is fully responsive and works on all devices.

Technologies Used
Frontend:

React

Axios (for API calls)

Material-UI (for styling)

Backend:

.NET Core

Entity Framework Core (for database operations)

SQL Server (for data storage)

DevOps:

Azure DevOps (for CI/CD)

Docker (for containerization)

Backend Setup
Clone the Repository:


git clone https://github.com/your-username/Employee-Productivity-Dashboard.git
cd Employee-Productivity-Dashboard/backend/ProductivityAPI

Set Up the Database:

Update the connection string in appsettings.json:

"ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=ProductivityDB;Trusted_Connection=True;"
}
Run the following commands to create and apply migrations:

dotnet ef migrations add InitialCreate
dotnet ef database update
Run the Backend:

dotnet run
The API will be available at http://localhost:5000.

Frontend Setup
Navigate to the frontend folder:

cd ../../frontend/productivity-dashboard
Install dependencies:

npm install
Start the React app:

npm start
The app will open in your browser at http://localhost:3000.

Environment Variables
Backend:

Update the connection string in appsettings.json for your database.

Frontend:

If you deploy the backend to a different URL, update the API base URL in TaskList.js:


axios.get('http://localhost:5000/api/tasks')



How to Use
View Tasks:

Open the app in your browser.

You’ll see a list of tasks fetched from the backend.

Edit a Task:

Click on a task to open the edit form.

Update the task details and click Save.

Mark as Completed:

Toggle the Completed checkbox in the edit form and save the task.
