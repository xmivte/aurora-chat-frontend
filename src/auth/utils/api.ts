import axios from 'axios';

import { BACKEND_URL } from '../../config/env';
import { getToken } from '../utils/fireBaseToken';

export const api = axios.create({
  baseURL: BACKEND_URL,
});

api.interceptors.request.use(async config => {
  const token = await getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
