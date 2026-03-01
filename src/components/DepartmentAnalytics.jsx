import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Collapse,
    IconButton,
} from '@mui/material';
import {
    People as PeopleIcon,
    AttachMoney as MoneyIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { employeeApi } from '../api/employeeApi';

const DepartmentAnalytics = ({ refreshKey }) => {
    const [analytics, setAnalytics] = useState([]);
    const [totalStats, setTotalStats] = useState({ count: 0, avgSalary: 0 });
    const [expanded, setExpanded] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, [refreshKey]);

    const fetchAnalytics = async () => {
        try {
            setLoading(true);
            const response = await employeeApi.getAllForExport();
            const allEmployees = response.data.content;

            // Calculate department-wise stats
            const deptMap = new Map();
            let totalSalary = 0;
            let salaryCount = 0;

            allEmployees.forEach(emp => {
                const dept = emp.department || 'Unassigned';
                if (!deptMap.has(dept)) {
                    deptMap.set(dept, { count: 0, totalSalary: 0, salaryCount: 0 });
                }
                const deptStats = deptMap.get(dept);
                deptStats.count++;
                if (emp.salary) {
                    deptStats.totalSalary += parseFloat(emp.salary);
                    deptStats.salaryCount++;
                    totalSalary += parseFloat(emp.salary);
                    salaryCount++;
                }
            });

            const deptAnalytics = Array.from(deptMap.entries()).map(([dept, stats]) => ({
                department: dept,
                employeeCount: stats.count,
                avgSalary: stats.salaryCount > 0 ? stats.totalSalary / stats.salaryCount : 0,
            })).sort((a, b) => b.employeeCount - a.employeeCount);

            setAnalytics(deptAnalytics);
            setTotalStats({
                count: allEmployees.length,
                avgSalary: salaryCount > 0 ? totalSalary / salaryCount : 0,
            });
        } catch (error) {
            console.error('Error fetching analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    if (loading) {
        return null;
    }

    return (
        <Box sx={{ mb: 3 }}>
            {/* Header with toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Department Analytics
                </Typography>
                <IconButton onClick={() => setExpanded(!expanded)} size="small">
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Grid container spacing={2}>
                    {/* Total Stats Card */}
                    <Grid item xs={12} sm={6} md={4} lg={3}>
                        <Card sx={{ 
                            bgcolor: 'primary.main', 
                            color: 'primary.contrastText',
                            height: '100%'
                        }}>
                            <CardContent>
                                <Typography variant="subtitle2" sx={{ opacity: 0.9 }}>
                                    All Departments
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <PeopleIcon sx={{ mr: 1 }} />
                                    <Typography variant="h4">
                                        {totalStats.count}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                    <MoneyIcon sx={{ mr: 1, fontSize: 18 }} />
                                    <Typography variant="body2">
                                        Avg: {formatCurrency(totalStats.avgSalary)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>

                    {/* Department Cards */}
                    {analytics.map((dept) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={dept.department}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary" noWrap>
                                        {dept.department}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
                                        <Typography variant="h5">
                                            {dept.employeeCount}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
                                            employees
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <MoneyIcon sx={{ mr: 1, fontSize: 18, color: 'success.main' }} />
                                        <Typography variant="body2" color="text.secondary">
                                            Avg: {formatCurrency(dept.avgSalary)}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Collapse>
        </Box>
    );
};

export default DepartmentAnalytics;
