import { useState, useRef, useCallback, useEffect } from 'react';
import { socialAPI } from '../services/AxiosService';
import publishingSignalR from '../services/PublishingSignalRService';

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'youtube', name: 'YouTube' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'twitter', name: 'X' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'pinterest', name: 'Pinterest' }
];

const SUPPORTED_PLATFORMS = ['Facebook', 'Instagram', 'YouTube', 'TikTok'];

function getPlatformId(name) {
  return PLATFORMS.find((p) => p.name === name)?.id || name.toLowerCase();
}

export function usePublish({ notify }) {
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState(null);
  const [networkStatuses, setNetworkStatuses] = useState({});
  const [publishSummary, setPublishSummary] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const progressIntervalRef = useRef(null);
  const fallbackTimeoutRef = useRef(null);
  const listenersRegisteredRef = useRef(false);

  const cleanupTimers = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (fallbackTimeoutRef.current) {
      clearTimeout(fallbackTimeoutRef.current);
      fallbackTimeoutRef.current = null;
    }
  }, []);

  const removeListeners = useCallback(() => {
    publishingSignalR.off('publish_started', handlePublishStarted);
    publishingSignalR.off('network_status', handleNetworkStatus);
    publishingSignalR.off('publish_finished', handlePublishFinishedWithCleanup);
    publishingSignalR.off('error', handleError);
    listenersRegisteredRef.current = false;
  }, []);

  function handlePublishStarted(data) {
    console.log('Publish started:', data);
  }

  function handleNetworkStatus(data) {
    console.log('Network status:', data);
    const platformId = getPlatformId(data.network);
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
  }

  const finalizePublish = useCallback((data) => {
    cleanupTimers();
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
    Object.keys(data).forEach((id) => {
      r[id] = 'err';
    });
    setNetworkStatuses((prev) => {
      Object.keys(prev).forEach((id) => {
        r[id] = prev[id]?.status === 'success' ? 'ok' : 'err';
      });
      return prev;
    });
    setResults(r);

    removeListeners();
  }, [notify, cleanupTimers, removeListeners]);

  function handlePublishFinished(data) {
    console.log('Publish finished:', data);
    finalizePublish(data);
  }

  function handlePublishFinishedWithCleanup(data) {
    clearTimeout(fallbackTimeoutRef.current);
    cleanupTimers();
    handlePublishFinished(data);
  }

  function handleError(error) {
    console.error('SignalR error:', error);
    setPosting(false);
    notify.error('Real-time connection error', 'SignalR Error');
    cleanupTimers();
    removeListeners();
  }

  useEffect(() => {
    return () => {
      cleanupTimers();
      removeListeners();
      publishingSignalR.stop();
    };
  }, [cleanupTimers, removeListeners]);

  const validateFile = useCallback((f) => {
    if (!f) return true;

    const isVideo = f.type.startsWith('video');
    const isImage = f.type.startsWith('image');

    if (!isVideo && !isImage) {
      notify.error('Only image and video files are allowed', 'File Validation Error');
      return false;
    }

    if (isVideo) {
      if (f.type !== 'video/mp4' && !f.name.toLowerCase().endsWith('.mp4')) {
        notify.error('Video must be MP4 format', 'File Validation Error');
        return false;
      }
      const maxSize = 256 * 1024 * 1024;
      if (f.size > maxSize) {
        notify.error('Video must be under 256MB', 'File Validation Error');
        return false;
      }
    }

    if (isImage) {
      const maxSize = 10 * 1024 * 1024;
      if (f.size > maxSize) {
        notify.error('Images must be under 10MB', 'File Validation Error');
        return false;
      }
    }

    return true;
  }, [notify]);

  const publish = useCallback(async ({
    file,
    title,
    description,
    platforms,
    type,
    scheduleType,
    scheduledDate,
    scheduledTime,
    reset
  }) => {
    if (posting) return;

    if (file && !validateFile(file)) {
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
    setShowModal(false);
    setNetworkStatuses({});
    setUploadProgress(0);
    setPublishSummary(null);

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

      if (scheduleType === 'scheduled') {
        const localDate = new Date(`${scheduledDate}T${scheduledTime}`);
        const payload = {
          videoUrl: s3Url,
          title: title ?? '',
          caption: description ?? '',
          platforms: platformNames,
          isShort: type === 'reel',
          scheduleType: 'scheduled',
          scheduledFor: localDate.toISOString()
        };

        const publishResponse = await socialAPI.publishAsync(payload);

        if (publishResponse.data.status === 'scheduled') {
          setPosting(false);
          notify.success(`Post scheduled for ${new Date(publishResponse.data.scheduledFor).toLocaleString()}`, 'Post Scheduled');
          window.dispatchEvent(new Event('refresh-scheduled-posts'));
          if (reset) reset();
          return;
        } else {
          setPosting(false);
          notify.error('Failed to schedule post', 'Schedule Error');
          return;
        }
      }

      const token = localStorage.getItem('token');

      publishingSignalR.on('publish_started', handlePublishStarted);
      publishingSignalR.on('network_status', handleNetworkStatus);
      publishingSignalR.on('publish_finished', handlePublishFinishedWithCleanup);
      publishingSignalR.on('error', handleError);
      listenersRegisteredRef.current = true;

      await publishingSignalR.start(token);

      const initialStatuses = {};
      platformNames.forEach((name) => {
        const platformId = getPlatformId(name);
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
      const newSessionId = publishResponse.data.sessionId;
      console.log('Session ID:', newSessionId);

      progressIntervalRef.current = setInterval(() => {
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
          return Object.keys(updated).length > 0 ? updated : prev;
        });
      }, 500);

      fallbackTimeoutRef.current = setTimeout(() => {
        setNetworkStatuses((prev) => {
          const successful = Object.values(prev).filter((s) => s.status === 'success').length;
          const total = Object.keys(prev).length;
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
          return prev;
        });
        cleanupTimers();
        removeListeners();
      }, 60000);
    } catch (err) {
      console.error('Publish error:', err);
      setPosting(false);
      notify.error(err.response?.data?.errorMessage || err.response?.data?.message || 'Publish failed', 'Publish Error');
      const r = {};
      platforms.forEach((p) => {
        r[p] = 'err';
      });
      setResults(r);
      cleanupTimers();
      removeListeners();
    }
  }, [posting, validateFile, notify, cleanupTimers, removeListeners]);

  const successCount = results ? Object.values(results).filter((v) => v === 'ok').length : 0;

  return {
    posting,
    results,
    networkStatuses,
    publishSummary,
    showModal,
    setShowModal,
    uploadProgress,
    successCount,
    publish
  };
}
