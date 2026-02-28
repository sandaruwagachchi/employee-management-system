# Employee Management System - Backend

A RESTful API backend for Employee Management System built with Spring Boot 3.x.

## Prerequisites

- **Java**: 17 or 21
- **Maven**: 3.6+
- **MySQL**: 8.x

## Technology Stack

- Spring Boot 3.5.11
- Spring Data JPA (Hibernate)
- MySQL 8.x
- Lombok
- Maven

## Project Structure

```
src/main/java/com/example/backend/
├── BackendApplication.java      # Main application entry point
├── config/
│   └── WebConfig.java           # CORS configuration
├── controller/
│   └── EmployeeController.java  # REST API endpoints
├── dto/
│   ├── EmployeeDTO.java         # Data Transfer Object with validation
│   └── ErrorResponse.java       # Standard error response format
├── exception/
│   ├── DuplicateResourceException.java
│   ├── GlobalExceptionHandler.java    # Global exception handler
│   └── ResourceNotFoundException.java
├── model/
│   └── Employee.java            # JPA Entity
├── repository/
│   └── EmployeeRepository.java  # Data access layer
└── service/
    ├── EmployeeService.java     # Service interface
    └── impl/
        └── EmployeeServiceImpl.java  # Business logic implementation
```

## Setup Instructions

### 1. Database Setup

Create the MySQL database by running the `schema.sql` file:

```sql
mysql -u root -p < schema.sql
```

Or manually execute:

```sql
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

CREATE TABLE IF NOT EXISTS employees (
    id            BIGINT         AUTO_INCREMENT PRIMARY KEY,
    first_name    VARCHAR(100)   NOT NULL,
    last_name     VARCHAR(100)   NOT NULL,
    email         VARCHAR(150)   NOT NULL UNIQUE,
    department    VARCHAR(100),
    role          VARCHAR(100),
    salary        DECIMAL(12, 2),
    hire_date     DATE,
    created_at    TIMESTAMP      DEFAULT CURRENT_TIMESTAMP
);
```

### 2. Configure Database Connection

Update `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/employee_db
spring.datasource.username=root
spring.datasource.password=your_password
```

### 3. Run the Application

```bash
# Using Maven
mvn spring-boot:run

# Or build and run JAR
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The server will start at: **http://localhost:9090**

## API Endpoints

| Method | Endpoint | Description | Status Code |
|--------|----------|-------------|-------------|
| GET | `/api/employees` | Get all employees (paginated) | 200 OK |
| GET | `/api/employees/{id}` | Get employee by ID | 200 OK |
| POST | `/api/employees` | Create new employee | 201 Created |
| PUT | `/api/employees/{id}` | Update employee | 200 OK |
| DELETE | `/api/employees/{id}` | Delete employee | 204 No Content |
| GET | `/api/employees/search?q={keyword}` | Search employees | 200 OK |

### Query Parameters for GET /api/employees

- `page` - Page number (default: 0)
- `size` - Page size (default: 10)
- `sortBy` - Sort field (default: id)
- `sortDir` - Sort direction: asc/desc (default: asc)

## API Examples

### Get All Employees
```bash
curl -X GET "http://localhost:9090/api/employees?page=0&size=10&sortBy=firstName&sortDir=asc"
```

### Get Employee by ID
```bash
curl -X GET "http://localhost:9090/api/employees/1"
```

### Create Employee
```bash
curl -X POST "http://localhost:9090/api/employees" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "department": "Engineering",
    "role": "Developer",
    "salary": 75000.00,
    "hireDate": "2024-01-15"
  }'
```

### Update Employee
```bash
curl -X PUT "http://localhost:9090/api/employees/1" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.updated@example.com",
    "department": "Engineering",
    "role": "Senior Developer",
    "salary": 85000.00,
    "hireDate": "2024-01-15"
  }'
```

### Delete Employee
```bash
curl -X DELETE "http://localhost:9090/api/employees/1"
```

### Search Employees
```bash
curl -X GET "http://localhost:9090/api/employees/search?q=John&page=0&size=10"
```

## Error Response Format

All errors follow a consistent JSON structure:

```json
{
  "timestamp": "2024-01-15T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Employee with id 42 not found"
}
```

### HTTP Status Codes

- `200 OK` - Successful GET/PUT request
- `201 Created` - Successful POST request
- `204 No Content` - Successful DELETE request
- `400 Bad Request` - Validation error
- `404 Not Found` - Resource not found
- `409 Conflict` - Duplicate email
- `500 Internal Server Error` - Server error

## Validation Rules

| Field | Rule |
|-------|------|
| firstName | Required, 2-100 characters |
| lastName | Required, 2-100 characters |
| email | Required, valid email format, unique |
| department | Optional, max 100 characters |
| role | Optional, max 100 characters |
| salary | Optional, must be positive |
| hireDate | Optional, must not be future date |

## CORS Configuration

The API is configured to accept requests from:
- `http://localhost:3000` (React development server)

## Author

Employee Management System - Full-Stack Developer Assignment

