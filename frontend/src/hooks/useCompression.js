import { useState, useRef } from 'react';
import { uploadVideo, getStatus } from '../utils/api';

export function useCompression() {
  const [state, setState] = useState({ status: 'idle', progress: 0, uploadProgress: 0, video: null, error: null });
  const pollRef = useRef(null);

  const compress = async (file, targetSize) => {
    setState({ status: 'uploading', progress: 0, uploadProgress: 0, video: null, error: null });
    try {
      const fd = new FormData();
      fd.append('video', file);
      fd.append('targetSize', targetSize);
      const { data } = await uploadVideo(fd, pct => setState(s => ({ ...s, uploadProgress: pct })));

      setState(s => ({ ...s, status: 'compressing', progress: 0 }));
      pollRef.current = setInterval(async () => {
        try {
          const { data: v } = await getStatus(data.id);
          setState(s => ({ ...s, progress: v.progress, video: v }));
          if (v.status === 'done' || v.status === 'error') {
            clearInterval(pollRef.current);
            setState(s => ({ ...s, status: v.status, video: v, error: v.error || null }));
          }
        } catch {}
      }, 1500);
    } catch (err) {
      setState(s => ({ ...s, status: 'error', error: err.response?.data?.error || 'Upload failed' }));
    }
  };

  const reset = () => {
    clearInterval(pollRef.current);
    setState({ status: 'idle', progress: 0, uploadProgress: 0, video: null, error: null });
  };

  return { ...state, compress, reset };
}
