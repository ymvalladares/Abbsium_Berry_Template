import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Dialog,
  DialogContent
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
  IconChevronLeft
} from '@tabler/icons-react';
import { socialAPI } from '../../../services/AxiosService';
import { useNotification } from 'contexts/NotificationContext';
import publishingSignalR from '../../../services/PublishingSignalRService';
import { AuroraLayer, glassCard, GRADIENT_MAIN } from './aiUi';

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

const CONFETTI_COLORS = ['#3b82f6', '#E4405F', '#1877F2', '#FF9800', '#4CAF50', '#FF0000', '#2563eb', '#FCAF45'];

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
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes gradientSlide {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes bounceIn {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </Box>
  );
}

export default function PostComposer() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();

  const [step, setStep] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [type, setType] = useState('post');
  const [mode] = useState('manual');
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('Summer Collection 2026');
  const [description, setDescription] = useState('New arrivals are here. Shop now and get 20% off.\n\n#Summer #NewCollection');
  const [prompt, setPrompt] = useState('');
  const [posting, setPosting] = useState(false);
  const [, setProgress] = useState({});
  const [results, setResults] = useState(null);
  const [, setServerResponse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [pages, setPages] = useState({});
  const [, setSelectedPages] = useState({});
  const [loadingPages, setLoadingPages] = useState(false);
  const [, setSessionId] = useState(null);
  const [networkStatuses, setNetworkStatuses] = useState({});
  const [, setUploadProgress] = useState(0);
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

  useEffect(() => {
    if (!posting || Object.keys(networkStatuses).length === 0) return;
    const allDone = Object.values(networkStatuses).every((s) => s.status === 'success' || s.status === 'error');
    if (allDone) {
      const successful = Object.values(networkStatuses).filter((s) => s.status === 'success').length;
      const total = Object.keys(networkStatuses).length;
      const data = { successful, total };
      setPublishSummary(data);
      setPosting(false);
      if (successful === 0) {
        notify.error('Publish failed on all platforms', 'Publish Failed');
      } else if (successful === total) {
        notify.success(`Published on ${successful} platform${successful > 1 ? 's' : ''}`, 'Publish Successful');
      } else {
        notify.warning(`Published on ${successful} of ${total} platforms`, 'Partial Success');
      }
      const r = {};
      Object.keys(networkStatuses).forEach((id) => {
        r[id] = networkStatuses[id]?.status === 'success' ? 'ok' : 'err';
      });
      setResults(r);
    }
  }, [networkStatuses, posting, notify]);

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
    } else {
      notify.error(fileError, 'File Validation Error');
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: ACCEPTED,
    multiple: false,
    onDrop: handleFileDrop,
    noClick: false,
    onDragEnter: () => setFileError(null)
  });
  const file = files[0];
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  const hasContent = title?.trim() || description?.trim();
  const canNext = step === 0 ? platforms.length > 0 : step === 1 ? (mode === 'ai' || files.length > 0) && hasContent : true;

  const publish = async () => {
    if (posting) return;

    if (file && !validateFile(file)) {
      notify.error(fileError, 'File Validation Error');
      return;
    }

    if (!title?.trim() && !description?.trim()) {
      notify.error('Add a title or description before publishing', 'Missing Content');
      return;
    }

    if (scheduleType === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      notify.error('Please select a date and time for scheduling', 'Missing Schedule');
      return;
    }

    if (scheduleType === 'scheduled') {
      const schedDate = new Date(`${scheduledDate}T${scheduledTime}`);
      if (schedDate <= new Date()) {
        notify.error('Please select a future date and time', 'Invalid Schedule');
        return;
      }
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
      notify.warning('Select at least one supported platform (Facebook, Instagram, YouTube, TikTok)', 'No Platform Selected');
      setPosting(false);
      return;
    }

    try {
      let s3Url = null;

      if (file) {
        setUploadProgress(0);
        const presignedResponse = await socialAPI.getPresignedUrl(file.name, file.type);
        const data = presignedResponse.data;

        const uploadUrl = data.url || data.Url;
        const key = data.key || data.Key;
        const contentType = data.contentType || data.ContentType || file.type;

        if (!uploadUrl || !key) {
          notify.error('Failed to get upload URL from server', 'Upload Error');
          setPosting(false);
          return;
        }

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

      // ── SCHEDULED FLOW ──
      if (scheduleType === 'scheduled') {
        const localDate = new Date(`${scheduledDate}T${scheduledTime}`);
        const now = new Date();
        if (localDate <= now) {
          notify.error('Please select a future date and time', 'Invalid Schedule');
          setPosting(false);
          return;
        }

        const payload = {
          videoUrl: s3Url,
          title: title ?? '',
          caption: description ?? '',
          platforms: platformNames,
          isShort: type === 'reel',
          scheduleType: 'scheduled',
          scheduledFor: scheduledDate && scheduledTime
            ? localDate.toISOString()
            : null
        };

        const publishResponse = await socialAPI.publishAsync(payload);

        if (publishResponse.data.status === 'scheduled') {
          setPosting(false);
          notify.success(`Post scheduled for ${new Date(publishResponse.data.scheduledFor).toLocaleString()}`, 'Post Scheduled');
          window.dispatchEvent(new Event('refresh-scheduled-posts'));
          reset();
          return;
        } else {
          setPosting(false);
          notify.error('Failed to schedule post', 'Schedule Error');
          return;
        }
      }

      // ── PUBLISH NOW FLOW ──
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
          notify.error('Publish failed on all platforms', 'Publish Failed');
        } else if (ok === data.total) {
          notify.success(`Published on ${ok} platform${ok > 1 ? 's' : ''}`, 'Publish Successful');
        } else {
          notify.warning(`Published on ${ok} of ${data.total} platforms`, 'Partial Success');
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
        notify.error('Real-time connection error', 'SignalR Error');
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
        title: title ?? '',
        caption: description ?? '',
        platforms: platformNames,
        isShort: type === 'reel'
      };

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

      const fallbackTimeout = setTimeout(() => {
        if (posting) {
          console.log('SignalR fallback: forcing finish');
          const successful = Object.values(networkStatuses).filter((s) => s.status === 'success').length;
          const total = Object.keys(networkStatuses).length;
          const data = { successful, total };
          setPublishSummary(data);
          setPosting(false);
          if (successful === 0) {
            notify.error('Publish failed on all platforms', 'Publish Failed');
          } else if (successful === total) {
            notify.success(`Published on ${successful} platform${successful > 1 ? 's' : ''}`, 'Publish Successful');
          } else {
            notify.warning(`Published on ${successful} of ${total} platforms`, 'Partial Success');
          }
          const r = {};
          Object.keys(networkStatuses).forEach((id) => {
            r[id] = networkStatuses[id]?.status === 'success' ? 'ok' : 'err';
          });
          setResults(r);
          cleanupInterval();
        }
      }, 60000);

      const handlePublishFinishedWithCleanup = (data) => {
        clearTimeout(fallbackTimeout);
        cleanupInterval();
        handlePublishFinished(data);
      };

      publishingSignalR.off('publish_finished', handlePublishFinished);
      publishingSignalR.on('publish_finished', handlePublishFinishedWithCleanup);
    } catch (err) {
      console.error('Publish error:', err);
      setPosting(false);
      notify.error(err.response?.data?.errorMessage || err.response?.data?.message || 'Publish failed', 'Publish Error');
      const r = {};
      platforms.forEach((p) => {
        r[p] = 'err';
        setProgress((prev) => ({ ...prev, [p]: -1 }));
      });
      setResults(r);
    }
  };

  const reset = () => {
    setPlatforms([]);
    setType('post');
    setFiles([]);
    setTitle('');
    setDescription('');
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
    setPosting(false);
    setFileError(null);
    setScheduleType('now');
    setScheduledDate('');
    setScheduledTime('');
  };

  const plat = (id) => PLATFORMS.find((p) => p.id === id);
  const successCount = results ? Object.values(results).filter((v) => v === 'ok').length : 0;

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 0, sm: 1 }, width: '100%', position: 'relative' }}>
      {/* Header */}
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: GRADIENT_MAIN,
                boxShadow: '0 4px 12px rgba(59,130,246,0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <IconSparkles size={20} style={{ color: '#fff' }} />
            </Box>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: '1.15rem', lineHeight: 1.2 }}>
                {results ? 'Post Published' : 'Create Post'}
              </Typography>
              {!results && (
                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                  {STEP_LABELS[step]}
                </Typography>
              )}
            </Box>
          </Box>
          {results && (
            <Button size="small" startIcon={<IconRefresh size={16} />} onClick={reset} sx={{ textTransform: 'none', fontWeight: 600 }}>
              New Post
            </Button>
          )}
        </Box>
      </Box>

      {/* Stepper */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, px: 1 }}>
          {STEP_LABELS.map((label, i) => {
            const isActive = i === step;
            const isCompleted = i < step;
            const isLast = i === STEP_LABELS.length - 1;
            return (
              <React.Fragment key={label}>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 1
                  }}
                >
                  <Box
                    sx={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: isActive ? '#3b82f6' : isCompleted ? '#4CAF50' : isDark ? '#374151' : '#e5e7eb',
                      color: '#fff',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      transition: 'all 0.2s ease',
                      flexShrink: 0
                    }}
                  >
                    {isCompleted ? <IconCheck size={12} /> : i + 1}
                  </Box>
                  <Typography
                    sx={{
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.75rem',
                      color: isActive ? 'text.primary' : isCompleted ? 'text.primary' : 'text.secondary',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {label}
                  </Typography>
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      flex: 1,
                      height: 2,
                      mx: 1,
                      borderRadius: 1,
                      bgcolor: i < step ? '#4CAF50' : isDark ? '#374151' : '#e5e7eb',
                      transition: 'all 0.3s ease',
                      maxWidth: 60
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
        </Box>

        {/* Card */}
        <Box sx={{ ...glassCard(isDark), boxShadow: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(59,130,246,0.16)'}`, borderRadius: 3, overflow: 'hidden' }}>
          <AuroraLayer isDark={isDark} />
          <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
            {/* Step 0 */}
            {step === 0 && (
              <Stack spacing={2.5}>
                {/* Quick actions */}
                <Stack direction="row" spacing={1} alignItems="center">
                  <Button
                    size="small"
                    onClick={selectAll}
                    sx={{ textTransform: 'none', fontWeight: 600, fontSize: '0.75rem', color: '#3b82f6', px: 1 }}
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

                {/* Selected accounts */}
                {platforms.length > 0 && (
                  <Box
                    sx={{
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'background.paper',
                      overflow: 'hidden'
                    }}
                  >
                    <Box sx={{ px: 2.5, py: 1.5, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 1 }}>
                      <IconSend size={16} style={{ color: '#3b82f6' }} />
                      <Typography sx={{ fontWeight: 700, fontSize: '0.85rem' }}>
                        {platforms.length} {platforms.length === 1 ? 'platform' : 'platforms'} selected
                      </Typography>
                    </Box>
                    <Box sx={{ p: 2 }}>
                      <Box
                        sx={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                          gap: 1.5
                        }}
                      >
                        {platforms.map((id) => {
                          const p = PLATFORMS.find((plat) => plat.id === id);
                          if (!p) return null;
                          const Icon = p.icon;
                          const account = pages[id];
                          return (
                            <Box
                              key={id}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1.5,
                                p: 1.5,
                                borderRadius: 2,
                                bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)',
                                border: '1px solid',
                                borderColor: alpha(p.color, 0.12)
                              }}
                            >
                              <Box
                                sx={{
                                  width: 40,
                                  height: 40,
                                  borderRadius: 2,
                                  bgcolor: p.color,
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  boxShadow: `0 4px 12px ${alpha(p.color, 0.25)}`
                                }}
                              >
                                <Icon size={20} style={{ color: '#fff' }} />
                              </Box>
                              <Box sx={{ flex: 1, minWidth: 0 }}>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', lineHeight: 1.2 }}>{p.name}</Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', lineHeight: 1.3 }}>
                                  {account ? account.accountName : 'Personal account'}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>
                  </Box>
                )}

                {loadingPages && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                    <CircularProgress size={20} sx={{ color: '#3b82f6' }} />
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
                          borderColor: a ? '#3b82f6' : 'divider',
                          bgcolor: a ? alpha('#3b82f6', 0.06) : isDark ? '#1e293b' : 'white',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                          '&:hover': { borderColor: a ? '#3b82f6' : alpha('#3b82f6', 0.2) }
                        }}
                      >
                        <Icon size={20} style={{ color: a ? '#3b82f6' : isDark ? '#64748b' : '#999' }} />
                        <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: a ? '#3b82f6' : 'text.secondary' }}>{t.label}</Typography>
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
                          borderColor: isDragActive ? '#3b82f6' : fileError ? '#f44336' : 'divider',
                          bgcolor: isDragActive ? alpha('#3b82f6', 0.08) : fileError ? alpha('#f44336', 0.06) : isDark ? '#1e293b' : 'white',
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
                        {fileError && (
                          <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.75} sx={{ mt: 1.5, p: 1, borderRadius: 1.5, bgcolor: alpha('#f44336', 0.08), border: '1px solid', borderColor: alpha('#f44336', 0.2), display: 'inline-flex' }}>
                            <IconAlertCircle size={14} style={{ color: '#f44336' }} />
                            <Typography sx={{ fontSize: '0.75rem', color: '#f44336', fontWeight: 600 }}>{fileError}</Typography>
                          </Stack>
                        )}
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
                        background: GRADIENT_MAIN
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
              <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Left Column - Preview */}
                <Box sx={{ width: 380, flexShrink: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Preview
                  </Typography>

                  {/* Social Preview Card */}
                  <Box sx={{
                    borderRadius: 3,
                    border: '1px solid',
                    borderColor: 'divider',
                    bgcolor: 'background.paper',
                    overflow: 'hidden'
                  }}>
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, p: 1.75, pb: 1 }}>
                      <Box sx={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: GRADIENT_MAIN,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconSparkles size={16} style={{ color: '#fff' }} />
                      </Box>
                      <Box>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.8rem' }}>Your Account</Typography>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Just now</Typography>
                      </Box>
                    </Box>

                  {/* Media */}
                  {file ? (
                    <Box sx={{ width: '100%', height: 290, bgcolor: isDark ? '#1e293b' : '#f1f5f9', position: 'relative' }}>
                        {file.type.startsWith('image') ? (
                          <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ width: 56, height: 56, borderRadius: '50%', bgcolor: alpha('#3b82f6', 0.12), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <IconVideo size={28} style={{ color: '#3b82f6' }} />
                          </Box>
                          <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>{file.name}</Typography>
                          </Box>
                        )}
                        <Box sx={{ position: 'absolute', top: 12, right: 12, px: 1.25, py: 0.5, borderRadius: 2, bgcolor: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)', color: '#fff', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          {TYPES.find((t) => t.id === type)?.label}
                        </Box>
                      </Box>
                    ) : (
                      <Box sx={{ width: '100%', height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: isDark ? '#1e293b' : '#f8fafc', borderBottom: '1px solid', borderColor: 'divider' }}>
                        <Box sx={{ textAlign: 'center' }}>
                          <IconPhoto size={28} style={{ color: 'text.disabled', marginBottom: 6 }} />
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.disabled' }}>No media attached</Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Content */}
                    <Box sx={{ p: 1.5 }}>
                      {title && (
                        <Typography sx={{ fontWeight: 700, fontSize: '0.85rem', mb: 0.5 }}>{title}</Typography>
                      )}
                      {description ? (
                        <Typography sx={{ fontSize: '0.8rem', color: 'text.secondary', lineHeight: 1.5, whiteSpace: 'pre-wrap', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{description}</Typography>
                      ) : (
                        <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled', fontStyle: 'italic' }}>No caption</Typography>
                      )}
                    </Box>

                    {/* Action bar */}
                    <Box sx={{ px: 1.5, py: 1, borderTop: '1px solid', borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconPhoto size={12} style={{ color: '#3b82f6' }} />
                        </Box>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>Like</Typography>
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Box sx={{ width: 18, height: 18, borderRadius: 1, bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <IconSend size={12} style={{ color: '#3b82f6' }} />
                        </Box>
                        <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', fontWeight: 500 }}>Share</Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Right Column - Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: '0.75rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 1 }}>
                    Publishing Details
                  </Typography>

                  <Stack spacing={2} sx={{ '& > :last-child': { mb: 0 } }}>
                    {/* Platforms Card */}
                    <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>Target Platforms</Typography>
                        <Box sx={{ px: 1.5, py: 0.5, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.08), color: '#3b82f6', fontSize: '0.75rem', fontWeight: 700 }}>
                          {platforms.length} selected
                        </Box>
                      </Box>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.25 }}>
                        {platforms.map((id) => {
                          const p = plat(id);
                          if (!p) return null;
                          const Icon = p.icon;
                          const account = pages[id];
                          return (
                            <Box key={id} sx={{ p: 1.5, borderRadius: 2.5, border: '1px solid', borderColor: alpha(p.color, 0.15), bgcolor: alpha(p.color, 0.03) }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: p.color, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 3px 10px ${alpha(p.color, 0.25)}` }}>
                                  <Icon size={16} style={{ color: '#fff' }} />
                                </Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: p.color }}>{p.name}</Typography>
                              </Box>
                              <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {account ? account.accountName : 'Personal'}
                              </Typography>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    {/* Content Type & Schedule */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      {/* Content Type */}
                      <Box sx={{ flex: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Content Type
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2.5, bgcolor: alpha('#3b82f6', 0.04), border: '1px solid', borderColor: alpha('#3b82f6', 0.1) }}>
                          {(() => {
                            const t = TYPES.find((t) => t.id === type);
                            const TIcon = t?.icon || IconPhoto;
                            return (
                              <>
                                <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: alpha('#3b82f6', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  <TIcon size={20} style={{ color: '#3b82f6' }} />
                                </Box>
                                <Box>
                                  <Typography sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{t?.label}</Typography>
                                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>
                                    {type === 'post' ? 'Standard post' : type === 'reel' ? 'Short-form video' : 'Long-form video'}
                                  </Typography>
                                </Box>
                              </>
                            );
                          })()}
                        </Box>
                      </Box>

                      {/* Schedule */}
                      <Box sx={{ flex: 1, borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
                        <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                          Schedule
                        </Typography>

                        <Stack spacing={1.5}>
                          <Stack direction="row" spacing={1}>
                            <Button
                              size="small"
                              variant={scheduleType === 'now' ? 'contained' : 'outlined'}
                              onClick={() => setScheduleType('now')}
                              sx={{
                                flex: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                borderRadius: 2,
                                bgcolor: scheduleType === 'now' ? '#4CAF50' : 'transparent',
                                color: scheduleType === 'now' ? '#fff' : 'text.primary',
                                borderColor: 'divider',
                                '&:hover': { bgcolor: scheduleType === 'now' ? '#43A047' : alpha('#4CAF50', 0.04) }
                              }}
                            >
                              Publish Now
                            </Button>
                            <Button
                              size="small"
                              variant={scheduleType === 'scheduled' ? 'contained' : 'outlined'}
                              onClick={() => setScheduleType('scheduled')}
                              sx={{
                                flex: 1,
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.75rem',
                                borderRadius: 2,
                                bgcolor: scheduleType === 'scheduled' ? '#3b82f6' : 'transparent',
                                color: scheduleType === 'scheduled' ? '#fff' : 'text.primary',
                                borderColor: 'divider',
                                '&:hover': { bgcolor: scheduleType === 'scheduled' ? '#2563eb' : alpha('#3b82f6', 0.04) }
                              }}
                            >
                              Schedule
                            </Button>
                          </Stack>

                          {scheduleType === 'scheduled' && (
                            <Stack spacing={1}>
                              <TextField
                                type="datetime-local"
                                size="small"
                                fullWidth
                                value={scheduledDate && scheduledTime ? `${scheduledDate}T${scheduledTime}` : ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  if (val) {
                                    const [date, time] = val.split('T');
                                    setScheduledDate(date);
                                    setScheduledTime(time);
                                  }
                                }}
                                InputLabelProps={{ shrink: true }}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: 2,
                                    fontSize: '0.8rem',
                                    bgcolor: isDark ? '#1e293b' : '#f8fafc',
                                    '& fieldset': { borderColor: isDark ? '#374151' : '#e2e8f0' },
                                    '&:hover fieldset': { borderColor: '#3b82f6' },
                                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' }
                                  }
                                }}
                                inputProps={{
                                  min: (() => { const d = new Date(Date.now() + 60000); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}T${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; })()
                                }}
                              />
                              {scheduledDate && scheduledTime && (
                                <Typography sx={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 600 }}>
                                  Will publish on {new Date(`${scheduledDate}T${scheduledTime}`).toLocaleString()}
                                </Typography>
                              )}
                            </Stack>
                          )}

                          {scheduleType === 'now' && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2.5, bgcolor: alpha('#4CAF50', 0.04), border: '1px solid', borderColor: alpha('#4CAF50', 0.12) }}>
                              <Box sx={{ width: 32, height: 32, borderRadius: 2, bgcolor: alpha('#4CAF50', 0.1), display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <IconSend size={16} style={{ color: '#4CAF50' }} />
                              </Box>
                              <Box>
                                <Typography sx={{ fontWeight: 700, fontSize: '0.8rem', color: '#4CAF50' }}>Immediate</Typography>
                                <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>Publish right away</Typography>
                              </Box>
                            </Box>
                          )}
                        </Stack>
                      </Box>
                    </Box>

                    {/* Content Stats */}
                    <Box sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', bgcolor: 'background.paper', p: 2.5 }}>
                      <Typography sx={{ fontWeight: 700, fontSize: '0.7rem', color: 'text.secondary', mb: 1.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Content Stats
                      </Typography>
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#3b82f6' }}>{title?.length || 0}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Title chars</Typography>
                        </Box>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#3b82f6' }}>{description?.length || 0}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Caption chars</Typography>
                        </Box>
                        <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)', textAlign: 'center' }}>
                          <Typography sx={{ fontWeight: 800, fontSize: '1.5rem', color: '#3b82f6' }}>{(description?.match(/#/g) || []).length}</Typography>
                          <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary', mt: 0.25 }}>Hashtags</Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Stack>
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
              justifyContent: 'flex-end',
              alignItems: 'center',
              gap: 1,
              position: 'relative',
              zIndex: 1
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
                sx={{ textTransform: 'none', fontWeight: 600, bgcolor: '#3b82f6', '&:disabled': { bgcolor: alpha('#3b82f6', 0.3) } }}
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
                sx={{ px: 2.5, textTransform: 'none', fontWeight: 600, background: scheduleType === 'scheduled' ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' : GRADIENT_MAIN }}
              >
                {posting ? 'Processing...' : scheduleType === 'scheduled' ? 'Schedule Post' : 'Publish'}
              </Button>
            ) : null}
          </Box>
        </Box>

      {/* Success Modal */}
      <Dialog
        open={showModal}
        onClose={() => setShowModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 5, overflow: 'hidden', position: 'relative' } }}
      >
        <DialogContent sx={{ p: 0 }}>
          {!posting && publishSummary && (publishSummary.successful === publishSummary.total) ? <Confetti /> : null}

          <Box sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <IconButton
              onClick={() => setShowModal(false)}
              sx={{
                position: 'absolute', top: 16, right: 16,
                color: 'text.secondary',
                bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)' },
                width: 36, height: 36, minWidth: 0
              }}
            >
              <IconX size={18} />
            </IconButton>

            {/* Success animation */}
            {!posting && publishSummary && publishSummary.successful === publishSummary.total && (
              <Box sx={{ mb: 2, animation: 'scaleIn 0.5s ease' }}>
                <Box sx={{
                  width: 88, height: 88, mx: 'auto',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(76,175,80,0.35)',
                  animation: 'bounceIn 0.6s ease'
                }}>
                  <IconCheck size={44} style={{ color: '#fff', strokeWidth: 2.5 }} />
                </Box>
              </Box>
            )}

            {/* Publishing animation */}
            {posting && (
              <Box sx={{ mb: 2.5, position: 'relative', width: 88, height: 88, mx: 'auto' }}>
                <Box sx={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  border: '3px solid', borderColor: alpha('#3b82f6', 0.15),
                  animation: 'pulse 2s ease-in-out infinite'
                }} />
                <Box sx={{
                  position: 'absolute', inset: 8, borderRadius: '50%',
                  border: '3px solid', borderColor: alpha('#3b82f6', 0.25),
                  animation: 'pulse 2s ease-in-out infinite 0.3s'
                }} />
                <Box sx={{
                  position: 'relative',
                  width: 88, height: 88,
                  borderRadius: '50%',
                  background: GRADIENT_MAIN,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(59,130,246,0.3)'
                }}>
                  <CircularProgress size={40} sx={{ color: '#fff' }} />
                </Box>
              </Box>
            )}

            {/* Partial success icon */}
            {!posting && publishSummary && publishSummary.successful !== publishSummary.total && (
              <Box sx={{ mb: 2, animation: 'scaleIn 0.5s ease' }}>
                <Box sx={{
                  width: 88, height: 88, mx: 'auto',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #FF9800, #FFB74D)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: '0 8px 30px rgba(255,152,0,0.3)'
                }}>
                  <IconAlertCircle size={44} style={{ color: '#fff', strokeWidth: 2.5 }} />
                </Box>
              </Box>
            )}

            <Typography sx={{
              fontWeight: 800, fontSize: { xs: '1.3rem', sm: '1.5rem' }, mb: 0.5,
              color: posting ? '#3b82f6'
                : publishSummary && publishSummary.successful === publishSummary.total ? '#4CAF50'
                : '#FF9800'
            }}>
              {posting ? 'Publishing...' : publishSummary && publishSummary.successful === publishSummary.total ? 'Published!' : 'Partially Published'}
            </Typography>
            <Typography sx={{ color: 'text.secondary', fontSize: { xs: '0.85rem', sm: '0.95rem' }, mb: 3, lineHeight: 1.5 }}>
              {posting
                ? `Publishing to ${platforms.length} platform${platforms.length > 1 ? 's' : ''}`
                : publishSummary
                  ? `${publishSummary.successful} of ${publishSummary.total} platforms`
                  : `${successCount} of ${platforms.length} platforms`}
            </Typography>

            {/* Overall progress bar while posting */}
            {posting && (
              <Box sx={{ mb: 3, px: { xs: 1, sm: 2 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Progress</Typography>
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 700, color: '#3b82f6' }}>
                    {Object.values(networkStatuses).filter(s => s.status === 'success').length}/{platforms.length}
                  </Typography>
                </Box>
                <Box sx={{ height: 8, borderRadius: 4, bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <Box sx={{
                    height: '100%', borderRadius: 4,
                    background: GRADIENT_MAIN,
                    width: `${(Object.values(networkStatuses).filter(s => s.status === 'success').length / Math.max(platforms.length, 1)) * 100}%`,
                    transition: 'width 0.5s ease'
                  }} />
                </Box>
              </Box>
            )}

            {/* Platform status cards */}
            <Box sx={{ mb: 3, maxHeight: 280, overflowY: 'auto', px: { xs: 0.5, sm: 0 } }}>
              <Stack spacing={1}>
                {Object.entries(networkStatuses).map(([id, statusData]) => {
                  const p = plat(id);
                  const Icon = p?.icon || IconAlertCircle;
                  const ok = statusData.status === 'success';
                  const err = statusData.status === 'error';
                  const progress = statusData.progress || 0;
                  return (
                    <Box
                      key={id}
                      sx={{
                        p: { xs: 1.25, sm: 1.5 },
                        borderRadius: 3,
                        bgcolor: ok ? alpha('#4CAF50', 0.06) : err ? alpha('#f44336', 0.06) : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(59,130,246,0.04)',
                        border: '1px solid',
                        borderColor: ok ? alpha('#4CAF50', 0.2) : err ? alpha('#f44336', 0.2) : alpha('#3b82f6', 0.12),
                        transition: 'all 0.3s ease',
                        animation: ok ? 'slideIn 0.4s ease' : 'none'
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.25, sm: 1.5 } }}>
                        {/* Platform icon */}
                        <Box sx={{
                          width: 40, height: 40, borderRadius: 2.5,
                          bgcolor: p?.color || '#999',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: `0 4px 12px ${alpha(p?.color || '#999', 0.25)}`
                        }}>
                          <Icon size={20} style={{ color: '#fff' }} />
                        </Box>

                        {/* Status info */}
                        <Box sx={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                          <Stack direction="row" alignItems="center" spacing={0.75} sx={{ mb: 0.25 }}>
                            <Typography sx={{ fontWeight: 700, fontSize: { xs: '0.85rem', sm: '0.9rem' } }}>
                              {statusData.network || p?.name}
                            </Typography>
                          </Stack>
                          {ok ? (
                            statusData.postUrl ? (
                              <Typography
                                sx={{
                                  fontSize: '0.8rem', color: '#1877F2',
                                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                  textDecoration: 'none', '&:hover': { textDecoration: 'underline' }
                                }}
                                component="a" href={statusData.postUrl} target="_blank" rel="noopener noreferrer"
                              >
                                View post →
                              </Typography>
                            ) : statusData.postId ? (
                              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary' }}>Post ID: {statusData.postId}</Typography>
                            ) : (
                              <Typography sx={{ fontSize: '0.75rem', color: '#4CAF50', fontWeight: 600 }}>Published</Typography>
                            )
                          ) : err ? (
                            <Typography sx={{ fontSize: '0.75rem', color: '#f44336', lineHeight: 1.4 }}>
                              {statusData.error || 'Failed to publish'}
                            </Typography>
                          ) : (
                            <>
                              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 0.5 }}>
                                {statusData.message || 'Publishing...'}
                              </Typography>
                              <Box sx={{ height: 5, borderRadius: 3, bgcolor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                                <Box sx={{
                                  height: '100%', borderRadius: 3,
                                  background: GRADIENT_MAIN,
                                  width: `${progress}%`,
                                  transition: 'width 0.3s ease'
                                }} />
                              </Box>
                              <Typography sx={{ fontSize: '0.65rem', color: 'text.secondary', mt: 0.25, textAlign: 'right' }}>
                                {progress}%
                              </Typography>
                            </>
                          )}
                        </Box>

                        {/* Status badge */}
                        <Box sx={{
                          px: 1, py: 0.5, borderRadius: 2,
                          bgcolor: ok ? alpha('#4CAF50', 0.12) : err ? alpha('#f44336', 0.12) : alpha('#3b82f6', 0.1),
                          fontSize: '0.65rem', fontWeight: 700,
                          color: ok ? '#4CAF50' : err ? '#f44336' : '#3b82f6',
                          flexShrink: 0
                        }}>
                          {ok ? 'Done' : err ? 'Error' : '...'}
                        </Box>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>
            </Box>

            {/* Action buttons */}
            {!posting && (
              <Stack spacing={1.25}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={reset}
                  startIcon={<IconSparkles size={18} />}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 700,
                    py: 1.4,
                    fontSize: '0.95rem',
                    background: GRADIENT_MAIN,
                    boxShadow: '0 4px 20px rgba(59,130,246,0.35)',
                    '&:hover': {
                      boxShadow: '0 6px 25px rgba(59,130,246,0.45)',
                      transform: 'translateY(-1px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Create Another Post
                </Button>
                <Button
                  variant="text"
                  fullWidth
                  onClick={() => setShowModal(false)}
                  sx={{
                    borderRadius: 3,
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 1.2,
                    color: 'text.secondary',
                    '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)' }
                  }}
                >
                  Close
                </Button>
              </Stack>
            )}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
