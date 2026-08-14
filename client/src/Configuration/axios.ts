import axios from 'axios';

export const API_URI = 'http://localhost:3001';

/** Singleton Axios instance pre-configured with the backend base URL. */
const httpClient = axios.create({
  baseURL: API_URI,
});

export default httpClient;