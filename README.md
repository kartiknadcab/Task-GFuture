# Project Management

Clone the Task-GFuture repository:

git clone https://github.com/kartiknadcab/Task-GFuture.git

Frontend Setup (Vite)

Navigate to the frontend directory:

cd frontend

Install dependencies:

npm install  

Start the development server:

npm run dev  

Open the app in your browser:

By default, Vite runs on http://localhost:5173

Backend Setup (Node.js + Express.js)

Steps to Run the Backend

Navigate to the backend directory:

cd backend

Install dependencies:

npm install 

Start the server:

npm start 

The backend runs on http://localhost:5000

API Endpoints

Projects

GET /api/projects - Fetch all projects (supports pagination & filtering)

POST /api/projects - Create a new project (Auth required)

GET /api/projects/:id - Fetch a single project

PUT /api/projects/:id - Update a project (Auth required)

DELETE /api/projects/:id - Delete a project (Auth required)

Tasks

GET /api/projects/:id/tasks - Fetch all tasks for a project

POST /api/projects/:id/tasks - Add a task to a project (Auth required)

PUT /api/tasks/:taskId - Update a task (Auth required)

DELETE /api/tasks/:taskId - Delete a task (Auth required)

Authentication

POST /api/auth/register - Register a new user

POST /api/auth/login - Login and receive a JWT token

GET /api/auth/profile - Get user profile (Auth required)

Technologies Used

Frontend: React.js (Vite), Redux, React Router, Bootstrap

Backend: Node.js, Express.js, Mongoose, JWT Authentication ,multer(image upload)

Database: MongoDB .

