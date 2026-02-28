-- Employee Management System Database Schema
-- Create database
CREATE DATABASE IF NOT EXISTS employee_db;
USE employee_db;

-- Create employees table
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

-- Seed data (10+ records)
INSERT INTO employees (first_name, last_name, email, department, role, salary, hire_date) VALUES
('John', 'Doe', 'john.doe@company.com', 'Engineering', 'Software Engineer', 75000.00, '2022-01-15'),
('Jane', 'Smith', 'jane.smith@company.com', 'Marketing', 'Marketing Manager', 85000.00, '2021-06-20'),
('Michael', 'Johnson', 'michael.johnson@company.com', 'Engineering', 'Senior Developer', 95000.00, '2020-03-10'),
('Emily', 'Williams', 'emily.williams@company.com', 'HR', 'HR Specialist', 55000.00, '2023-02-28'),
('David', 'Brown', 'david.brown@company.com', 'Finance', 'Financial Analyst', 70000.00, '2022-07-05'),
('Sarah', 'Davis', 'sarah.davis@company.com', 'Engineering', 'QA Engineer', 65000.00, '2021-11-12'),
('James', 'Miller', 'james.miller@company.com', 'Sales', 'Sales Representative', 60000.00, '2023-04-18'),
('Jennifer', 'Wilson', 'jennifer.wilson@company.com', 'Marketing', 'Content Strategist', 62000.00, '2022-09-01'),
('Robert', 'Moore', 'robert.moore@company.com', 'Engineering', 'DevOps Engineer', 88000.00, '2021-08-22'),
('Lisa', 'Taylor', 'lisa.taylor@company.com', 'HR', 'HR Manager', 78000.00, '2020-12-03'),
('William', 'Anderson', 'william.anderson@company.com', 'Finance', 'Accountant', 58000.00, '2023-01-09'),
('Amanda', 'Thomas', 'amanda.thomas@company.com', 'Sales', 'Sales Manager', 92000.00, '2019-05-14');

