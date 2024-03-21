import React from 'react';
import {
    TextField,
    Autocomplete,
} from '@mui/material';

export const StateList = ({ state, handleStateChange, allStates }) => {
    const handleChange = (event, newValue) => {
        handleStateChange(newValue);
    };

    return (
        <Autocomplete
            value={state}
            fullWidth
            onChange={handleChange}
            options={allStates}
            renderInput={(params) => (
                <TextField fullWidth {...params} label="State" />
            )}
        />
    );
};

export const CityList = ({ city, handleCityChange, allCities}) => {
    const handleChange = (event, newValue) => {
        handleCityChange(newValue);
    };

    return (
        <Autocomplete
            value={city}
            fullWidth
            onChange={handleChange}
            options={allCities}
            renderInput={(params) => (
                <TextField fullWidth {...params} label="City" />
            )}
        />
    );
};