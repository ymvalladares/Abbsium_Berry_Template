import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
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
  Divider
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
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
  IconConfetti
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { showSnackbar } from '../../../utils/snackbarNotif';
import publishingSignalR from '../../../services/PublishingSignalRService';

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
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const isMobile = theme ? useMediaQuery(theme.breakpoints.down('sm')) : false;

  const [step, setStep] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [type, setType] = useState('post');
  const [mode, setMode] = useState('manual');
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('Summer Collection 2026');
  const [description, setDescription] = useState('New arrivals are here. Shop now and get 20% off.\n\n#Summer #NewCollection');
  const [prompt, setPrompt] = useState('');
  const [posting, setPosting] = useState(false);
  const [progress, setProgress] = useState({});
  const [results, setResults] = useState(null);
  const [serverResponse, setServerResponse] = useState(null);
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
  const [sessionId, setSessionId] = useState(null);
  const [networkStatuses, setNetworkStatuses] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [publishSummary, setPublishSummary] = useState(null);

  const fetchPages = useCallback(async () => {
    setLoadingPages(true);
    try {
      const res = await socialAPI.checkConnections();
      const providerNameMap = {
        facebook: 'Facebook',
        instagram: 'Instagram',
        youtube: 'YouTube',
        tiktok: 'TikTok',
        twitter: 'X',
        linkedin: 'LinkedIn',
        pinterest: 'Pinterest'
      };

      const connected = [];
      const pagesMap = {};
      res.data.forEach((item) => {
        if (item.connected && item.isActive) {
          const key = providerNameMap[item.provider] || item.provider.charAt(0).toUpperCase() + item.provider.slice(1);
          const platformId = PLATFORMS.find((p) => p.name === key)?.id || item.provider.toLowerCase();
          connected.push(platformId);
          pagesMap[platformId] = {
            id: item.id,
            accountName: item.accountName || key,
            providerAccountId: item.providerAccountId,
            scope: item.scope,
            expiresAt: item.expiresAt,
            createdAt: item.createdAt
          };
        }
      });
      setConnectedPlatforms(connected);
      setPages(pagesMap);

      const initialSelected = {};
      Object.keys(pagesMap).forEach((provider) => {
        initialSelected[provider] = pagesMap[provider].id;
      });
      if (Object.keys(initialSelected).length > 0) {
        setSelectedPages(initialSelected);
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
    return () => {
      publishingSignalR.stop();
    };
  }, [fetchPages]);

  const toggle = (id) => setPlatforms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
  const selectAll = () => setPlatforms(connectedPlatforms);
  const clearAll = () => setPlatforms([]);

  const [fileError, setFileError] = useState(null);

  const validateFile = (f) => {
    if (!f) {
      setFileError(null);
      return true;
    }

    const isVideo = f.type.startsWith('video');
    const isImage = f.type.startsWith('image');

    if (!isVideo && !isImage) {
      setFileError('Only image and video files are allowed');
      return false;
    }

    if (isVideo) {
      if (f.type !== 'video/mp4' && !f.name.toLowerCase().endsWith('.mp4')) {
        setFileError('Video must be MP4 format');
        return false;
      }

      const maxSize = 256 * 1024 * 1024;
      if (f.size > maxSize) {
        setFileError('Video must be under 256MB');
        return false;
      }
    }

    if (isImage) {
      const maxSize = 10 * 1024 * 1024;
      if (f.size > maxSize) {
        setFileError('Images must be under 10MB');
        return false;
      }
    }

    setFileError(null);
    return true;
  };

  const handleFileDrop = (acceptedFiles) => {
    const f = acceptedFiles[0];
    if (validateFile(f)) {
      setFiles([f]);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED,
    multiple: false,
    onDrop: handleFileDrop,
    noClick: false
  });
  const file = files[0];
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const hasContent = title?.trim() || description?.trim();
  const canNext = step === 0 ? platforms.length > 0 : step === 1 ? (mode === 'ai' || files.length > 0) && hasContent : true;

  const publish = async () => {
    if (posting) return;

    if (file && !validateFile(file)) {
      showSnackbar(fileError, 'error');
      return;
    }

    if (!title?.trim() && !description?.trim()) {
      showSnackbar('Add a title or description before publishing', 'error');
      return;
    }

    setPosting(true);
    setResults(null);
    setServerResponse(null);
    setShowModal(false);
    setSessionId(null);
    setNetworkStatuses({});
    setUploadProgress(0);
    setPublishSummary(null);
    setFileError(null);

    const SUPPORTED_PLATFORMS = ['Facebook', 'Instagram', 'YouTube', 'TikTok'];
    const platformNames = platforms
      .map((id) => PLATFORMS.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .filter((name) => SUPPORTED_PLATFORMS.includes(name));

    if (platformNames.length === 0) {
      showSnackbar('Select at least one supported platform (Facebook, Instagram, YouTube, TikTok)', 'warning');
      setPosting(false);
      return;
    }

    try {
      let s3Url = null;
      let s3Key = null;

      if (file) {
        setUploadProgress(0);
        const presignedResponse = await socialAPI.getPresignedUrl(file.name, file.type);
        const data = presignedResponse.data;

        const uploadUrl = data.url || data.Url;
        const key = data.key || data.Key;
        const contentType = data.contentType || data.ContentType || file.type;

        if (!uploadUrl || !key) {
          showSnackbar('Failed to get upload URL from server', 'error');
          setPosting(false);
          return;
        }

        s3Key = key;

        await socialAPI.uploadToS3(uploadUrl, file, contentType, (percent) => {
          setUploadProgress(percent);
        });

        s3Url = data.publicUrl || data.PublicUrl;
        if (!s3Url) {
          const baseUrl = import.meta.env.VITE_S3_PUBLIC_URL || 'https://s3.amazonaws.com/abbsiumapp/';
          s3Url = `${baseUrl}${key}`;
        }
        setUploadProgress(100);
      }

      const token = localStorage.getItem('token');

      const handlePublishStarted = (data) => {
        console.log('Publish started:', data);
      };

      const handleNetworkStatus = (data) => {
        console.log('Network status:', data);
        const platformId = PLATFORMS.find((p) => p.name === data.network)?.id || data.network.toLowerCase();
        setNetworkStatuses((prev) => ({
          ...prev,
          [platformId]: {
            status: data.status,
            message: data.message,
            network: data.network,
            postId: data.postId,
            postUrl: data.postUrl,
            error: data.error,
            progress: data.status === 'success' ? 100 : data.status === 'error' ? 0 : (prev[platformId]?.progress || 0)
          }
        }));

        if (data.status === 'success') {
          setProgress((prev) => ({ ...prev, [platformId]: 100 }));
        } else if (data.status === 'error') {
          setProgress((prev) => ({ ...prev, [platformId]: -1 }));
        }
      };

      const handlePublishFinished = (data) => {
        console.log('Publish finished:', data);
        setPublishSummary(data);
        setPosting(false);

        const ok = data.successful;
        if (ok === 0) {
          showSnackbar('Publish failed on all platforms', 'error');
        } else if (ok === data.total) {
          showSnackbar(`Published on ${ok} platform${ok > 1 ? 's' : ''}`, 'success');
        } else {
          showSnackbar(`Published on ${ok} of ${data.total} platforms`, 'warning');
        }

        const r = {};
        platformNames.forEach((name) => {
          const platformId = PLATFORMS.find((p) => p.name === name)?.id || name.toLowerCase();
          const status = networkStatuses[platformId]?.status;
          r[platformId] = status === 'success' ? 'ok' : 'err';
        });
        setResults(r);

        publishingSignalR.off('publish_started', handlePublishStarted);
        publishingSignalR.off('network_status', handleNetworkStatus);
        publishingSignalR.off('publish_finished', handlePublishFinished);
      };

      const handleError = (error) => {
        console.error('SignalR error:', error);
        setPosting(false);
        showSnackbar('Real-time connection error', 'error');
      };

      publishingSignalR.on('publish_started', handlePublishStarted);
      publishingSignalR.on('network_status', handleNetworkStatus);
      publishingSignalR.on('publish_finished', handlePublishFinished);
      publishingSignalR.on('error', handleError);

      await publishingSignalR.start(token);

      const initialStatuses = {};
      platformNames.forEach((name) => {
        const platformId = PLATFORMS.find((p) => p.name === name)?.id || name.toLowerCase();
        initialStatuses[platformId] = { status: 'uploading', message: 'Starting...', network: name, progress: 0 };
      });
      setNetworkStatuses(initialStatuses);
      setShowModal(true);

      const payload = {
        videoUrl: s3Url,
        title: title || undefined,
        caption: description || undefined,
        platforms: platformNames,
        isShort: type === 'reel'
      };

      Object.keys(payload).forEach((key) => payload[key] === undefined && delete payload[key]);

      const publishResponse = await socialAPI.publishAsync(payload);
      const { sessionId: newSessionId } = publishResponse.data;
      setSessionId(newSessionId);

      const progressInterval = setInterval(() => {
        setNetworkStatuses((prev) => {
          const updated = {};
          Object.entries(prev).forEach(([id, statusData]) => {
            if (statusData.status === 'uploading') {
              updated[id] = {
                ...statusData,
                progress: Math.min((statusData.progress || 0) + 5, 95)
              };
            } else {
              updated[id] = statusData;
            }
          });
          return updated;
        });
      }, 500);

      const cleanupInterval = () => clearInterval(progressInterval);

      const handlePublishFinishedWithCleanup = (data) => {
        cleanupInterval();
        handlePublishFinished(data);
      };

      publishingSignalR.off('publish_finished', handlePublishFinished);
      publishingSignalR.on('publish_finished', handlePublishFinishedWithCleanup);
    } catch (err) {
      console.error('Publish error:', err);
      setPosting(false);
      showSnackbar(err.response?.data?.errorMessage || err.response?.data?.message || 'Publish failed', 'error');
      const r = {};
      platforms.forEach((p) => {
        r[p] = 'err';
        setProgress((prev) => ({ ...prev, [p]: -1 }));
      });
      setResults(r);
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
    setServerResponse(null);
    setProgress({});
    setStep(0);
    setShowModal(false);
    setSelectedPages({});
    setSessionId(null);
    setNetworkStatuses({});
    setUploadProgress(0);
    setPublishSummary(null);
  };

  const plat = (id) => PLATFORMS.find((p) => p.id === id);
  const successCount = results ? Object.values(results).filter((v) => v === 'ok').length : 0;

  return (
    <Box sx={{ width: { xs: '100%', lg: 'var(--app-content-width)' }, mx: 'auto', py: 3, px: { xs: 1.5, sm: 2, md: 3 } }}>
      <Box sx={{ width: '100%' }}>
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
                      bgcolor: i === step ? '#5E35B1' : i < step ? '#4CAF50' : isDark ? '#374151' : '#e0e0e0',
                      color: i <= step ? '#fff' : isDark ? '#94a3b8' : '#999',
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
                        bgcolor: isDark ? 'rgba(30,41,59,0.8)' : 'rgba(255,255,255,0.8)',
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
                    const on = connectedPlatforms.includes(p.id);
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
                          borderColor: sel ? p.color : on ? alpha(p.color, 0.4) : 'divider',
                          bgcolor: sel ? alpha(p.color, 0.04) : on ? alpha(p.color, 0.02) : 'transparent',
                          cursor: on ? 'pointer' : 'not-allowed',
                          opacity: on ? 1 : 0.35,
                          textAlign: 'center',
                          transition: 'all 0.2s',
                          '&:hover': on ? { borderColor: p.color, bgcolor: alpha(p.color, 0.06), boxShadow: `0 4px 12px ${alpha(p.color, 0.15)}` } : {},
                          boxShadow: on && !sel ? `0 2px 8px ${alpha(p.color, 0.08)}` : 'none',
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
                            bgcolor: sel ? p.color : on ? alpha(p.color, 0.15) : alpha(p.color, 0.1),
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
                {platforms.some((p) => pages[p]) && (
                  <Divider sx={{ my: 0.5 }} />
                )}

                {/* Account info for connected platforms */}
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, width: '100%' }}>
                  {platforms.map((id) => {
                    const p = PLATFORMS.find((plat) => plat.id === id);
                    if (!p || !pages[id] || loadingPages) return null;
                    const account = pages[id];
                    return (
                      <Box key={id}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: '#fff' }}>{p.name[0]}</Typography>
                          </Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary' }}>{p.name}</Typography>
                        </Stack>
                        <Box sx={{ p: 1, borderRadius: 1.5, border: '1px solid', borderColor: alpha(p.color, 0.12), bgcolor: alpha(p.color, 0.02), display: 'flex', alignItems: 'center', gap: 0.75 }}>
                          <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: alpha(p.color, 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: p.color }}>{p.name[0]}</Typography>
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{account.accountName}</Typography>
                            {account.expiresAt && (
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>
                                Expires: {new Date(account.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    );
                  })}
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
                {/* Type selector */}
                <Stack direction="row" spacing={1}>
                  {TYPES.map((t) => {
                    const a = type === t.id;
                    const Icon = t.icon;
                    return (
                      <Box
                        key={t.id}
                        onClick={() => setType(t.id)}
                        sx={{
                          flex: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          gap: 0.5,
                          p: 1.5,
                          borderRadius: 2.5,
                          border: '2px solid',
                          borderColor: a ? '#5E35B1' : 'divider',
                          bgcolor: a ? alpha('#5E35B1', 0.06) : isDark ? '#1e293b' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { borderColor: a ? '#5E35B1' : alpha('#5E35B1', 0.2) }
                        }}
                      >
                        <Icon size={20} style={{ color: a ? '#5E35B1' : isDark ? '#64748b' : '#999' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: a ? '#5E35B1' : 'text.secondary' }}>{t.label}</Typography>
                      </Box>
                    );
                  })}
                </Stack>

                {mode === 'manual' ? (
                  <>
                    {!file ? (
                      <Box
                        {...getRootProps()}
                        sx={{
                          borderRadius: 2.5,
                          border: '2px dashed',
                          borderColor: isDragActive ? '#5E35B1' : fileError ? '#f44336' : 'divider',
                          bgcolor: isDragActive ? alpha('#5E35B1', 0.08) : fileError ? alpha('#f44336', 0.06) : isDark ? '#1e293b' : 'white',
                          cursor: 'pointer',
                          p: 3,
                          textAlign: 'center',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <input {...getInputProps()} />
                        <IconUpload size={24} style={{ color: fileError ? '#f44336' : isDark ? '#64748b' : '#bbb', margin: '0 auto 8px' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem', mb: 0.25 }}>Drop media here or click to browse</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>MP4 video or images</Typography>
                      </Box>
                    ) : (
                      <Box>
                        <Stack direction="row" spacing={2}>
                          <Box
                            sx={{
                              width: 100,
                              height: 70,
                              borderRadius: 2,
                              overflow: 'hidden',
                              position: 'relative',
                              bgcolor: isDark ? '#1e293b' : 'grey.100',
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
                              onClick={() => { setFiles([]); setFileError(null); }}
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
                          <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', flex: 1 }}>
                            <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{file.name}</Typography>
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
                              {(file.size / 1024 / 1024).toFixed(1)} MB · {file.type.startsWith('video') ? 'Video' : 'Image'}
                            </Typography>
                          </Box>
                        </Stack>
                        {fileError && (
                          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mt: 1, p: 1, borderRadius: 1.5, bgcolor: alpha('#f44336', 0.04), border: '1px solid', borderColor: alpha('#f44336', 0.12) }}>
                            <IconAlertCircle size={14} style={{ color: '#f44336' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#f44336' }}>{fileError}</Typography>
                          </Stack>
                        )}
                      </Box>
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
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
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
              <Stack spacing={1.5}>
                {/* Platforms row */}
                <Box sx={{ borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 1.5, bgcolor: isDark ? '#1e293b' : 'white' }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', mb: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Publishing to</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                    {platforms.map((id) => {
                      const p = plat(id);
                      if (!p) return null;
                      const Icon = p.icon;
                      const account = pages[id];
                      return (
                        <Stack key={id} direction="row" alignItems="center" spacing={1} sx={{ p: '6px 12px', borderRadius: 1.5, border: '1px solid', borderColor: alpha(p.color, 0.15), bgcolor: alpha(p.color, 0.03) }}>
                          <Box sx={{ width: 20, height: 20, borderRadius: 1, bgcolor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon size={11} style={{ color: '#fff' }} />
                          </Box>
                          <Box>
                            <Typography sx={{ fontWeight: 700, fontSize: '0.7rem' }}>{p.name}</Typography>
                            <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 120 }}>
                              {account ? account.accountName : 'Personal'}
                            </Typography>
                          </Box>
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>

                {/* Content + Details in compact row */}
                <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} sx={{ alignItems: 'stretch' }}>
                  {/* Content */}
                  <Box sx={{ flex: 1, borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 1.5, bgcolor: isDark ? '#1e293b' : 'white' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', mb: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Content</Typography>
                    {title && <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', mb: 0.5 }}>{title}</Typography>}
                    {description && (
                      <Typography sx={{ fontSize: '0.75rem', lineHeight: 1.5, color: 'text.secondary', mb: 1 }}>
                        {description}
                      </Typography>
                    )}
                    {!title && !description && (
                      <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', mb: 1 }}>No text content</Typography>
                    )}
                    {file && (
                      <Stack direction="row" alignItems="center" spacing={1} sx={{ p: 1, borderRadius: 1.5, bgcolor: isDark ? '#0f172a' : 'grey.50', border: '1px solid', borderColor: 'divider' }}>
                        {file.type.startsWith('image') ? (
                          <Box component="img" src={preview} sx={{ width: 48, height: 48, borderRadius: 1.5, objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <Box sx={{ width: 48, height: 48, borderRadius: 1.5, bgcolor: isDark ? '#1e293b' : 'grey.100', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <IconVideo size={18} style={{ color: isDark ? '#94a3b8' : '#999' }} />
                          </Box>
                        )}
                        <Box sx={{ minWidth: 0, flex: 1 }}>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.7rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{file.name}</Typography>
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</Typography>
                        </Box>
                      </Stack>
                    )}
                    {!file && (
                      <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>No media attached</Typography>
                    )}
                  </Box>

                  {/* Details */}
                  <Box sx={{ flex: '0 0 160px', borderRadius: 2, border: '1px solid', borderColor: 'divider', p: 1.5, bgcolor: isDark ? '#1e293b' : 'white' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', mb: 1, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Details</Typography>
                    <Stack spacing={1}>
                      <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? '#0f172a' : 'grey.50' }}>
                        <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>Type</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{TYPES.find((t) => t.id === type)?.label}</Typography>
                      </Box>
                      <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? '#0f172a' : 'grey.50' }}>
                        <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>Schedule</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: '#4CAF50' }}>Now</Typography>
                      </Box>
                      {file && (
                        <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? '#0f172a' : 'grey.50' }}>
                          <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>File size</Typography>
                          <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{(file.size / 1024 / 1024).toFixed(1)} MB</Typography>
                        </Box>
                      )}
                      <Box sx={{ p: 0.75, borderRadius: 1.5, bgcolor: isDark ? '#0f172a' : 'grey.50' }}>
                        <Typography sx={{ fontSize: '0.6rem', color: 'text.secondary' }}>Platforms</Typography>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem' }}>{platforms.length}</Typography>
                      </Box>
                    </Stack>
                  </Box>
                </Stack>
              </Stack>
            )}
          </Box>

          {/* Footer */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              p: { xs: 1.5, sm: 2, md: 2.5 },
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1
            }}
          >
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

      {/* Success Modal */}
      <Dialog
        open={showModal}
        onClose={() => !posting && setShowModal(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden', position: 'relative' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {publishSummary && (publishSummary.successful === publishSummary.total) ? <Confetti /> : null}

          <Box sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                bgcolor: posting ? alpha('#5E35B1', 0.1) : (publishSummary && publishSummary.successful === publishSummary.total) ? alpha('#4CAF50', 0.1) : alpha('#FF9800', 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 2
              }}
            >
              {posting ? (
                <CircularProgress size={32} sx={{ color: '#5E35B1' }} />
              ) : publishSummary && publishSummary.successful === publishSummary.total ? (
                <IconConfetti size={32} style={{ color: '#4CAF50' }} />
              ) : (
                <IconAlertCircle size={32} style={{ color: '#FF9800' }} />
              )}
            </Box>

            <Typography sx={{ fontWeight: 700, fontSize: '1.25rem', mb: 0.5 }}>
              {posting ? 'Publishing...' : (publishSummary && publishSummary.successful === publishSummary.total) ? 'Post Published!' : 'Partial Success'}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem', mb: 3 }}>
              {posting
                ? `Publishing to ${platforms.length} platform${platforms.length > 1 ? 's' : ''}...`
                : publishSummary
                  ? `${publishSummary.successful} of ${publishSummary.total} platforms successful`
                  : `${successCount} of ${platforms.length} platforms successful`}
            </Typography>

            <Stack spacing={1} sx={{ mb: 3 }}>
              {Object.entries(networkStatuses).map(([id, statusData]) => {
                const p = plat(id);
                const Icon = p?.icon || IconAlertCircle;
                const ok = statusData.status === 'success';
                const err = statusData.status === 'error';
                const progress = statusData.progress || 0;
                return (
                  <Stack
                    key={id}
                    direction="row"
                    spacing={1.5}
                    alignItems="flex-start"
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: ok ? alpha('#4CAF50', 0.04) : err ? alpha('#f44336', 0.04) : alpha('#5E35B1', 0.04),
                      border: '1px solid',
                      borderColor: ok ? alpha('#4CAF50', 0.15) : err ? alpha('#f44336', 0.15) : alpha('#5E35B1', 0.15)
                    }}
                  >
                    <Box
                      sx={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        bgcolor: ok ? alpha('#4CAF50', 0.1) : err ? alpha('#f44336', 0.1) : alpha('#5E35B1', 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
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
                    <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
                        <Icon size={16} style={{ color: p?.color, flexShrink: 0 }} />
                        <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{statusData.network || p?.name}</Typography>
                      </Stack>
                      {ok ? (
                        <>
                          {statusData.postUrl && (
                            <Typography
                              sx={{ fontSize: '0.75rem', color: '#1877F2', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                              component="a"
                              href={statusData.postUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              View post
                            </Typography>
                          )}
                          {statusData.postId && !statusData.postUrl && (
                            <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Post ID: {statusData.postId}</Typography>
                          )}
                        </>
                      ) : err ? (
                        <Typography sx={{ fontSize: '0.75rem', color: '#f44336' }}>
                          {statusData.error || 'Failed to publish'}
                        </Typography>
                      ) : (
                        <>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mb: 0.5 }}>
                            {statusData.message || 'Publishing...'}
                          </Typography>
                          <LinearProgress
                            variant="determinate"
                            value={progress}
                            sx={{
                              height: 4,
                              borderRadius: 2,
                              bgcolor: alpha('#5E35B1', 0.1),
                              '& .MuiLinearProgress-bar': { borderRadius: 2, bgcolor: '#5E35B1' }
                            }}
                          />
                          <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.25, textAlign: 'right' }}>
                            {progress}%
                          </Typography>
                        </>
                      )}
                    </Box>
                    <Typography
                      sx={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: ok ? '#4CAF50' : err ? '#f44336' : '#5E35B1',
                        bgcolor: ok ? alpha('#4CAF50', 0.1) : err ? alpha('#f44336', 0.1) : alpha('#5E35B1', 0.1),
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        flexShrink: 0,
                        alignSelf: 'center'
                      }}
                    >
                      {ok ? 'Published' : err ? 'Failed' : '...'}
                    </Typography>
                  </Stack>
                );
              })}
            </Stack>

            {!posting && (
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
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
