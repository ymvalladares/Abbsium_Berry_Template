import { useEffect, useRef, useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import UpgradePlanCard from './UpgradePlanCard';
import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useConfig from 'hooks/useConfig';

// assets
import User1 from 'assets/images/users/userAvatar.svg';
import { IconLogout, IconSearch, IconSettings, IconUser } from '@tabler/icons-react';

import { useAuth } from '../../../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProfileSection() {
  const navigate = useNavigate();
  const theme = useTheme();
  const {
    state: { borderRadius }
  } = useConfig();

  const [sdm, setSdm] = useState(true);
  const [value, setValue] = useState('');
  const [notification, setNotification] = useState(false);
  const [open, setOpen] = useState(false);

  const { user, logout, isAuthenticated } = useAuth();

  const anchorRef = useRef(null);

  const handleToggle = () => {
    setOpen((prev) => !prev);
  };

  const handleClose = (event) => {
    if (event && anchorRef.current?.contains(event.target)) return;
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleLogout = async () => {
    const result = await logout();
    if (result?.success) {
      navigate('/authenticate', { replace: true });
    }
  };

  const settingsOptions = () => {
    navigate('/platform/settings');
    setOpen(false);
  };

  // 🔒 Protección total al reload
  if (!isAuthenticated || !user) return null;

  return (
    <>
      <Chip
        slotProps={{ label: { sx: { lineHeight: 0 } } }}
        sx={{ ml: 2, height: '48px', alignItems: 'center', borderRadius: '27px' }}
        icon={
          <Avatar
            src={User1}
            alt="user-images"
            sx={{
              typography: 'mediumAvatar',
              margin: '8px 0 8px 8px !important',
              cursor: 'pointer'
            }}
            ref={anchorRef}
            aria-controls={open ? 'menu-list-grow' : undefined}
            aria-haspopup="true"
            color="inherit"
          />
        }
        label={<IconSettings stroke={1.5} size="24px" />}
        ref={anchorRef}
        onClick={handleToggle}
        color="primary"
        aria-label="user-account"
      />

      <Popper
        placement="bottom"
        open={open}
        anchorEl={anchorRef.current}
        transition
        disablePortal
        modifiers={[
          {
            name: 'offset',
            options: { offset: [0, 14] }
          }
        ]}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                  <Box sx={{ p: 2, pb: 0 }}>
                    <Stack>
                      <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
                        <Typography variant="h4">Good Morning,</Typography>
                        <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                          {user.userName}
                        </Typography>
                      </Stack>

                      <Typography variant="subtitle2">{user.rol}</Typography>
                    </Stack>

                    <OutlinedInput
                      sx={{ width: '100%', pr: 1, pl: 2, my: 2 }}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                      placeholder="Search profile options"
                      startAdornment={
                        <InputAdornment position="start">
                          <IconSearch stroke={1.5} size="16px" />
                        </InputAdornment>
                      }
                    />
                    <Divider />
                  </Box>

                  <Box sx={{ p: 2, maxHeight: 'calc(100vh - 250px)', overflowX: 'hidden' }}>
                    <UpgradePlanCard />
                    <Divider />

                    <Card sx={{ bgcolor: 'primary.light', my: 2 }}>
                      <CardContent>
                        <Stack gap={3}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1">Start DND Mode</Typography>
                            <Switch checked={sdm} onChange={(e) => setSdm(e.target.checked)} size="small" />
                          </Stack>

                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="subtitle1">Allow Notifications</Typography>
                            <Switch checked={notification} onChange={(e) => setNotification(e.target.checked)} size="small" />
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>

                    <Divider />

                    <List sx={{ minWidth: 300 }}>
                      <ListItemButton onClick={settingsOptions} sx={{ borderRadius }}>
                        <ListItemIcon>
                          <IconSettings size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Account Settings" />
                      </ListItemButton>

                      <ListItemButton onClick={handleLogout} sx={{ borderRadius }}>
                        <ListItemIcon>
                          <IconLogout size={20} />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </ListItemButton>
                    </List>
                  </Box>
                </MainCard>
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
}
