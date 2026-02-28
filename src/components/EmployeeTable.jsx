import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { IconButton } from '@mui/material';
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
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First Name', width: 130 },
        { field: 'lastName', headerName: 'Last Name', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'department', headerName: 'Department', width: 150 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'salary',
            headerName: 'Salary',
            width: 130,
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
            width: 120,
            valueFormatter: (value) => {
                if (!value) return '-';
                return format(new Date(value), 'yyyy-MM-dd');
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            sortable: false,
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
        <div style={{ height: 500, width: '100%' }}>
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
        </div>
    );
};

export default EmployeeTable;