# Employee Management System

A full-stack web application for managing employee records. This project includes a Spring Boot backend API and a React frontend.

---

## Prerequisites

Before you begin, make sure you have these installed on your machine:

| Software | Version |
|----------|---------|
| Java JDK | 17.0.12 |
| Node.js | 22.20.0| 
| MySQL | 8.0.45.0 | 
| Maven | 3.9.12 | 

You can verify your installations by running:

```bash
java -version
node -v
mysql --version
mvn -v
```

---

## Backend Setup (Spring Boot)

Follow these steps to get the backend running on your local machine:

### Step 1: Navigate to the backend folder

```bash
cd backend
```

### Step 2: Make sure MySQL is running

**On Windows:**
```bash
net start mysql
```

**On Mac/Linux:**
```bash
sudo service mysql start
```

### Step 3: Create the database

Log into MySQL and create the database:

```bash
mysql -u root -p
```

Then run:

```sql
CREATE DATABASE employee_db;
EXIT;
```

### Step 4: Update database credentials

Open the file `src/main/resources/application.properties` and change these values to match your MySQL setup:

```properties
spring.datasource.username=root
spring.datasource.password=YOUR_MYSQL_PASSWORD
```

### Step 5: Build and run

```bash
mvn clean install
mvn spring-boot:run
```

The backend will start at **http://localhost:9090**

### Step 6: Test if it's working

Open your browser and go to:

```
http://localhost:9090/api/employees
```

You should see `[]` (empty array) or a list of employees if data exists.

---

## Frontend Setup (React)

Follow these steps to get the frontend running:

### Step 1: Navigate to the frontend folder

```bash
cd frontend
```

### Step 2: Install dependencies

```bash
npm install
```

### Step 3: Start the development server

```bash
npm start
```

The frontend will start at **http://localhost:3000**

Make sure the backend is running before using the frontend, otherwise API calls will fail.

---

## Environment Variables & Configuration

### Backend Configuration

Located in `backend/src/main/resources/application.properties`:

| Property | Description | Default Value |
|----------|-------------|---------------|
| `server.port` | Port where backend runs | `9090` |
| `spring.datasource.url` | MySQL database URL | `jdbc:mysql://localhost:3306/employee_db` |
| `spring.datasource.username` | MySQL username | `root` |
| `spring.datasource.password` | MySQL password | `root` |
| `spring.jpa.hibernate.ddl-auto` | Database schema handling | `update` |

### Frontend Configuration

If your backend runs on a different port, update the API base URL in the frontend code. Typically found in:

- `frontend/src/services/api.js` or
- `frontend/.env` file:

```
REACT_APP_API_URL=http://localhost:9090/api
```

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/{id}` | Get single employee |
| POST | `/api/employees` | Add new employee |
| PUT | `/api/employees/{id}` | Update employee |
| DELETE | `/api/employees/{id}` | Delete employee |
| GET | `/api/employees/search?q={keyword}` | Search employees |

---



