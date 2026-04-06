import React from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';
import PriceCardsComp from './PriceCardsComp';

const PricingComponent = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}
    >
      <PriceCardsComp />
    </Box>
  );
};

export default PricingComponent;
