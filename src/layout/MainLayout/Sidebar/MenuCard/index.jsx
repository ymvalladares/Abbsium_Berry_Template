import PropTypes from 'prop-types';
import { memo } from 'react';

// material-ui
import { useTheme, alpha } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// assets
import TableChartOutlinedIcon from '@mui/icons-material/TableChartOutlined';

// ==============================|| PROGRESS BAR WITH LABEL ||============================== //

function LinearProgressWithLabel({ value, ...others }) {
  return (
    <Stack sx={{ gap: 1 }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', mt: 0.5 }}>
        <Typography
          variant="h6"
          sx={{
            color: '#3b82f6',
            fontWeight: 700
          }}
        >
          Usage
        </Typography>
        <Typography variant="h6" sx={{ color: 'inherit' }}>{`${Math.round(value)}%`}</Typography>
      </Stack>
      <LinearProgress
        aria-label="usage progress"
        variant="determinate"
        value={value}
        {...others}
        sx={{
          height: 8,
          mb: 2,
          borderRadius: 12,
          [`&.${linearProgressClasses.colorPrimary}`]: {
            bgcolor: alpha('#3b82f6', 0.1)
          },
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 10,
            background: 'linear-gradient(90deg, #3b82f6, #2563eb)'
          }
        }}
      />
    </Stack>
  );
}

// ==============================|| SIDEBAR - MENU CARD ||============================== //

function MenuCard() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      sx={{
        background: isDark
          ? 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.08) 100%)'
          : 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(37, 99, 235, 0.04) 100%)',
        border: `1px solid ${alpha('#3b82f6', isDark ? 0.2 : 0.12)}`,
        mb: 2.75,
        overflow: 'hidden',
        position: 'relative',
        borderRadius: '20px',
        boxShadow: isDark ? '0 8px 32px rgba(59, 130, 246, 0.15)' : '0 8px 32px rgba(59, 130, 246, 0.08)',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 120,
          height: 120,
          bgcolor: alpha('#3b82f6', 0.15),
          borderRadius: '50%',
          top: -50,
          right: -40,
          filter: 'blur(20px)'
        }
      }}
    >
      <Box sx={{ p: 2, position: 'relative', zIndex: 1 }}>
        <List disablePadding sx={{ pb: 1 }}>
          <ListItem alignItems="center" disableGutters disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemAvatar sx={{ mt: 1, minWidth: 'auto', mr: 1.5 }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: '12px',
                  color: '#3b82f6',
                  border: 'none',
                  bgcolor: alpha('#3b82f6', 0.15),
                  boxShadow: `0 4px 12px ${alpha('#3b82f6', 0.2)}`
                }}
              >
                <TableChartOutlinedIcon fontSize="small" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              sx={{ mt: 1, textAlign: 'left' }}
              primary={
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: isDark ? '#fff' : '#1e293b',
                    fontWeight: 800,
                    letterSpacing: '-0.01em'
                  }}
                >
                  Pro Features
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ display: 'block', mt: 0.25, lineHeight: 1.2, color: 'text.secondary' }}>
                  AI posts & more
                </Typography>
              }
            />
          </ListItem>
        </List>

        <Stack spacing={1} sx={{ mb: 1 }}>
          <LinearProgressWithLabel value={80} />
        </Stack>

        <Button
          fullWidth
          variant="contained"
          sx={{
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            color: '#fff',
            fontWeight: 700,
            mb: 1,
            py: 1,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '0.875rem',
            boxShadow: `0 4px 16px ${alpha('#3b82f6', 0.3)}`,
            '&:hover': {
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              boxShadow: `0 6px 24px ${alpha('#3b82f6', 0.4)}`
            }
          }}
        >
          View Plans →
        </Button>
      </Box>
    </Card>
  );
}

export default memo(MenuCard);

LinearProgressWithLabel.propTypes = { value: PropTypes.number, others: PropTypes.any };
