### What I Implemented

## Backend (.NET API)

    Connected frontend to backend API
    Implemented user authentication (Register & Login)
    Created user-based task filtering (GET /tasks/{userId})
    Implemented full CRUD operations for Tasks:
        Create
        Read
        Update
        Delete
        Added proper error handling and validation

## Frontend (React)

    Connected React app to backend using Axios
    Created reusable Axios instance with baseURL
    Implemented:
        Login page
        Registration page
        Task management UI
    Implemented session persistence using localStorage
        Login → user stored in localStorage
        Refresh → user restored automatically
        Logout → user removed from localStorage
    Refactored Tasks.jsx for cleaner state management
    Added custom styling (Tasks.css, Auth.css)
    Added loading states and error handling

### How to Run the Project
## Backend

    1. Navigate to backend folder
    2. Update connection string if needed
    3. Run:
        dotnet run
    Backend runs at: http://localhost:5000

## Frontend

    1. Navigate to frontend folder
    2. Ensure .env contains:
        VITE_API_BASE_URL=http://localhost:5000/api
    3. Run:
        npm install
        npm run dev
    Frontend runs at: http://localhost:5173
    

### How to Test

    1. Register a new user
    2. Login
    3. Add tasks
    4. Edit / Toggle / Delete tasks
    5. Refresh page → session persists
    6. Logout → redirected to login screen

### Database Setup
Update the connection string in `appsettings.json` to match your local database configuration before running the backend.

### Backend Configuration Notes
- CORS enabled to allow frontend at http://localhost:5173
- Ensure correct port (5000) is used