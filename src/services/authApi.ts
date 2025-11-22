const AUTH_API_URL = 'http://127.0.0.1:8000/api/auth';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id: number;
    email: string;
    name?: string;
  };
}

// Token management
export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('authToken', token);
  }
};

export const removeToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('authToken');
  }
};

export const login = async (loginData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(loginData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to login' }));
      throw new Error(errorData.message || 'Failed to login');
    }
    
    const result = await response.json();
    const data = result.success && result.data ? result.data : result;
    
    if (data.token) {
      setToken(data.token);
    }
    
    return {
      token: data.token || data.access_token || '',
      user: data.user || data,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const register = async (registerData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(registerData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Failed to register' }));
      throw new Error(errorData.message || 'Failed to register');
    }
    
    const result = await response.json();
    const data = result.success && result.data ? result.data : result;
    
    if (data.token) {
      setToken(data.token);
    }
    
    return {
      token: data.token || data.access_token || '',
      user: data.user || data,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : 'Unknown error occurred');
  }
};

export const logout = (): void => {
  removeToken();
};

