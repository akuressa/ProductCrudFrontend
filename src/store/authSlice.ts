import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { login, register, logout, getToken, LoginData, RegisterData, AuthResponse } from '../services/authApi';

export interface User {
  id: number;
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  token: getToken(),
  isAuthenticated: !!getToken(),
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await login(loginData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to login'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterData, { rejectWithValue }) => {
    try {
      const response = await register(registerData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to register'
      );
    }
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  logout();
  return null;
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<AuthResponse>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
        state.error = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;

