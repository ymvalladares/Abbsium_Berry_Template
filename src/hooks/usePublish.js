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
  const networkStatusesRef = useRef({});
  const finalizedRef = useRef(false);
  const handlersRef = useRef({});
  const notifyRef = useRef(notify);
  notifyRef.current = notify;

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

  const finalizePublish = useCallback((data) => {
    if (finalizedRef.current) return;
    finalizedRef.current = true;

    cleanupTimers();

    setNetworkStatuses((prev) => {
      const r = {};
      Object.keys(prev).forEach((id) => {
        r[id] = prev[id]?.status === 'success' ? 'ok' : 'err';
      });
      return prev;
    });

    const ok = data.successful;
    const total = data.total;

    setPublishSummary({ successful: ok, total: total });
    setPosting(false);

    setNetworkStatuses((prev) => {
      const r = {};
      Object.keys(prev).forEach((id) => {
        r[id] = prev[id]?.status === 'success' ? 'ok' : 'err';
      });
      setResults(r);
      return prev;
    });

    setTimeout(() => {
      if (ok === 0) {
        notifyRef.current.error('Publish failed on all platforms', 'Publish Failed');
      } else if (ok === total) {
        notifyRef.current.success(`Published on ${ok} platform${ok > 1 ? 's' : ''}`, 'Publish Successful');
      } else {
        notifyRef.current.warning(`Published on ${ok} of ${total} platforms`, 'Partial Success');
      }
    }, 0);

    publishingSignalR.off('publish_started', handlersRef.current.publishStarted);
    publishingSignalR.off('network_status', handlersRef.current.networkStatus);
    publishingSignalR.off('publish_finished', handlersRef.current.publishFinished);
    publishingSignalR.off('error', handlersRef.current.error);
  }, [cleanupTimers]);

  useEffect(() => {
    handlersRef.current.publishStarted = function handlePublishStarted(data) {
      console.log('Publish started:', data);
    };

    handlersRef.current.networkStatus = function handleNetworkStatus(data) {
      console.log('Network status:', data);
      const platformId = getPlatformId(data.network);
      const newEntry = {
        status: data.status,
        message: data.message,
        network: data.network,
        postId: data.postId,
        postUrl: data.postUrl,
        error: data.error,
        progress: data.status === 'success' ? 100 : data.status === 'error' ? 0 : (networkStatusesRef.current[platformId]?.progress || 0)
      };
      networkStatusesRef.current = {
        ...networkStatusesRef.current,
        [platformId]: newEntry
      };
      setNetworkStatuses(networkStatusesRef.current);
    };

    handlersRef.current.publishFinished = function handlePublishFinished(data) {
      console.log('Publish finished:', data);
      finalizePublish(data);
    };

    handlersRef.current.error = function handleError(error) {
      console.error('SignalR error:', error);
      if (finalizedRef.current) return;
      finalizedRef.current = true;
      setPosting(false);
      cleanupTimers();
      setTimeout(() => {
        notifyRef.current.error('Real-time connection error', 'SignalR Error');
      }, 0);
      publishingSignalR.off('publish_started', handlersRef.current.publishStarted);
      publishingSignalR.off('network_status', handlersRef.current.networkStatus);
      publishingSignalR.off('publish_finished', handlersRef.current.publishFinished);
      publishingSignalR.off('error', handlersRef.current.error);
    };

    return () => {
      cleanupTimers();
      publishingSignalR.off('publish_started', handlersRef.current.publishStarted);
      publishingSignalR.off('network_status', handlersRef.current.networkStatus);
      publishingSignalR.off('publish_finished', handlersRef.current.publishFinished);
      publishingSignalR.off('error', handlersRef.current.error);
      publishingSignalR.stop();
    };
  }, [cleanupTimers, finalizePublish]);

  const validateFile = useCallback((f) => {
    if (!f) return true;

    const isVideo = f.type.startsWith('video');
    const isImage = f.type.startsWith('image');

    if (!isVideo && !isImage) {
      notifyRef.current.error('Only image and video files are allowed', 'File Validation Error');
      return false;
    }

    if (isVideo) {
      if (f.type !== 'video/mp4' && !f.name.toLowerCase().endsWith('.mp4')) {
        notifyRef.current.error('Video must be MP4 format', 'File Validation Error');
        return false;
      }
      const maxSize = 256 * 1024 * 1024;
      if (f.size > maxSize) {
        notifyRef.current.error('Video must be under 256MB', 'File Validation Error');
        return false;
      }
    }

    if (isImage) {
      const maxSize = 10 * 1024 * 1024;
      if (f.size > maxSize) {
        notifyRef.current.error('Images must be under 10MB', 'File Validation Error');
        return false;
      }
    }

    return true;
  }, []);

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
      notifyRef.current.error('Add a title or description before publishing', 'Missing Content');
      return;
    }

    if (scheduleType === 'scheduled' && (!scheduledDate || !scheduledTime)) {
      notifyRef.current.error('Please select a date and time for scheduling', 'Missing Schedule');
      return;
    }

    if (scheduleType === 'scheduled') {
      const schedDate = new Date(`${scheduledDate}T${scheduledTime}`);
      if (schedDate <= new Date()) {
        notifyRef.current.error('Please select a future date and time', 'Invalid Schedule');
        return;
      }
    }

    setPosting(true);
    setResults(null);
    setShowModal(false);
    setNetworkStatuses({});
    networkStatusesRef.current = {};
    setUploadProgress(0);
    setPublishSummary(null);
    finalizedRef.current = false;

    const platformNames = platforms
      .map((id) => PLATFORMS.find((p) => p.id === id)?.name)
      .filter(Boolean)
      .filter((name) => SUPPORTED_PLATFORMS.includes(name));

    if (platformNames.length === 0) {
      notifyRef.current.warning('Select at least one supported platform (Facebook, Instagram, YouTube, TikTok)', 'No Platform Selected');
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
          notifyRef.current.error('Failed to get upload URL from server', 'Upload Error');
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

      const isVideoFile = file?.type.startsWith('video');

      if (scheduleType === 'scheduled') {
        const localDate = new Date(`${scheduledDate}T${scheduledTime}`);
        const basePayload = {
          title: title ?? '',
          caption: description ?? '',
          platforms: platformNames,
          isShort: type === 'reel',
          scheduleType: 'scheduled',
          scheduledFor: localDate.toISOString()
        };
        const payload = s3Url
          ? (isVideoFile ? { ...basePayload, videoUrl: s3Url } : { ...basePayload, photoUrl: s3Url })
          : basePayload;

        const publishResponse = await socialAPI.publishAsync(payload);

        if (publishResponse.data.status === 'scheduled') {
          setPosting(false);
          notifyRef.current.success(`Post scheduled for ${new Date(publishResponse.data.scheduledFor).toLocaleString()}`, 'Post Scheduled');
          window.dispatchEvent(new Event('refresh-scheduled-posts'));
          if (reset) reset();
          return;
        } else {
          setPosting(false);
          notifyRef.current.error('Failed to schedule post', 'Schedule Error');
          return;
        }
      }

      const token = localStorage.getItem('token');

      publishingSignalR.on('publish_started', handlersRef.current.publishStarted);
      publishingSignalR.on('network_status', handlersRef.current.networkStatus);
      publishingSignalR.on('publish_finished', handlersRef.current.publishFinished);
      publishingSignalR.on('error', handlersRef.current.error);

      await publishingSignalR.start(token);

      const initialStatuses = {};
      platformNames.forEach((name) => {
        const platformId = getPlatformId(name);
        initialStatuses[platformId] = { status: 'uploading', message: 'Starting...', network: name, progress: 0 };
      });
      networkStatusesRef.current = initialStatuses;
      setNetworkStatuses(initialStatuses);
      setShowModal(true);

      const basePublishPayload = {
        title: title ?? '',
        caption: description ?? '',
        platforms: platformNames,
        isShort: type === 'reel'
      };
      const publishPayload = s3Url
        ? (isVideoFile ? { ...basePublishPayload, videoUrl: s3Url } : { ...basePublishPayload, photoUrl: s3Url })
        : basePublishPayload;

      const publishResponse = await socialAPI.publishAsync(publishPayload);
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
        if (finalizedRef.current) return;

        const statuses = networkStatusesRef.current;
        const successful = Object.values(statuses).filter((s) => s.status === 'success').length;
        const total = Object.keys(statuses).length;

        finalizePublish({ successful, total });
      }, 90000);
    } catch (err) {
      console.error('Publish error:', err);
      if (finalizedRef.current) return;
      finalizedRef.current = true;
      setPosting(false);
      setTimeout(() => {
        notifyRef.current.error(err.response?.data?.errorMessage || err.response?.data?.message || 'Publish failed', 'Publish Error');
      }, 0);
      const r = {};
      platforms.forEach((p) => {
        r[p] = 'err';
      });
      setResults(r);
      cleanupTimers();
      publishingSignalR.off('publish_started', handlersRef.current.publishStarted);
      publishingSignalR.off('network_status', handlersRef.current.networkStatus);
      publishingSignalR.off('publish_finished', handlersRef.current.publishFinished);
      publishingSignalR.off('error', handlersRef.current.error);
    }
  }, [posting, validateFile, cleanupTimers]);

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
