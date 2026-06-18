import PropTypes from 'prop-types';
import { memo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
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
            color: 'primary.800'
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
          height: 10,
          mb: 2,
          borderRadius: 30,
          [`&.${linearProgressClasses.colorPrimary}`]: {
            bgcolor: 'background.paper'
          },
          [`& .${linearProgressClasses.bar}`]: {
            borderRadius: 5,
            bgcolor: 'primary.dark'
          }
        }}
      />
    </Stack>
  );
}

// ==============================|| SIDEBAR - MENU CARD ||============================== //

function MenuCard() {
  const theme = useTheme();

  return (
    <Card
      sx={{
        bgcolor: 'primary.light',
        mb: 2.75,
        overflow: 'hidden',
        position: 'relative',
        '&:after': {
          content: '""',
          position: 'absolute',
          width: 157,
          height: 157,
          bgcolor: 'primary.200',
          borderRadius: '50%',
          top: -105,
          right: -96
        }
      }}
    >
      <Box sx={{ p: 2 }}>
        <List disablePadding sx={{ pb: 1 }}>
          <ListItem alignItems="center" disableGutters disablePadding sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemAvatar sx={{ mt: 1, minWidth: 'auto', mr: 1.5 }}>
              <Avatar
                variant="rounded"
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  color: 'primary.main',
                  border: 'none',
                  bgcolor: 'background.paper'
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
                    color: 'primary.800',
                    fontWeight: 700
                  }}
                >
                  Pro Features
                </Typography>
              }
              secondary={
                <Typography variant="caption" sx={{ display: 'block', mt: 0.25, lineHeight: 1.2 }}>
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
            bgcolor: 'primary.dark',
            color: '#fff',
            fontWeight: 600,
            mb: 1,
            py: 1,
            borderRadius: 2,
            textTransform: 'none',
            fontSize: '0.875rem',
            '&:hover': {
              bgcolor: 'primary.main'
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
