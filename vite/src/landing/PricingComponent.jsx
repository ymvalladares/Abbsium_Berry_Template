import { Box } from '@mui/material';
import PriceCardsComp from './PriceCardsComp';

const PricingComponent = () => {
  return (
    <Box
      id="pricing"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #ffffff 0%, #f7f9ff 50%, #F1F5FE 100%)'
      }}
    >
      <PriceCardsComp />
    </Box>
  );
};

export default PricingComponent;
