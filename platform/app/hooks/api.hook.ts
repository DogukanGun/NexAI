import { useState, useCallback } from 'react';
import { ApiService } from '../../services/ApiService';

type ApiPath = 
  | 'login'
  | 'register'
  | 'profile'
  | 'user';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

interface ApiHookOptions {
  path: ApiPath;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params?: Record<string, any>;
}

export function useApi<T>() {
  const [state, setState] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const apiService = ApiService.getInstance();

  const callApi = useCallback(async ({ path, params }: ApiHookOptions) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      let response: T;

      switch (path) {
        case 'login':
          if (!params?.username || !params?.password) {
            throw new Error('Username and password are required for login');
          }
          response = await apiService.login(params.username, params.password) as T;
          break;

        case 'register':
          if (!params?.username || !params?.email || !params?.password) {
            throw new Error('Username, email and password are required for registration');
          }
          response = await apiService.register({
            username: params.username,
            email: params.email,
            password: params.password,
          }) as T;
          break;

        case 'profile':
          response = await apiService.getProfile() as T;
          break;

        case 'user':
          if (!params?.id) {
            throw new Error('User ID is required');
          }
          response = await apiService.getUserById(
            params.id,
            params.withFiles || false
          ) as T;
          break;

        default:
          throw new Error(`Unknown API path: ${path}`);
      }

      setState({
        data: response,
        loading: false,
        error: null,
      });

      return response;
    } catch (error) {
      setState({
        data: null,
        loading: false,
        error: error instanceof Error ? error : new Error('An unknown error occurred'),
      });
      throw error;
    }
  }, []);

  return {
    ...state,
    callApi,
  };
}
