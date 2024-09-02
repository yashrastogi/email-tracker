import axios from 'axios';

const API_BASE_URL = 'https://chat.yashrastogi.in'; // Update this if your backend is hosted elsewhere

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const generateTrackingLink = async (label) => {
  try {
    const response = await api.post('/generate-tracking-link', { label });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getActiveTrackingIds = async () => {
  try {
    const response = await api.get('/active-tracking-ids');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrackingData = async (trackingId) => {
  try {
    const response = await api.get(`/tracking-data/${trackingId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const setStrike = async (trackingId, openedAt) => {
  try {
    const response = await api.post('/strike-open', { trackingId, openedAt });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTrackingId = async (pass, trackingId) => {
  try {
    const response = await api.post('/delete-tracking-link', { pass, trackingId });
    return response.data;
  } catch (error) {
    throw error;
  }
};