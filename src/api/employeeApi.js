import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Request interceptor for logging (interceptor for using for debbing purpose)
api.interceptors.request.use(request => {
    console.log('Starting Request:', request.method, request.url);
    return request;
});

// Response interceptor for logging
api.interceptors.response.use(
    response => {
        console.log('Response:', response.status);
        return response;
    },
    error => {
        console.error('API Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
    }
);

export const employeeApi = {
    // Get all employees with pagination and sorting
    getAll: (page = 0, size = 10, sortBy = 'id', sortDir = 'asc') =>
        api.get(`/employees?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`),

    // Get ALL employees for export (no pagination)
    getAllForExport: () =>
        api.get(`/employees?page=0&size=10000&sortBy=id&sortDir=asc`),

    // Get single employee
    getById: (id) => api.get(`/employees/${id}`),

    // Create new employee
    create: (data) => api.post('/employees', data), //data mean employee object

    // Update employee
    update: (id, data) => api.put(`/employees/${id}`, data),

    // Delete employee
    delete: (id) => api.delete(`/employees/${id}`),

    // Search employees
    search: (keyword, page = 0, size = 10) =>
        api.get(`/employees/search?q=${keyword}&page=${page}&size=${size}`),
};