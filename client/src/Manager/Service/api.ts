import httpClient from '../../Configuration/axios';
import type { ServiceUrlObject } from './api.urls';

interface RequestData {
  params?: unknown;
  urlParams?: unknown;
  [key: string]: unknown;
}

/**
 * Service function that calls the backend API using the pre-configured axios client.
 *
 * @param serviceUrlObject - endpoint + method definition from api.urls
 * @param requestData      - optional params, urlParams, and body data
 * @param type             - URL segment appended after the endpoint (e.g. email type)
 */
const API_Email = async (
  serviceUrlObject: ServiceUrlObject,
  requestData: RequestData = {},
  type = ''
): Promise<any> => {
  const { params, urlParams, ...body } = requestData;

  return await httpClient({
    method: serviceUrlObject.method,
    url: `/${serviceUrlObject.endpoint}/${type}`,
    params: urlParams,
    data: body,
  });
};

export default API_Email;