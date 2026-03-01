import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton, Box } from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';

const EmployeeTable = ({
    employees,
    loading,
    page,
    pageSize,
    totalElements,
    sortModel,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onEdit,
    onDelete
}) => {
    const columns = [
        { field: 'id', headerName: 'ID', width: 70, minWidth: 50 },
        { field: 'firstName', headerName: 'First Name', flex: 1, minWidth: 100 },
        { field: 'lastName', headerName: 'Last Name', flex: 1, minWidth: 100 },
        { field: 'email', headerName: 'Email', flex: 1.5, minWidth: 150 },
        { field: 'department', headerName: 'Department', flex: 1, minWidth: 100 },
        { field: 'role', headerName: 'Role', flex: 1, minWidth: 100 },
        {
            field: 'salary',
            headerName: 'Salary',
            flex: 1,
            minWidth: 100,
            valueFormatter: (value) => {
                if (!value) return '-';
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(value);
            }
        },
        {
            field: 'hireDate',
            headerName: 'Hire Date',
            flex: 0.8,
            minWidth: 100,
            valueFormatter: (value) => {
                if (!value) return '-';
                return format(new Date(value), 'yyyy-MM-dd');
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            sortable: false,
            disableColumnMenu: true,
            renderCell: (params) => (
                <>
                    <IconButton onClick={() => onEdit(params.row)} size="small">
                        <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => onDelete(params.row)} size="small" color="error">
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <Box sx={{
            height: { xs: 400, sm: 500, md: 600 },
            width: '100%',
        }}>
            <DataGrid
                rows={employees}
                columns={columns}
                loading={loading}
                paginationMode="server"
                paginationModel={{ page, pageSize }}
                rowCount={totalElements}
                onPaginationModelChange={(model) => {
                    onPageChange(model.page);
                    onPageSizeChange(model.pageSize);
                }}
                sortingMode="server"
                sortModel={sortModel}
                onSortModelChange={onSortChange}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                getRowId={(row) => row.id}
                sx={{
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none',
                    },
                }}
            />
        </Box>
    );
};

export default EmployeeTable;