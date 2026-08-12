import { useState } from 'react';
import API from '../services/api';
import type { ServiceUrlObject } from '../services/api.urls';

export interface UseApiResult {
  call: (payload?: any, type?: string) => Promise<void>;
  response: any;
  data: any;
  status: number | null;
  error: string;
  isLoading: boolean;
}

const useApi = (urlObject: ServiceUrlObject): UseApiResult => {
  const [response, setResponse] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const call = async (payload: any = {}, type = '') => {
    setResponse(null);
    setData(null);
    setStatus(null);
    setIsLoading(true);
    setError('');

    try {
      const res = await API(urlObject, payload, type);
      console.log(res); // Log the response object
      setResponse(res.data);
      setData(res.data);
      setStatus(res.status);
    } catch (err: any) {
      console.error(err); // Log any errors
      setError('User-defined error message: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { call, response, data, status, error, isLoading };
};

export default useApi;