import React, { useState, useEffect, useCallback } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Box,
    Button,
    Snackbar,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Brightness4 as DarkIcon,
    Brightness7 as LightIcon,
} from '@mui/icons-material';
import EmployeeTable from '../components/EmployeeTable';
import EmployeeForm from '../components/EmployeeForm';
import DeleteDialog from '../components/DeleteDialog';
import SearchBar from '../components/SearchBar';
import { employeeApi } from '../api/employeeApi';

function EmployeesPage({ darkMode, setDarkMode }) {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [sortModel, setSortModel] = useState([{ field: 'id', sort: 'asc' }]);
    const [searchKeyword, setSearchKeyword] = useState('');

    // Form states
    const [formOpen, setFormOpen] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState(null);

    // Notification states
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    // Fetch employees
    const fetchEmployees = useCallback(async () => {
        setLoading(true);
        try {
            let response;
            if (searchKeyword) {
                response = await employeeApi.search(searchKeyword, page, pageSize);
            } else {
                const sortField = sortModel[0]?.field || 'id';
                const sortDir = sortModel[0]?.sort || 'asc';
                response = await employeeApi.getAll(page, pageSize, sortField, sortDir);
            }

            setEmployees(response.data.content);
            setTotalElements(response.data.totalElements);
        } catch (error) {
            showNotification('Error fetching employees', 'error');
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, sortModel, searchKeyword]);

    useEffect(() => {
        fetchEmployees();
    }, [fetchEmployees]);

    // Reset to first page when search keyword changes
    useEffect(() => {
        setPage(0);
    }, [searchKeyword]);

    // Show notification
    const showNotification = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    // Handle add employee
    const handleAddClick = () => {
        setSelectedEmployee(null);
        setFormOpen(true);
    };

    // Handle edit employee
    const handleEditClick = (employee) => {
        setSelectedEmployee(employee);
        setFormOpen(true);
    };

    // Handle delete click
    const handleDeleteClick = (employee) => {
        setEmployeeToDelete(employee);
        setDeleteDialogOpen(true);
    };

    // Handle form submit
    const handleFormSubmit = async (employeeData) => {
        try {
            if (selectedEmployee) {
                // Update
                await employeeApi.update(selectedEmployee.id, employeeData);
                showNotification('Employee updated successfully');
            } else {
                // Create
                await employeeApi.create(employeeData);
                showNotification('Employee added successfully');
            }
            setFormOpen(false);
            fetchEmployees();
        } catch (error) {
            const message = error.response?.data?.message || 'Operation failed';
            showNotification(message, 'error');
        }
    };

    // Handle delete confirm
    const handleDeleteConfirm = async () => {
        try {
            await employeeApi.delete(employeeToDelete.id);
            showNotification('Employee deleted successfully');
            setDeleteDialogOpen(false);
            fetchEmployees();
        } catch (error) {
            showNotification('Error deleting employee', 'error');
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Employee Management System
                    </Typography>
                    <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? <LightIcon /> : <DarkIcon />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
                {/* Toolbar */}
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    justifyContent: 'space-between',
                    alignItems: { xs: 'stretch', sm: 'center' },
                    gap: 2,
                    mb: 2
                }}>
                    <SearchBar
                        value={searchKeyword}
                        onChange={setSearchKeyword}
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddClick}
                        sx={{ whiteSpace: 'nowrap' }}
                    >
                        Add Employee
                    </Button>
                </Box>

                {/* Employee Table */}
                <EmployeeTable
                    employees={employees}
                    loading={loading}
                    page={page}
                    pageSize={pageSize}
                    totalElements={totalElements}
                    sortModel={sortModel}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                    onSortChange={setSortModel}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteClick}
                />

                {/* Add/Edit Form Dialog */}
                <EmployeeForm
                    open={formOpen}
                    onClose={() => setFormOpen(false)}
                    onSubmit={handleFormSubmit}
                    employee={selectedEmployee}
                />

                {/* Delete Confirmation Dialog */}
                <DeleteDialog
                    open={deleteDialogOpen}
                    onClose={() => setDeleteDialogOpen(false)}
                    onConfirm={handleDeleteConfirm}
                    employeeName={employeeToDelete ?
                        `${employeeToDelete.firstName} ${employeeToDelete.lastName}` : ''}
                />

                {/* Notifications */}
                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                >
                    <Alert
                        severity={snackbar.severity}
                        onClose={() => setSnackbar({ ...snackbar, open: false })}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </Box>
    );
}

export default EmployeesPage;