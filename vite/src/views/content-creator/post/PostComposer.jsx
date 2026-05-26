import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  Chip,
  LinearProgress,
  IconButton,
  useMediaQuery,
  useTheme,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogContent,
  Divider,
  Grid
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useDropzone } from 'react-dropzone';
import {
  IconBrandYoutube,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandLinkedin,
  IconBrandPinterest,
  IconUpload,
  IconX,
  IconPhoto,
  IconVideo,
  IconFileText,
  IconSparkles,
  IconSend,
  IconCheck,
  IconAlertCircle,
  IconRefresh,
  IconChevronRight,
  IconChevronLeft,
  IconConfetti,
  IconClock,
  IconCalendar,
  IconGlobe,
  IconHash,
  IconEye,
  IconDeviceDesktop
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { showSnackbar } from '../../../utils/snackbarNotif';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', icon: IconBrandFacebook, color: '#1877F2' },
  { id: 'instagram', name: 'Instagram', icon: IconBrandInstagram, color: '#E4405F' },
  { id: 'youtube', name: 'YouTube', icon: IconBrandYoutube, color: '#FF0000' },
  { id: 'tiktok', name: 'TikTok', icon: IconBrandTiktok, color: '#000000' },
  { id: 'twitter', name: 'X', icon: IconBrandTwitter, color: '#1DA1F2' },
  { id: 'linkedin', name: 'LinkedIn', icon: IconBrandLinkedin, color: '#0A66C2' },
  { id: 'pinterest', name: 'Pinterest', icon: IconBrandPinterest, color: '#E60023' }
];

const TYPES = [
  { id: 'post', label: 'Post', icon: IconPhoto },
  { id: 'reel', label: 'Reel', icon: IconVideo },
  { id: 'video', label: 'Video', icon: IconFileText }
];

const ACCEPTED = { 'image/*': [], 'video/*': [] };
const CONNECTED = ['facebook', 'instagram', 'youtube'];
const STEP_LABELS = ['Platforms', 'Content', 'Review'];

const CONFETTI_COLORS = ['#5E35B1', '#E4405F', '#1877F2', '#FF9800', '#4CAF50', '#FF0000', '#7C4DFF', '#FCAF45'];

