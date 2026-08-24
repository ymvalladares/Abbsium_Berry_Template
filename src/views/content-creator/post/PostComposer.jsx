import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Stack,
  Button,
  CircularProgress
} from '@mui/material';
import { alpha, useColorScheme } from '@mui/material/styles';
import {
  IconSparkles,
  IconSend,
  IconRefresh,
  IconChevronRight,
  IconChevronLeft
} from '@tabler/icons-react';
import { useNotification } from 'contexts/NotificationContext';
import { useConnections } from '../../../hooks/useConnections';
import { usePublish } from '../../../hooks/usePublish';
import PlatformSelector from './components/PlatformSelector';
import ContentEditor from './components/ContentEditor';
import ReviewPanel from './components/ReviewPanel';
import PublishModal from './components/PublishModal';
import Stepper from './components/Stepper';
import { AuroraLayer, glassCard, GRADIENT_MAIN } from './aiUi';

const STEP_LABELS = ['Platforms', 'Content', 'Review'];

export default function PostComposer() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const notify = useNotification();

  const { connectedPlatforms, pages, loadingPages, fetchPages } = useConnections();

  const {
    posting,
    results,
    networkStatuses,
    publishSummary,
    showModal,
    setShowModal,
    successCount,
    publish
  } = usePublish({ notify });

  const [step, setStep] = useState(0);
  const [platforms, setPlatforms] = useState([]);
  const [type, setType] = useState('post');
  const [files, setFiles] = useState([]);
  const [title, setTitle] = useState('Summer Collection 2026');
  const [description, setDescription] = useState('New arrivals are here. Shop now and get 20% off.\n\n#Summer #NewCollection');
  const [prompt, setPrompt] = useState('');
  const [scheduleType, setScheduleType] = useState('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [fileError, setFileError] = useState(null);

  useEffect(() => {
    fetchPages();
  }, [fetchPages]);

  const validateAndSetFile = useCallback((f) => {
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
  }, []);

  const handleFileDrop = useCallback((f) => {
    if (validateAndSetFile(f)) {
      setFiles([f]);
    } else {
      notify.error(fileError, 'File Validation Error');
    }
  }, [validateAndSetFile, fileError, notify]);

  const handleFileRemove = useCallback(() => {
    setFiles([]);
    setFileError(null);
  }, []);

  const toggle = useCallback((id) => setPlatforms((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id])), []);
  const selectAll = useCallback(() => setPlatforms(connectedPlatforms), [connectedPlatforms]);
  const clearAll = useCallback(() => setPlatforms([]), []);

  const file = files[0];
  const hasContent = title?.trim() || description?.trim();
  const mode = 'manual';
  const canNext = useMemo(() =>
    step === 0 ? platforms.length > 0 : step === 1 ? (mode === 'ai' || files.length > 0) && hasContent : true,
    [step, platforms, mode, files, hasContent]
  );

  const handlePublish = useCallback(() => {
    publish({
      file,
      title,
      description,
      platforms,
      type,
      scheduleType,
      scheduledDate,
      scheduledTime,
      reset
    });
  }, [publish, file, title, description, platforms, type, scheduleType, scheduledDate, scheduledTime]);

  const reset = useCallback(() => {
    setPlatforms([]);
    setType('post');
    setFiles([]);
    setTitle('');
    setDescription('');
    setPrompt('');
    setStep(0);
    setShowModal(false);
    setScheduleType('now');
    setScheduledDate('');
    setScheduledTime('');
    setFileError(null);
  }, [setShowModal]);

  return (
    <Box sx={{ py: { xs: 1, sm: 2 }, px: { xs: 0, sm: 1 }, width: '100%', position: 'relative' }}>
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

      <Stepper step={step} />

      <Box sx={{ ...glassCard(isDark), boxShadow: 'none', border: `1px solid ${isDark ? 'rgba(255,255,255,0.09)' : 'rgba(59,130,246,0.16)'}`, borderRadius: 3, overflow: 'hidden' }}>
        <AuroraLayer isDark={isDark} />
        <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, position: 'relative', zIndex: 1 }}>
          {step === 0 && (
            <PlatformSelector
              platforms={platforms}
              onToggle={toggle}
              onSelectAll={selectAll}
              onClearAll={clearAll}
              connectedPlatforms={connectedPlatforms}
              pages={pages}
              loadingPages={loadingPages}
            />
          )}

          {step === 1 && (
            <ContentEditor
              type={type}
              onTypeChange={setType}
              file={file}
              onFileDrop={handleFileDrop}
              onFileRemove={handleFileRemove}
              title={title}
              onTitleChange={setTitle}
              description={description}
              onDescriptionChange={setDescription}
              prompt={prompt}
              onPromptChange={setPrompt}
              fileError={fileError}
              onFileErrorClear={() => setFileError(null)}
            />
          )}

          {step === 2 && (
            <ReviewPanel
              platforms={platforms}
              pages={pages}
              type={type}
              file={file}
              title={title}
              description={description}
              scheduleType={scheduleType}
              scheduledDate={scheduledDate}
              scheduledTime={scheduledTime}
              onScheduleTypeChange={setScheduleType}
              onScheduledDateChange={setScheduledDate}
              onScheduledTimeChange={setScheduledTime}
            />
          )}
        </Box>

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
              onClick={handlePublish}
              variant="contained"
              sx={{ px: 2.5, textTransform: 'none', fontWeight: 600, background: scheduleType === 'scheduled' ? 'linear-gradient(135deg, #4CAF50, #66BB6A)' : GRADIENT_MAIN }}
            >
              {posting ? 'Processing...' : scheduleType === 'scheduled' ? 'Schedule Post' : 'Publish'}
            </Button>
          ) : null}
        </Box>
      </Box>

      <PublishModal
        open={showModal}
        onClose={() => setShowModal(false)}
        posting={posting}
        networkStatuses={networkStatuses}
        publishSummary={publishSummary}
        platforms={platforms}
        successCount={successCount}
        onReset={reset}
      />
    </Box>
  );
}
