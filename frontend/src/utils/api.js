import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:5000/api' });

export const uploadVideo = (formData, onProgress) =>
  api.post('/videos/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: e => onProgress && onProgress(Math.round((e.loaded / e.total) * 100))
  });

export const getStatus = id => api.get(`/videos/${id}`);
export const getAllVideos = () => api.get('/videos');
export const deleteVideo = id => api.delete(`/videos/${id}`);
