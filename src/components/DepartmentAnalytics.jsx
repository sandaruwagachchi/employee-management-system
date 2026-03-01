import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Collapse,
    IconButton,
    Chip,
    LinearProgress,
    Paper,
} from '@mui/material';
import {
    AttachMoney as MoneyIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    Business as BusinessIcon,
} from '@mui/icons-material';
import { employeeApi } from '../api/employeeApi';

// Color palette for department cards
const departmentColors = [
    { bg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', light: '#667eea' },
    { bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', light: '#f5576c' },
    { bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', light: '#4facfe' },
    { bg: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', light: '#43e97b' },
    { bg: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', light: '#fa709a' },
    { bg: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', light: '#a8edea' },
];

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

    const maxEmployees = Math.max(...analytics.map(d => d.employeeCount), 1);

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                p: { xs: 1.5, sm: 2 },
                borderRadius: 3,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                width: '100%',
            }}
        >
            {/* Header with toggle */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BusinessIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
                    Department Analytics
                </Typography>
                <Chip
                    label={`${analytics.length} Departments`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ mr: 1 }}
                />
                <IconButton onClick={() => setExpanded(!expanded)} size="small">
                    {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: {
                        xs: 'repeat(2, 1fr)',
                        lg: 'repeat(4, 1fr)'
                    },
                    gap: 2
                }}>
                    {/* Total Stats Card */}
                    <Box>
                        <Card
                            sx={{
                                height: '100%',
                                borderRadius: 2,
                                boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                minHeight: { xs: 'auto', sm: 160 },
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                                },
                                overflow: 'hidden',
                            }}
                        >
                            {/* Colored top bar */}
                            <Box sx={{ height: 4, background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)' }} />
                            <CardContent sx={{ p: 2.5 }}>
                                <Typography
                                    variant="subtitle1"
                                    sx={{
                                        fontWeight: 600,
                                        color: 'text.primary',
                                        mb: 1.5,
                                    }}
                                    noWrap
                                >
                                    Total Workforce
                                </Typography>

                                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#1976d2' }}>
                                        {totalStats.count}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        employees
                                    </Typography>
                                </Box>

                                {/* Progress bar placeholder for consistent height */}
                                <LinearProgress
                                    variant="determinate"
                                    value={100}
                                    sx={{
                                        height: 6,
                                        borderRadius: 3,
                                        mb: 1.5,
                                        bgcolor: 'grey.100',
                                        '& .MuiLinearProgress-bar': {
                                            background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                            borderRadius: 3,
                                        }
                                    }}
                                />

                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    bgcolor: 'grey.50',
                                    borderRadius: 1,
                                    px: 1,
                                    py: 0.5,
                                }}>
                                    <MoneyIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Avg: {formatCurrency(totalStats.avgSalary)}
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>

                    {/* Department Cards */}
                    {analytics.map((dept, index) => {
                        const colorScheme = departmentColors[index % departmentColors.length];
                        const percentage = (dept.employeeCount / maxEmployees) * 100;

                        return (
                            <Box key={dept.department}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        borderRadius: 2,
                                        boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                                        transition: 'transform 0.2s, box-shadow 0.2s',
                                        minHeight: { xs: 'auto', sm: 160 },
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                                        },
                                        overflow: 'hidden',
                                    }}
                                >
                                    {/* Colored top bar */}
                                    <Box sx={{ height: 4, background: colorScheme.bg }} />
                                    <CardContent sx={{ p: 2.5 }}>
                                        <Typography
                                            variant="subtitle1"
                                            sx={{
                                                fontWeight: 600,
                                                color: 'text.primary',
                                                mb: 1.5,
                                            }}
                                            noWrap
                                        >
                                            {dept.department}
                                        </Typography>

                                        <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 1 }}>
                                            <Typography variant="h4" sx={{ fontWeight: 700, color: colorScheme.light }}>
                                                {dept.employeeCount}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                                employees
                                            </Typography>
                                        </Box>

                                        {/* Progress bar showing relative size */}
                                        <LinearProgress
                                            variant="determinate"
                                            value={percentage}
                                            sx={{
                                                height: 6,
                                                borderRadius: 3,
                                                mb: 1.5,
                                                bgcolor: 'grey.100',
                                                '& .MuiLinearProgress-bar': {
                                                    background: colorScheme.bg,
                                                    borderRadius: 3,
                                                }
                                            }}
                                        />

                                        <Box sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            bgcolor: 'grey.50',
                                            borderRadius: 1,
                                            px: 1,
                                            py: 0.5,
                                        }}>
                                            <MoneyIcon sx={{ fontSize: 16, color: 'success.main', mr: 0.5 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Avg: {formatCurrency(dept.avgSalary)}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Box>
                        );
                    })}
                </Box>
            </Collapse>
        </Paper>
    );
};

export default DepartmentAnalytics;
