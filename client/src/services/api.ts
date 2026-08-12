import axios from 'axios';
import type { ServiceUrlObject } from './api.urls';

export const API_URI = 'http://localhost:3001';

interface RequestData {
  params?: unknown;
  urlParams?: unknown;
  [key: string]: unknown;
}

const API_Email = async (
  serviceUrlObject: ServiceUrlObject,
  requestData: RequestData = {},
  type = ''
): Promise<any> => {
  const { params, urlParams, ...body } = requestData;

  return await axios({
    method: serviceUrlObject.method,
    url: `${API_URI}/${serviceUrlObject.endpoint}/${type}`,
    params: urlParams, // Pass URL parameters separately
    data: body, // Pass request body as data
  });
};

export default API_Email;