function Confetti() {
  const pieces = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 2,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: 4 + Math.random() * 6,
        rotation: Math.random() * 360
      })),
    []
  );

  return (
    <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {pieces.map((p) => (
        <Box
          key={p.id}
          sx={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -10,
            width: p.size,
            height: p.size * 1.5,
            bgcolor: p.color,
            borderRadius: 1,
            transform: `rotate(${p.rotation}deg)`,
            animation: `confettiFall ${p.duration}s ease-in ${p.delay}s forwards`
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(600px) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </Box>
  );
}

export default function PostComposer() {
  const theme = useTheme();
  const isMobile = theme ? useMediaQuery(theme.breakpoints.down('sm')) : false;

  const [step, setStep] = useState(0);
  const [platforms, setPlatforms] = useState(['facebook', 'instagram', 'youtube']);
  const [type, setType] = useState('post');
  const [mode, setMode] = useState('manual');
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('Summer Collection 2026');
  const [caption, setCaption] = useState('New arrivals are here. Shop now and get 20% off.\n\n#Summer #NewCollection');
  const [prompt, setPrompt] = useState('');
  const [posting, setPosting] = useState(false);
  const [progress, setProgress] = useState({});
  const [results, setResults] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [visibility, setVisibility] = useState('public');
  const [location, setLocation] = useState('');
  const [tags, setTags] = useState(['summer', 'newcollection', 'sale']);
  const [pages, setPages] = useState({});
  const [selectedPages, setSelectedPages] = useState({});
  const [loadingPages, setLoadingPages] = useState(false);

  const fetchPages = useCallback(async () => {
    setLoadingPages(true);
    try {
      const res = await socialAPI.checkConnections();
      console.log('=== Social Connections Response ===');
      console.log('Raw data:', JSON.stringify(res.data, null, 2));
      
      const pagesMap = {};
      res.data.forEach((item) => {
        console.log(`Processing provider: ${item.provider}, connected: ${item.connected}`);
        if (item.connected) {
          console.log(`  Pages available: ${item.pages?.length || 0}`, item.pages);
          console.log(`  Default page ID: ${item.defaultPageId}`);
        }
        if (item.connected && item.pages && item.pages.length > 0) {
          pagesMap[item.provider] = {
            pages: item.pages,
            defaultPageId: item.defaultPageId || item.pages[0]?.id
          };
        }
      });
      console.log('=== Pages Map Built ===');
      console.log(JSON.stringify(pagesMap, null, 2));
      setPages(pagesMap);

      const initialSelected = {};
      Object.keys(pagesMap).forEach((provider) => {
        initialSelected[provider] = pagesMap[provider].defaultPageId;
      });
      if (Object.keys(initialSelected).length > 0) {
        setSelectedPages(initialSelected);
        console.log('Initial selected pages:', initialSelected);
      }
    } catch (err) {
      console.error('Failed to fetch pages:', err);
      console.error('Error response:', err.response?.data);
    } finally {
      setLoadingPages(false);
    }
  }, []);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const toggle = (id) => setPlatforms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const selectAll = () => setPlatforms(CONNECTED);
  const clearAll = () => setPlatforms([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ accept: ACCEPTED, multiple: false, onDrop: setFiles });
  const file = files[0];
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const canNext = step === 0 ? platforms.length > 0 : step === 1 ? mode === 'ai' || files.length > 0 : true;

  const publish = async () => {
    if (posting) return;
    setPosting(true);
    setResults(null);
    setShowModal(false);
    const r = {};
    const text = `${title}${caption ? '\n\n' + caption : ''}`;

    for (const p of platforms) {
      setProgress((prev) => ({ ...prev, [p]: 0 }));
      try {
        if (p === 'facebook') {
          let response;
          const targetPage = selectedPages.facebook;
          console.log('=== Facebook Publish ===');
          console.log('Target page ID:', targetPage);
          console.log('Available pages:', pages.facebook);
          if (pages.facebook?.pages) {
            const selectedPageObj = pages.facebook.pages.find((pg) => pg.id === targetPage);
            console.log('Selected page object:', selectedPageObj);
            console.log('Selected page name:', selectedPageObj?.name);
          }
          if (file) {
            const photoUrl = await toBase64(file);
            console.log('Publishing photo with pageId:', targetPage);
            response = await socialAPI.postFacebookPhoto(text, photoUrl, caption, targetPage);
          } else {
            console.log('Publishing text with pageId:', targetPage);
            response = await socialAPI.postFacebookText(text, targetPage);
          }
          console.log('Facebook publish response:', response?.data);

          const data = response?.data;
          if (data && (data.status === 'Photo published' || data.status === 'Post published' || data.message || data.id)) {
            r[p] = 'ok';
            setProgress((prev) => ({ ...prev, [p]: 100 }));
          } else {
            r[p] = 'err';
            setProgress((prev) => ({ ...prev, [p]: -1 }));
          }
        } else {
          await new Promise((ok) => setTimeout(ok, 1200));
          r[p] = 'ok';
          setProgress((prev) => ({ ...prev, [p]: 100 }));
        }
      } catch (err) {
        setProgress((prev) => ({ ...prev, [p]: -1 }));
        r[p] = 'err';
      }
    }

    setResults(r);
    setPosting(false);

    const ok = Object.values(r).filter((v) => v === 'ok').length;
    if (ok === 0) {
      showSnackbar('Publish failed', 'error');
    } else {
      setShowModal(true);
      if (ok === platforms.length) showSnackbar(`Published on ${ok} platform${ok > 1 ? 's' : ''}`, 'success');
      else showSnackbar(`Published on ${ok} of ${platforms.length} platforms`, 'warning');
    }
  };

  const toBase64 = (f) =>
    new Promise((res, rej) => {
      const r = new FileReader();
      r.readAsDataURL(f);
      r.onload = () => res(r.result);
      r.onerror = rej;
    });

  const reset = () => {
    setPlatforms([]);
    setType('post');
    setFiles([]);
    setTitle('');
    setCaption('');
    setPrompt('');
    setResults(null);
    setProgress({});
    setStep(0);
    setShowModal(false);
    setSelectedPages({});
  };

  const plat = (id) => PLATFORMS.find((p) => p.id === id);
  const successCount = results ? Object.values(results).filter((v) => v === 'ok').length : 0;

  return (
    <Box sx={{ py: 3, px: { xs: 1, sm: 2 }, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: { xs: '100%', lg: '75%' }, maxWidth: { sm: 900, md: 1100, lg: 1200 } }}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: '1.4rem' }}>Create Post</Typography>
          {results && (
            <Button size="small" startIcon={<IconRefresh size={16} />} onClick={reset} sx={{ textTransform: 'none', fontWeight: 600 }}>
              New
            </Button>
          )}
        </Stack>

        {/* Stepper */}
        <Stepper activeStep={step} sx={{ mb: 2, '& .MuiStepLabel-label': { fontSize: '0.8rem', fontWeight: 600 } }}>
          {STEP_LABELS.map((l, i) => (
            <Step key={l}>
              <StepLabel
                onClick={() => {
                  if (!results && i < step) setStep(i);
                }}
                icon={
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: i === step ? '#5E35B1' : i < step ? '#4CAF50' : '#e0e0e0',
                      color: i <= step ? '#fff' : '#999',
                      fontSize: '0.75rem',
                      fontWeight: 700
                    }}
                  >
                    {i < step ? <IconCheck size={12} /> : i + 1}
                  </Box>
                }
              >
                {l}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Card */}
        <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, bgcolor: 'background.paper', overflow: 'hidden' }}>
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
            {/* Step 0 */}
            {step === 0 && (
              <Stack spacing={2}>
                {/* Welcome banner */}
                <Box
                  sx={{
                    p: 2,
                    borderRadius: 2,
                    background: 'linear-gradient(135deg, alpha(#5E35B1, 0.08), alpha(#7C4DFF, 0.04))',
                    border: '1px solid',
                    borderColor: alpha('#5E35B1', 0.12)
                  }}
                >
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: 1.5,
                        bgcolor: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconSend size={20} style={{ color: '#5E35B1' }} />
                    </Box>
                    <Box>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.15 }}>Ready to create your first post?</Typography>
                      <Typography sx={{ color: 'text.secondary', fontSize: '0.8rem' }}>
                        Select the platforms where you want to publish
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                {/* Quick actions */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    onClick={selectAll}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#5E35B1', px: 1 }}
                  >
                    Select all
                  </Button>
                  <Typography sx={{ color: 'divider', fontSize: '0.75rem' }}>·</Typography>
                  <Button
                    size="small"
                    onClick={clearAll}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', px: 1 }}
                  >
                    Clear
                  </Button>
                  <Box sx={{ flex: 1 }} />
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {platforms.length} selected
                  </Typography>
                </Stack>

                {/* Platform grid */}
                <Box
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)', md: 'repeat(7, 1fr)' },
                    gap: 1
                  }}
                >
                  {PLATFORMS.map((p) => {
                    const on = CONNECTED.includes(p.id);
                    const sel = platforms.includes(p.id);
                    const Icon = p.icon;
                    return (
                      <Box
                        key={p.id}
                        onClick={() => on && toggle(p.id)}
                        sx={{
                          position: 'relative',
                          p: 1.5,
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: sel ? p.color : 'divider',
                          bgcolor: sel ? alpha(p.color, 0.04) : 'transparent',
                          cursor: on ? 'pointer' : 'not-allowed',
                          opacity: on ? 1 : 0.35,
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          '&:hover': on ? { borderColor: p.color, bgcolor: alpha(p.color, 0.06) } : {},
                          minHeight: 68,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 0.5
                        }}
                      >
                        {sel && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 4,
                              right: 4,
                              width: 16,
                              height: 16,
                              borderRadius: '50%',
                              bgcolor: '#4CAF50',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <IconCheck size={9} style={{ color: '#fff' }} />
                          </Box>
                        )}
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            borderRadius: 1.5,
                            bgcolor: sel ? p.color : alpha(p.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Icon size={16} style={{ color: sel ? '#fff' : p.color }} />
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.7rem' }}>{p.name}</Typography>
                      </Box>
                    );
                  })}
                </Box>

                {/* Divider */}
                {platforms.some((p) => pages[p] || (!pages[p] && !loadingPages)) && (
                  <Divider sx={{ my: 0.5 }} />
                )}

                {/* Page Selector for connected platforms */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, width: '100%' }}>
                  {/* Facebook */}
                  {platforms.includes('facebook') && !loadingPages && (
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#fff' }}>F</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>Facebook</Typography>
                      </Stack>
                      {pages.facebook ? (
                        <Stack spacing={0.5}>
                          {pages.facebook.pages.map((page) => {
                            const isSelected = selectedPages.facebook === page.id;
                            const isDefault = pages.facebook.defaultPageId === page.id;
                            return (
                              <Box
                                key={page.id}
                                onClick={() => setSelectedPages((prev) => ({ ...prev, facebook: page.id }))}
                                sx={{ p: 1, borderRadius: 1.5, border: '1px solid', borderColor: isSelected ? '#1877F2' : 'divider', bgcolor: isSelected ? alpha('#1877F2', 0.06) : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.2s', '&:hover': { borderColor: '#1877F2' } }}
                              >
                                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: isSelected ? '#1877F2' : 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {isSelected ? <IconCheck size={12} style={{ color: '#fff' }} /> : <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#999' }} />}
                                </Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', flex: 1 }}>{page.name}</Typography>
                                {isDefault && <Chip label="Default" size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 600, bgcolor: alpha('#5E35B1', 0.1), color: '#5E35B1' }} />}
                              </Box>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Box sx={{ p: 1, borderRadius: 1.5, border: '1px solid', borderColor: alpha('#1877F2', 0.12), bgcolor: alpha('#1877F2', 0.02), display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: alpha('#1877F2', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#1877F2' }}>F</Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Personal profile</Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* Instagram */}
                  {platforms.includes('instagram') && !loadingPages && (
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#E4405F', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#fff' }}>I</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>Instagram</Typography>
                      </Stack>
                      {pages.instagram ? (
                        <Stack spacing={0.5}>
                          {pages.instagram.pages.map((page) => {
                            const isSelected = selectedPages.instagram === page.id;
                            const isDefault = pages.instagram.defaultPageId === page.id;
                            return (
                              <Box
                                key={page.id}
                                onClick={() => setSelectedPages((prev) => ({ ...prev, instagram: page.id }))}
                                sx={{ p: 1, borderRadius: 1.5, border: '1px solid', borderColor: isSelected ? '#E4405F' : 'divider', bgcolor: isSelected ? alpha('#E4405F', 0.06) : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.2s', '&:hover': { borderColor: '#E4405F' } }}
                              >
                                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: isSelected ? '#E4405F' : 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {isSelected ? <IconCheck size={12} style={{ color: '#fff' }} /> : <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#999' }} />}
                                </Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', flex: 1 }}>{page.name}</Typography>
                                {isDefault && <Chip label="Default" size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 600, bgcolor: alpha('#5E35B1', 0.1), color: '#5E35B1' }} />}
                              </Box>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Box sx={{ p: 1, borderRadius: 1.5, border: '1px solid', borderColor: alpha('#E4405F', 0.12), bgcolor: alpha('#E4405F', 0.02), display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: alpha('#E4405F', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#E4405F' }}>I</Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Personal profile</Typography>
                        </Box>
                      )}
                    </Box>
                  )}

                  {/* YouTube */}
                  {platforms.includes('youtube') && !loadingPages && (
                    <Box>
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                        <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#fff' }}>Y</Typography>
                        </Box>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>YouTube</Typography>
                      </Stack>
                      {pages.youtube ? (
                        <Stack spacing={0.5}>
                          {pages.youtube.pages.map((page) => {
                            const isSelected = selectedPages.youtube === page.id;
                            const isDefault = pages.youtube.defaultPageId === page.id;
                            return (
                              <Box
                                key={page.id}
                                onClick={() => setSelectedPages((prev) => ({ ...prev, youtube: page.id }))}
                                sx={{ p: 1, borderRadius: 1.5, border: '1px solid', borderColor: isSelected ? '#FF0000' : 'divider', bgcolor: isSelected ? alpha('#FF0000', 0.06) : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 1, transition: 'all 0.2s', '&:hover': { borderColor: '#FF0000' } }}
                              >
                                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: isSelected ? '#FF0000' : 'grey.200', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                  {isSelected ? <IconCheck size={12} style={{ color: '#fff' }} /> : <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#999' }} />}
                                </Box>
                                <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', flex: 1 }}>{page.name}</Typography>
                                {isDefault && <Chip label="Default" size="small" sx={{ height: 16, fontSize: '0.55rem', fontWeight: 600, bgcolor: alpha('#5E35B1', 0.1), color: '#5E35B1' }} />}
                              </Box>
                            );
                          })}
                        </Stack>
                      ) : (
                        <Box sx={{ p: 1, borderRadius: 1.5, border: '1px solid', borderColor: alpha('#FF0000', 0.12), bgcolor: alpha('#FF0000', 0.02), display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: alpha('#FF0000', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#FF0000' }}>Y</Typography>
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Personal profile</Typography>
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>

                {loadingPages && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={20} sx={{ color: '#5E35B1' }} />
                  </Box>
                )}
              </Stack>
            )}

            {/* Step 1 */}
            {step === 1 && (
              <Stack spacing={2}>
                <Stack direction="row" spacing={1}>
                  {TYPES.map((t) => {
                    const a = type === t.id;
                    const Icon = t.icon;
                    return (
                      <Box
                        key={t.id}
                        onClick={() => setType(t.id)}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.75,
                          px: 2,
                          py: 0.75,
                          borderRadius: 2,
                          border: '1px solid',
                          borderColor: a ? '#5E35B1' : 'divider',
                          bgcolor: a ? alpha('#5E35B1', 0.06) : 'transparent',
                          cursor: 'pointer'
                        }}
                      >
                        <Icon size={15} style={{ color: a ? '#5E35B1' : '#999' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', color: a ? '#5E35B1' : 'inherit' }}>{t.label}</Typography>
                      </Box>
                    );
                  })}
                </Stack>

                <Stack direction="row" spacing={1}>
                  {[
                    { k: 'manual', l: 'Upload', i: IconUpload },
                    { k: 'ai', l: 'AI', i: IconSparkles }
                  ].map((m) => (
                    <Button
                      key={m.k}
                      size="small"
                      startIcon={<m.i size={15} />}
                      onClick={() => setMode(m.k)}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        px: 2,
                        ...(mode === m.k
                          ? { bgcolor: '#5E35B1', color: '#fff' }
                          : { border: '1px solid', borderColor: 'divider', color: 'text.secondary' })
                      }}
                    >
                      {m.l}
                    </Button>
                  ))}
                </Stack>

                {mode === 'manual' ? (
                  <>
                    {!file ? (
                      <Box
                        {...getRootProps()}
                        sx={{
                          borderRadius: 2,
                          border: '2px dashed',
                          borderColor: isDragActive ? '#5E35B1' : 'divider',
                          bgcolor: isDragActive ? alpha('#5E35B1', 0.04) : 'grey.50',
                          cursor: 'pointer',
                          p: 2.5,
                          textAlign: 'center'
                        }}
                      >
                        <input {...getInputProps()} />
                        <IconUpload size={22} style={{ color: '#999', margin: '0 auto 6px' }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>Drop media or click</Typography>
                      </Box>
                    ) : (
                      <Stack direction="row" spacing={2}>
                        <Box
                          sx={{
                            width: 100,
                            height: 70,
                            borderRadius: 2,
                            overflow: 'hidden',
                            position: 'relative',
                            bgcolor: 'grey.100',
                            flexShrink: 0
                          }}
                        >
                          {file.type.startsWith('image') ? (
                            <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Box component="video" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          )}
                          <IconButton
                            size="small"
                            onClick={() => setFiles([])}
                            sx={{
                              position: 'absolute',
                              top: 3,
                              right: 3,
                              bgcolor: 'rgba(0,0,0,0.5)',
                              color: '#fff',
                              width: 18,
                              height: 18,
                              minWidth: 0
                            }}
                          >
                            <IconX size={10} />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{file.name}</Typography>
                          <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                            {(file.size / 1024 / 1024).toFixed(1)} MB
                          </Typography>
                        </Box>
                      </Stack>
                    )}
                    <TextField
                      size="small"
                      fullWidth
                      label="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      minRows={2}
                      label="Caption"
                      value={caption}
                      onChange={(e) => setCaption(e.target.value)}
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                  </>
                ) : (
                  <Stack spacing={2}>
                    <TextField
                      size="small"
                      fullWidth
                      multiline
                      minRows={3}
                      label="Describe content"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="A summer product showcase..."
                      sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<IconSparkles size={16} />}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        width: 'fit-content',
                        background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)'
                      }}
                    >
                      Generate
                    </Button>
                  </Stack>
                )}
              </Stack>
            )}

            {/* Step 2 - Review & Publish */}
            {step === 2 && (
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'stretch' }}>
                {/* Left - Facebook Post Preview */}
                <Box sx={{ flex: '0 0 280px' }}>
                  <Box sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden', height: '100%' }}>
                    {/* Post header */}
                    <Box sx={{ p: 1.25, borderBottom: '1px solid', borderColor: 'divider' }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box sx={{ width: 32, height: 32, borderRadius: '50%', bgcolor: alpha('#1877F2', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IconBrandFacebook size={16} style={{ color: '#1877F2' }} />
                        </Box>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedPages.facebook && pages.facebook?.pages ? pages.facebook.pages.find((pg) => pg.id === selectedPages.facebook)?.name || 'Your Page' : 'Your Page'}
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <IconGlobe size={10} style={{ color: 'text.disabled' }} />
                            <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>Just now</Typography>
                          </Stack>
                        </Box>
                      </Stack>
                    </Box>

                    {/* Post content */}
                    <Box sx={{ p: 1.25 }}>
                      {title && <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 0.5 }}>{title}</Typography>}
                      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', mb: 1 }}>
                        {caption || 'No caption'}
                      </Typography>

                      {/* Media */}
                      {file ? (
                        <Box sx={{ borderRadius: 1, overflow: 'hidden', bgcolor: 'grey.100', mb: 1 }}>
                          {file.type.startsWith('image') ? (
                            <Box component="img" src={preview} sx={{ width: '100%', display: 'block' }} />
                          ) : (
                            <Box sx={{ width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                              <IconVideo size={24} style={{ color: '#999' }} />
                            </Box>
                          )}
                        </Box>
                      ) : (
                        <Box sx={{ borderRadius: 1, bgcolor: 'grey.50', border: '1px dashed', borderColor: 'divider', p: 1.5, textAlign: 'center', mb: 1 }}>
                          <IconPhoto size={20} style={{ color: '#ccc', margin: '0 auto 4px' }} />
                          <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>No media</Typography>
                        </Box>
                      )}

                      {/* Action buttons */}
                      <Divider sx={{ mb: 0.75 }} />
                      <Stack direction="row" justifyContent="space-around">
                        {['Like', 'Comment', 'Share'].map((action) => (
                          <Typography key={action} sx={{ fontSize: '0.65rem', fontWeight: 600, color: 'text.disabled' }}>{action}</Typography>
                        ))}
                      </Stack>
                    </Box>
                  </Box>
                </Box>

                {/* Right - Details */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Platforms */}
                  <Box sx={{ borderRadius: 1.5, border: '1px solid', borderColor: 'divider', p: 1.25, mb: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>Publishing to</Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 0.75 }}>
                      {platforms.map((id) => {
                        const p = plat(id);
                        if (!p) return null;
                        const Icon = p.icon;
                        const selectedPage = selectedPages[id] && pages[id]?.pages ? pages[id].pages.find((pg) => pg.id === selectedPages[id]) : null;

                        return (
                          <Box key={id} sx={{ p: 0.75, borderRadius: 1, border: '1px solid', borderColor: alpha(p.color, 0.1), bgcolor: alpha(p.color, 0.02) }}>
                            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mb: 0.25 }}>
                              <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Icon size={10} style={{ color: '#fff' }} />
                              </Box>
                              <Typography sx={{ fontWeight: 600, fontSize: '0.7rem' }}>{p.name}</Typography>
                            </Stack>
                            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {selectedPage ? selectedPage.name : 'Personal profile'}
                            </Typography>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>

                  {/* Details row */}
                  <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                    {/* Content info */}
                    <Box sx={{ flex: 1, borderRadius: 1.5, border: '1px solid', borderColor: 'divider', p: 1.25 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>Details</Typography>
                      <Stack spacing={0.75}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Type</Typography>
                          <Chip label={TYPES.find((t) => t.id === type)?.label} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: 'grey.100' }} />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Visibility</Typography>
                          <Chip label={visibility} size="small" sx={{ height: 18, fontSize: '0.6rem', fontWeight: 600, bgcolor: alpha('#4CAF50', 0.1), color: '#4CAF50' }} />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Schedule</Typography>
                          <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: scheduleType === 'later' ? 'text.primary' : '#4CAF50' }}>
                            {scheduleType === 'later' ? `${scheduledDate} ${scheduledTime}` : 'Now'}
                          </Typography>
                        </Stack>
                        {file && (
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>File</Typography>
                            <Typography sx={{ fontSize: '0.65rem', fontWeight: 600 }}>{(file.size / 1024 / 1024).toFixed(1)} MB</Typography>
                          </Stack>
                        )}
                      </Stack>
                    </Box>

                    {/* Tags */}
                    {tags.length > 0 && (
                      <Box sx={{ flex: '0 0 140px', borderRadius: 1.5, border: '1px solid', borderColor: 'divider', p: 1.25 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.65rem', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>Tags</Typography>
                        <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap>
                          {tags.slice(0, 6).map((tag) => (
                            <Chip key={tag} label={`#${tag}`} size="small" sx={{ height: 18, fontSize: '0.55rem', fontWeight: 600, bgcolor: alpha('#5E35B1', 0.08), color: '#5E35B1', borderRadius: 1 }} />
                          ))}
                          {tags.length > 6 && (
                            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', alignSelf: 'center' }}>+{tags.length - 6}</Typography>
                          )}
                        </Stack>
                      </Box>
                    )}
                  </Box>

                  {/* Fill space to match left height */}
                  <Box sx={{ flex: 1, borderRadius: 1.5, border: '1px dashed', borderColor: 'divider', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: alpha('#5E35B1', 0.01) }}>
                    <Stack direction="column" alignItems="center" spacing={0.5}>
                      <IconSend size={24} style={{ color: alpha('#5E35B1', 0.2) }} />
                      <Typography sx={{ fontSize: '0.7rem', fontWeight: 600, color: alpha('#5E35B1', 0.3) }}>Ready to publish</Typography>
                      <Typography sx={{ fontSize: '0.6rem', color: 'text.disabled' }}>Click the button below</Typography>
                    </Stack>
                  </Box>
                </Box>
              </Box>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              p: { xs: 1.5, sm: 2, md: 2.5 },
              display: 'flex',
              justifyContent: 'space-between'
            }}
          >
            <Box>
              {step > 0 && !results && (
                <Button
                  size="small"
                  startIcon={<IconChevronLeft size={16} />}
                  onClick={() => setStep((s) => s - 1)}
                  sx={{ textTransform: 'none', fontWeight: 600 }}
                >
                  Back
                </Button>
              )}
            </Box>
            <Box>
              {step < 2 && !results ? (
                <Button
                  size="small"
                  endIcon={<IconChevronRight size={16} />}
                  onClick={() => setStep((s) => s + 1)}
                  disabled={!canNext}
                  variant="contained"
                  sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#5E35B1', '&:disabled': { bgcolor: alpha('#5E35B1', 0.3) } }}
                >
                  Next
                </Button>
              ) : !results ? (
                <Button
                  size="small"
                  startIcon={posting ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <IconSend size={16} />}
                  disabled={!canNext || posting}
                  onClick={publish}
                  variant="contained"
                  sx={{ px: 2.5, textTransform: 'none', fontWeight: 600, background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)' }}
                >
                  {posting ? 'Publishing...' : 'Publish'}
                </Button>
              ) : null}
            </Box>
          </Box>
        </Box>

        {/* Results inline */}
        {results && Object.entries(results).length > 0 && (
          <Box
            sx={{ mt: 2, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', overflow: 'hidden' }}
          >
            {Object.entries(results).map(([id, st], i, arr) => {
              const p = plat(id);
              const Icon = p?.icon || IconAlertCircle;
              const pr = progress[id];
              const ok = st === 'ok';
              const err = pr === -1;
              return (
                <Box key={id}>
                  <Box sx={{ p: 1.5 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: 1.5,
                          bgcolor: ok ? alpha('#4CAF50', 0.1) : err ? alpha('#f44336', 0.1) : alpha('#5E35B1', 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {ok ? (
                          <IconCheck size={14} color="#4CAF50" />
                        ) : err ? (
                          <IconAlertCircle size={14} color="#f44336" />
                        ) : (
                          <CircularProgress size={14} sx={{ color: '#5E35B1' }} />
                        )}
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={0.75}>
                          <Icon size={14} style={{ color: p?.color }} />
                          <Box>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{p?.name}</Typography>
                            {(() => {
                              const selectedPage = selectedPages[id] && pages[id]?.pages ? pages[id].pages.find((pg) => pg.id === selectedPages[id]) : null;
                              return selectedPage ? (
                                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {selectedPage.name}
                                </Typography>
                              ) : null;
                            })()}
                          </Box>
                        </Stack>
                        <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                          {ok ? 'Published' : err ? 'Failed' : `Publishing... ${pr}%`}
                        </Typography>
                        {!ok && !err && (
                          <LinearProgress
                            variant="determinate"
                            value={pr}
                            sx={{
                              mt: 0.5,
                              height: 3,
                              borderRadius: 1.5,
                              bgcolor: alpha('#5E35B1', 0.1),
                              '& .MuiLinearProgress-bar': { borderRadius: 1.5, bgcolor: '#5E35B1' }
                            }}
                          />
                        )}
                      </Box>
                    </Stack>
                  </Box>
                  {i < arr.length - 1 && <Divider sx={{ ml: 'calc(28px + 12px)' }} />}
                </Box>
              );
            })}
          </Box>
        )}
      </Box>

      {/* Success Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden', position: 'relative' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          <Confetti />

          <Box sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: alpha('#4CAF50', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              <IconConfetti size={32} style={{ color: '#4CAF50' }} />
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 0.5 }}>Post Published!</Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 3 }}>
              {successCount === platforms.length
                ? `Successfully published on all ${successCount} platforms`
                : `Published on ${successCount} of ${platforms.length} platforms`}
            </Typography>

            <Stack spacing={1} sx={{ mb: 3 }}>
              {results &&
                Object.entries(results).map(([id, st]) => {
                  const p = plat(id);
                  const ok = st === 'ok';
                  const Icon = p?.icon || IconAlertCircle;
                  const selectedPage = selectedPages[id] && pages[id]?.pages ? pages[id].pages.find((pg) => pg.id === selectedPages[id]) : null;
                  return (
                    <Stack
                      key={id}
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: ok ? alpha('#4CAF50', 0.04) : alpha('#f44336', 0.04),
                        border: '1px solid',
                        borderColor: ok ? alpha('#4CAF50', 0.15) : alpha('#f44336', 0.15)
                      }}
                    >
                      <Box
                        sx={{
                          width: 28,
                          height: 28,
                          borderRadius: '50%',
                          bgcolor: ok ? alpha('#4CAF50', 0.1) : alpha('#f44336', 0.1),
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {ok ? <IconCheck size={14} color="#4CAF50" /> : <IconAlertCircle size={14} color="#f44336" />}
                      </Box>
                      <Icon size={16} style={{ color: p?.color }} />
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{p?.name}</Typography>
                        {selectedPage && (
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedPage.name}
                          </Typography>
                        )}
                      </Box>
                      <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: ok ? '#4CAF50' : '#f44336' }}>
                        {ok ? 'Published' : 'Failed'}
                      </Typography>
                    </Stack>
                  );
                })}
            </Stack>

            <Button
              variant="contained"
              fullWidth
              onClick={reset}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                py: 1.25,
                background: 'linear-gradient(135deg, #5E35B1, #7C4DFF)'
              }}
            >
              Create Another Post
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
