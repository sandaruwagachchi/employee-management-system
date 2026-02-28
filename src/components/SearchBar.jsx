import React, { useState } from 'react';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

const SearchBar = ({ value, onChange, onSearch }) => {
    const [localValue, setLocalValue] = useState(value);

    const handleChange = (e) => {
        setLocalValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onChange(localValue);
            onSearch();
        }
    };

    const handleClear = () => {
        setLocalValue('');
        onChange('');
        onSearch();
    };

    return (
        <TextField
            value={localValue}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            placeholder="Search by name or department..."
            variant="outlined"
            size="small"
            sx={{ width: 300 }}
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
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