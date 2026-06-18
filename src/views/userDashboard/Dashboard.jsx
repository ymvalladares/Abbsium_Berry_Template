import { Box, Card, CardContent, Typography, Grid, Button, useTheme, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import BarChartIcon from '@mui/icons-material/BarChart';
import PublicIcon from '@mui/icons-material/Public';
import CreateIcon from '@mui/icons-material/Create';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BoltIcon from '@mui/icons-material/Bolt';
import { useAuth } from '../../contexts/AuthContext';

const StatsCard = ({ title, value, subtitle, trend, trendValue, iconBgColor, icon: Icon }) => {
  const theme = useTheme();
  const isPositive = trend === 'up';

  return (
    <Card
      sx={{
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        borderRadius: 3,
        bgcolor: 'background.paper'
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.45rem', md: '1.75rem' },
                color: 'text.heading',
                lineHeight: 1.1
              }}
            >
              {value}
            </Typography>

            <Typography sx={{ color: 'text.secondary', fontSize: '0.85rem', mt: 0.3 }}>{title}</Typography>

            <Typography sx={{ color: 'text.disabled', fontSize: '0.75rem', mt: 0.3 }}>{subtitle}</Typography>

            {trendValue && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.8 }}>
                {isPositive ? (
                  <TrendingUpIcon sx={{ fontSize: 15, color: 'success.main' }} />
                ) : (
                  <TrendingDownIcon sx={{ fontSize: 15, color: 'error.main' }} />
                )}
                <Typography
                  sx={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    color: isPositive ? 'success.main' : 'error.main'
                  }}
                >
                  {trendValue} this week
                </Typography>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              bgcolor: iconBgColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon sx={{ color: '#fff', fontSize: 21 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default function StatsCards() {
  const theme = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const cardsData = [
    {
      id: 1,
      value: '47',
      title: 'Scheduled Posts',
      subtitle: 'Ready to publish',
      trend: 'up',
      trendValue: '12%',
      iconBgColor: theme.vars.palette.primary.main,
      icon: BarChartIcon
    },
    {
      id: 2,
      value: '5',
      title: 'Connected Accounts',
      subtitle: 'Instagram, TikTok, X, FB, YT',
      trend: null,
      trendValue: null,
      iconBgColor: '#06b6d4',
      icon: PublicIcon
    },
    {
      id: 3,
      value: '156',
      title: 'Video Clips',
      subtitle: 'Generated this month',
      trend: 'up',
      trendValue: '28%',
      iconBgColor: theme.vars.palette.secondary.main,
      icon: BarChartIcon
    },
    {
      id: 4,
      value: '89.2K',
      title: 'Total Reach',
      subtitle: 'Cross-platform views',
      trend: 'up',
      trendValue: '34%',
      iconBgColor: theme.vars.palette.success.main,
      icon: TrendingUpIcon
    }
  ];

  return (
    <Box sx={{ py: 3, px: { xs: 2, md: 8 } }}>
      <Box sx={{ mb: 4 }}>
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: { xs: '1.5rem', md: '2rem' },
            color: 'text.heading'
          }}
        >
          Welcome back, {user?.userName || 'Creator'}
        </Typography>

        <Typography sx={{ color: 'text.secondary', mt: 0.5 }}>Your content performance at a glance.</Typography>
      </Box>

      <Grid container spacing={3}>
        {cardsData.map((card) => (
          <Grid key={card.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <StatsCard {...card} />
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mt: 5 }}>
        <Card
          sx={{
            borderRadius: 4,
            background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.12)})`,
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden'
          }}
        >
          <CardContent sx={{ p: { xs: 3, md: 5 } }}>
            <Grid container spacing={4} alignItems="center">
              <Grid size={{ xs: 12, md: 5 }} sx={{ display: { xs: 'none', md: 'block' } }}>
                <Box
                  sx={{
                    position: 'relative',
                    height: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 140,
                        height: 140,
                        background: `radial-gradient(circle, ${alpha(theme.palette.primary.main, 0.3)}, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(30px)',
                        animation: 'pulse 3s ease-in-out infinite',
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                          '50%': { opacity: 0.8, transform: 'scale(1.1)' }
                        }
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        width: 100,
                        height: 100,
                        background: `radial-gradient(circle, ${alpha(theme.palette.secondary.main, 0.3)}, transparent 70%)`,
                        borderRadius: '50%',
                        filter: 'blur(25px)',
                        animation: 'pulse2 3s ease-in-out infinite',
                        animationDelay: '0.5s',
                        '@keyframes pulse2': {
                          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
                          '50%': { opacity: 0.8, transform: 'scale(1.1)' }
                        }
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      position: 'relative',
                      zIndex: 10,
                      width: 96,
                      height: 96,
                      background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.secondary.main})`,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 20px 40px ${alpha(theme.palette.primary.main, 0.3)}`,
                      animation: 'float 4s ease-in-out infinite',
                      '@keyframes float': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-15px)' }
                      }
                    }}
                  >
                    <AutoAwesomeIcon sx={{ fontSize: 48, color: '#fff' }} />
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: '15%',
                      right: '20%',
                      width: 56,
                      height: 56,
                      background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 25px rgba(6,182,212,0.25)',
                      animation: 'float1 4s ease-in-out infinite',
                      animationDelay: '1s',
                      '@keyframes float1': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-15px)' }
                      }
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 28, color: '#fff' }} />
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: '20%',
                      left: '15%',
                      width: 56,
                      height: 56,
                      background: `linear-gradient(135deg, ${theme.vars.palette.secondary.main}, #ec4899)`,
                      borderRadius: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 10px 25px ${alpha(theme.palette.secondary.main, 0.25)}`,
                      animation: 'float2 4s ease-in-out infinite',
                      animationDelay: '2s',
                      '@keyframes float2': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-15px)' }
                      }
                    }}
                  >
                    <RocketLaunchIcon sx={{ fontSize: 28, color: '#fff' }} />
                  </Box>

                  <Box
                    sx={{
                      position: 'absolute',
                      top: '55%',
                      right: '10%',
                      width: 42,
                      height: 42,
                      background: `linear-gradient(135deg, ${theme.vars.palette.warning.main}, ${theme.vars.palette.warning.dark})`,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: `0 8px 20px ${alpha(theme.palette.warning.main, 0.25)}`,
                      animation: 'float3 4s ease-in-out infinite',
                      animationDelay: '1.5s',
                      '@keyframes float3': {
                        '0%, 100%': { transform: 'translateY(0px)' },
                        '50%': { transform: 'translateY(-15px)' }
                      }
                    }}
                  >
                    <BoltIcon sx={{ fontSize: 22, color: '#fff' }} />
                  </Box>
                </Box>
              </Grid>

              <Grid size={{ xs: 12, md: 7 }}>
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.5rem', md: '1.8rem' },
                    color: 'text.heading',
                    letterSpacing: '-0.02em',
                    lineHeight: 1.3,
                    mb: 1.5
                  }}
                >
                  Ready to create something amazing?
                </Typography>

                <Typography
                  sx={{
                    color: 'text.secondary',
                    fontSize: '0.95rem',
                    mb: 3,
                    lineHeight: 1.6
                  }}
                >
                  Start publishing content that matters across all your platforms.
                </Typography>

                <Box sx={{ mb: 3.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.secondary.main})`
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: 'text.primary' }}>AI-powered optimization for maximum reach</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #06b6d4, #3b82f6)'
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: 'text.primary' }}>Schedule posts across all your social networks</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${theme.vars.palette.secondary.main}, #ec4899)`
                      }}
                    />
                    <Typography sx={{ fontSize: '0.9rem', color: 'text.primary' }}>
                      Generate video clips automatically from your content
                    </Typography>
                  </Box>
                </Box>

                <Button
                  onClick={() => navigate('/platform/content/create-post')}
                  startIcon={<CreateIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    background: `linear-gradient(135deg, ${theme.vars.palette.primary.main}, ${theme.vars.palette.secondary.main})`,
                    color: '#fff',
                    textTransform: 'none',
                    boxShadow: `0 4px 14px ${alpha(theme.palette.primary.main, 0.4)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.vars.palette.primary.dark}, ${theme.vars.palette.secondary.dark})`,
                      boxShadow: `0 6px 20px ${alpha(theme.palette.primary.main, 0.5)}`,
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Create New Post
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
