import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';

export interface LoginResponse {
  access_token: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
}

interface ErrorResponse {
  message: string;
}

export class ApiService {
  private static instance: ApiService;
  private api: AxiosInstance;
  private token: string | null = null;

  private constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://bachr.nexarb.com';
    
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      withCredentials: true,
      timeout: 60000, // Increase timeout to 60 seconds
    });

    // Add request interceptor to add auth token
    this.api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          throw new Error(error.response.data?.message || 'An error occurred');
        } else if (error.request) {
          // The request was made but no response was received
          throw new Error('No response from server. Please check your connection.');
        } else {
          // Something happened in setting up the request that triggered an Error
          throw new Error('Error setting up the request');
        }
      }
    );
  }

  public static getInstance(): ApiService {
    if (!ApiService.instance) {
      ApiService.instance = new ApiService();
    }
    return ApiService.instance;
  }

  // Auth endpoints
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/auth/login', {
        username,
        password,
      });
      this.token = response.data.access_token;
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Login failed: ${error.message}`);
      }
      throw new Error('Login failed: Unknown error');
    }
  }

  async register(userData: RegisterDto): Promise<LoginResponse> {
    try {
      const response = await this.api.post<LoginResponse>('/register', userData);
      this.token = response.data.access_token;
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed: Unknown error');
    }
  }

  // User endpoints
  async getUserById(id: string, withFiles: boolean = false): Promise<User> {
    try {
      const response = await this.api.get<User>(`/users/${id}`, {
        params: { withFiles },
      });
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get user: ${error.message}`);
      }
      throw new Error('Failed to get user: Unknown error');
    }
  }

  // Profile endpoints
  async getProfile(): Promise<User> {
    try {
      const response = await this.api.get<User>('/profile');
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to get profile: ${error.message}`);
      }
      throw new Error('Failed to get profile: Unknown error');
    }
  }

  // Helper method to set token manually (useful for persistence)
  setToken(token: string) {
    this.token = token;
  }

  // Helper method to clear token (useful for logout)
  clearToken() {
    this.token = null;
  }

  // Verification endpoints
  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      // Set a longer timeout specifically for verification endpoint
      const response = await this.api.get(`/verification/verify?token=${token}`, {
        timeout: 60000 // 60 seconds timeout for verification endpoint
      });
      return { 
        success: true, 
        message: 'Email verification successful'
      };
    } catch (error) {
      if (error instanceof Error) {
        return { 
          success: false, 
          message: `Verification failed: ${error.message}`
        };
      }
      return { 
        success: false, 
        message: 'Verification failed: Unknown error'
      };
    }
  }

  async resendVerificationEmail(userId: string, email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await this.api.post('/verification/resend', { userId, email });
      return { 
        success: true, 
        message: 'Verification email sent successfully'
      };
    } catch (error) {
      if (error instanceof Error) {
        return { 
          success: false, 
          message: `Failed to resend verification email: ${error.message}`
        };
      }
      return { 
        success: false, 
        message: 'Failed to resend verification email: Unknown error'
      };
    }
  }

  async checkVerificationStatus(userId: string): Promise<{ isVerified: boolean }> {
    try {
      const response = await this.api.get<{ userId: string; isVerified: boolean }>(`/verification/status/${userId}`);
      return { isVerified: response.data.isVerified };
    } catch (error) {
      return { isVerified: false };
    }
  }
}
