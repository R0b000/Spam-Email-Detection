import { useState } from 'react';
import API from '../Manager/Service/api';
import type { ServiceUrlObject } from '../Manager/Service/api.urls';

export interface UseApiResult {
  call: (payload?: any, type?: string) => Promise<void>;
  response: any;
  data: any;
  status: number | null;
  error: string;
  isLoading: boolean;
}

/**
 * React hook that wraps a service-call and exposes loading/error/response state.
 * Drop-in replacement for the old hooks/useApi.ts — just moved into Helper/.
 */
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
      console.log(res);
      setResponse(res.data);
      setData(res.data);
      setStatus(res.status);
    } catch (err: any) {
      console.error(err);
      setError('User-defined error message: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { call, response, data, status, error, isLoading };
};

export default useApi;