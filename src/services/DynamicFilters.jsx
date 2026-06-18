import React from 'react';
import { Card, CardContent, Grid, Select, MenuItem, TextField, FormControl, Typography } from '@mui/material';

const DynamicFilters = ({ schema, filters, onChange, title = 'Filters' }) => {
  const update = (key, value) => {
    onChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <Card sx={{ borderRadius: 2, mb: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          {title}
        </Typography>

        <Grid container spacing={2}>
          {schema.map((f) => (
            <Grid key={f.key} size={{ xs: 12, sm: 6, md: 4 }}>
              {f.type === 'select' && (
                <FormControl fullWidth>
                  <Select value={filters[f.key] || ''} displayEmpty onChange={(e) => update(f.key, e.target.value)}>
                    <MenuItem value="">{f.placeholder || `All ${f.label}`}</MenuItem>
                    {f.options.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {f.type === 'text' && (
                <TextField
                  fullWidth
                  size="small"
                  placeholder={f.placeholder || f.label}
                  value={filters[f.key] || ''}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default DynamicFilters;
