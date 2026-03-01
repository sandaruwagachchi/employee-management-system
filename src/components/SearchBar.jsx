import React, { useState, useEffect } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const SearchBar = ({ value, onChange }) => {
    const [localValue, setLocalValue] = useState(value || '');

    // Sync with external value
    useEffect(() => {
        setLocalValue(value || '');
    }, [value]);

    // Debounced search - triggers 300ms after user stops typing
    useEffect(() => {
        const timer = setTimeout(() => {
            onChange(localValue);
        }, 300);

        return () => clearTimeout(timer);
    }, [localValue, onChange]);

    const handleChange = (e) => {
        setLocalValue(e.target.value);
    };

    const handleClear = () => {
        setLocalValue('');
        onChange('');
    };

    return (
        <TextField
            value={localValue}
            onChange={handleChange}
            placeholder="Search by name or department..."
            variant="outlined"
            size="small"
            sx={{
                width: { xs: '100%', sm: 300 },
                minWidth: 200
            }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment> //search icon at the start of the input
                ),
                endAdornment: localValue && (
                    <InputAdornment position="end">
                        <IconButton size="small" onClick={handleClear}>
                            <ClearIcon />
                        </IconButton>
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchBar;