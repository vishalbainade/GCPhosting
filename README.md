# EventHive: Event Organizer & Ticket Scanning Web Application

EventHive is a full-stack web application designed for event organizers to manage their events and create credentials for ticket scanners. It features a React.js frontend, a Node.js/Express.js backend, and a PostgreSQL database.

## Project Structure

The project is divided into two main directories:

- `frontend/`: Contains the complete React.js application.
- `backend/`: Contains the complete Node.js/Express.js application.

## Setup and Run Instructions

### 1. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up PostgreSQL Database:**
    - Ensure you have PostgreSQL installed and running.
    - Create a new database (e.g., `eventhive_db`).
    - Run the SQL schema to create tables. You can use a PostgreSQL client (like `psql` or DBeaver) to execute the commands from `backend/schema.sql`:
        ```bash
        psql -U your_db_user -d eventhive_db -f schema.sql
        ```
        (Replace `your_db_user` and `eventhive_db` with your actual database user and name.)

4.  **Configure Environment Variables:**
    - Create a `.env` file in the `backend/` directory.
    - Add the following environment variables, replacing the placeholders with your actual values:
        ```
        PORT=5000
        DB_USER=your_db_user
        DB_HOST=localhost
        DB_NAME=eventhive_db
        DB_PASSWORD=your_db_password
        DB_PORT=5432
        JWT_SECRET=supersecretjwtkey_replace_with_a_strong_secret
        ```

5.  **Run the backend server:**
    ```bash
    npm start
    ```
    The backend server will run on `http://localhost:5000`.

### 2. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Run the frontend application:**
    ```bash
    npm start
    ```
    The frontend application will typically open in your browser at `http://localhost:3000`.

---

**Note:**
- Ensure both backend and frontend are running for the application to function correctly.
- For image uploads, the backend will create an `uploads/` directory inside `backend/`.