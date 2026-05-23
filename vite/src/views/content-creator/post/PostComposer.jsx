import React, { useState, useCallback, useMemo } from 'react';
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
  Divider
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
  IconConfetti
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
    const r = {};
    const text = `${title}${caption ? '\n\n' + caption : ''}`;

    for (const p of platforms) {
      setProgress((prev) => ({ ...prev, [p]: 0 }));
      const tick = setInterval(() => setProgress((prev) => ({ ...prev, [p]: Math.min((prev[p] || 0) + 10, 90) })), 150);
      try {
        if (p === 'facebook') await socialAPI.postFacebook({ message: text, photoUrl: file ? await toBase64(file) : '', caption: text });
        else await new Promise((ok) => setTimeout(ok, 1200));
        clearInterval(tick);
        setProgress((prev) => ({ ...prev, [p]: 100 }));
        r[p] = 'ok';
      } catch {
        clearInterval(tick);
        setProgress((prev) => ({ ...prev, [p]: -1 }));
        r[p] = 'err';
      }
    }

    setResults(r);
    setPosting(false);
    setShowModal(true);

    const ok = Object.values(r).filter((v) => v === 'ok').length;
    if (ok === 0) showSnackbar('Publish failed', 'error');
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
  };

  const plat = (id) => PLATFORMS.find((p) => p.id === id);
  const successCount = results ? Object.values(results).filter((v) => v === 'ok').length : 0;

  return (
    <Box sx={{ py: 3, display: 'flex', justifyContent: 'center' }}>
      <Box sx={{ width: '100%', maxWidth: 780 }}>
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
          <Box sx={{ p: 3 }}>
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
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(3, 1fr)', sm: 'repeat(4, 1fr)' }, gap: 1 }}>
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

            {/* Step 2 */}
            {step === 2 && (
              <Stack spacing={2.5}>
                {/* Main preview row */}
                <Stack direction="row" spacing={2}>
                  {/* Media thumbnail */}
                  {file ? (
                    <Box sx={{ width: 80, height: 80, borderRadius: 2, overflow: 'hidden', bgcolor: 'grey.100', flexShrink: 0 }}>
                      {file.type.startsWith('image') ? (
                        <Box component="img" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <Box component="video" src={preview} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        width: 80,
                        height: 80,
                        borderRadius: 2,
                        bgcolor: 'grey.50',
                        border: '1px dashed',
                        borderColor: 'divider',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      <IconPhoto size={24} style={{ color: '#ccc' }} />
                    </Box>
                  )}

                  {/* Content info */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {title || 'Untitled'}
                    </Typography>
                    <Typography
                      sx={{
                        color: 'text.secondary',
                        fontSize: '0.8rem',
                        lineHeight: 1.5,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {caption || 'No caption'}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                      <Chip
                        label={TYPES.find((t) => t.id === type)?.label}
                        size="small"
                        sx={{ borderRadius: 1.5, fontWeight: 600, height: 22, fontSize: '0.7rem' }}
                      />
                      {file && (
                        <Chip
                          label={(file.size / 1024 / 1024).toFixed(1) + ' MB'}
                          size="small"
                          sx={{ borderRadius: 1.5, height: 22, fontSize: '0.7rem', bgcolor: 'grey.100' }}
                        />
                      )}
                    </Stack>
                  </Box>
                </Stack>

                {/* Divider */}
                <Divider />

                {/* Platforms section */}
                <Box>
                  <Typography sx={{ fontWeight: 600, fontSize: '0.8rem', mb: 1.5, color: 'text.secondary' }}>WILL PUBLISH ON</Typography>
                  <Stack spacing={0.75}>
                    {platforms.map((id) => {
                      const p = plat(id);
                      if (!p) return null;
                      const Icon = p.icon;
                      return (
                        <Stack
                          key={id}
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                          sx={{ p: 1, borderRadius: 1.5, bgcolor: alpha(p.color, 0.03) }}
                        >
                          <Box
                            sx={{
                              width: 28,
                              height: 28,
                              borderRadius: 1.5,
                              bgcolor: p.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            <Icon size={14} style={{ color: '#fff' }} />
                          </Box>
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>{p.name}</Typography>
                          <IconCheck size={16} color="#4CAF50" />
                        </Stack>
                      );
                    })}
                  </Stack>
                </Box>
              </Stack>
            )}
          </Box>

          {/* Footer */}
          <Box sx={{ borderTop: '1px solid', borderColor: 'divider', p: 1.5, display: 'flex', justifyContent: 'space-between' }}>
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
                          <Typography sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{p?.name}</Typography>
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
                      <Typography sx={{ fontWeight: 600, fontSize: '0.85rem', flex: 1 }}>{p?.name}</Typography>
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
