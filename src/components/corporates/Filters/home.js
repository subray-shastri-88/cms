import React, { useState } from 'react';
import { TextField, Autocomplete } from '@mui/material';

const CorpFilter = ({ corporate, setCorporate }) => {
  const handleChange = (event, newValue) => {
    setCorporate(newValue);
  };
  const corporates = ['ENVY', 'UBER', 'OLA'];

  return (
    <Autocomplete
      value={corporate}
      id="size-small-standard"
      size="small"
      onChange={handleChange}
      options={corporates}
      renderInput={(params) => (
        <TextField size="small" {...params} label="Select Corporate" />
      )}
      sx={{ width: '250px', marginX: '2px' }}
    />
  );
};

export { CorpFilter };
