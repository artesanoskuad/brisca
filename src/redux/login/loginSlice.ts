// src/store/slices/loginSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { User } from '../../domain/entities/User';
import { HardwareSupport } from '../../domain/entities/HardwareSupport';
import { LoginLockedException } from '../../domain/exceptions/LoginLockedException';
import { LoginWithEmail } from '../../domain/usecases/LoginWithEmail';
import { LoginWithFingerprint } from '../../domain/usecases/LoginWithFingerprint';
import { LoginWithFace } from '../../domain/usecases/LoginWithFace';

// Para este ejemplo, usamos implementaciones dummy para los datasources.
// En producción, inyecta las implementaciones reales o utiliza una factory.
const loginWithEmailUseCase = new LoginWithEmail({
  login: async (email: string, password: string) => {
    // Simula un login exitoso con email.
    return new User("1", "Usuario Email", email);
  },
});

const loginWithFingerprintUseCase = new LoginWithFingerprint({
  login: async () => {
    // Simula un login exitoso con huella.
    return new User("2", "Usuario Huella", "huella@example.com");
  },
});

const loginWithFaceUseCase = new LoginWithFace({
  login: async () => {
    // Simula un login exitoso con reconocimiento facial.
    return new User("3", "Usuario Face", "face@example.com");
  },
});

// Definición del estado del slice
export interface LoginState {
  loading: boolean;
  user?: User;
  error?: string;
  lockRemainingSeconds?: number;
  hardwareSupport?: HardwareSupport;
}

const initialState: LoginState = {
  loading: false,
  user: undefined,
  error: undefined,
  lockRemainingSeconds: undefined,
  hardwareSupport: undefined,
};

// Thunk para login con Email
export const loginWithEmailThunk = createAsyncThunk<
  User,
  { email: string; password: string },
  { rejectValue: { message: string; lockRemainingSeconds?: number } }
>('login/loginWithEmail', async (params, thunkAPI) => {
  try {
    const result = await loginWithEmailUseCase.execute(params.email, params.password);
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof LoginLockedException) {
        return thunkAPI.rejectWithValue({
          message: error.message,
          lockRemainingSeconds: error.remainingSeconds,
        });
      }
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return result.value as User;
  } catch (e: any) {
    return thunkAPI.rejectWithValue({ message: e.message || 'Error inesperado' });
  }
});

// Thunk para login con Huella
export const loginWithFingerprintThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: { message: string; lockRemainingSeconds?: number } }
>('login/loginWithFingerprint', async (_, thunkAPI) => {
  try {
    const result = await loginWithFingerprintUseCase.execute();
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof LoginLockedException) {
        return thunkAPI.rejectWithValue({
          message: error.message,
          lockRemainingSeconds: error.remainingSeconds,
        });
      }
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return result.value as User;
  } catch (e: any) {
    return thunkAPI.rejectWithValue({ message: e.message || 'Error inesperado' });
  }
});

// Thunk para login con Face
export const loginWithFaceThunk = createAsyncThunk<
  User,
  void,
  { rejectValue: { message: string; lockRemainingSeconds?: number } }
>('login/loginWithFace', async (_, thunkAPI) => {
  try {
    const result = await loginWithFaceUseCase.execute();
    if (result.isLeft()) {
      const error = result.value;
      if (error instanceof LoginLockedException) {
        return thunkAPI.rejectWithValue({
          message: error.message,
          lockRemainingSeconds: error.remainingSeconds,
        });
      }
      return thunkAPI.rejectWithValue({ message: error.message });
    }
    return result.value as User;
  } catch (e: any) {
    return thunkAPI.rejectWithValue({ message: e.message || 'Error inesperado' });
  }
});

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    resetLoginState(state) {
      state.loading = false;
      state.user = undefined;
      state.error = undefined;
      state.lockRemainingSeconds = undefined;
    },
    setHardwareSupport(state, action) {
      state.hardwareSupport = action.payload;
    },
  },
  extraReducers: builder => {
    // Caso de login con Email
    builder
      .addCase(loginWithEmailThunk.pending, state => {
        state.loading = true;
        state.error = undefined;
        state.lockRemainingSeconds = undefined;
      })
      .addCase(loginWithEmailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithEmailThunk.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload.message;
          state.lockRemainingSeconds = action.payload.lockRemainingSeconds;
        } else {
          state.error = action.error.message;
        }
      });
    // Caso de login con Huella
    builder
      .addCase(loginWithFingerprintThunk.pending, state => {
        state.loading = true;
        state.error = undefined;
        state.lockRemainingSeconds = undefined;
      })
      .addCase(loginWithFingerprintThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithFingerprintThunk.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload.message;
          state.lockRemainingSeconds = action.payload.lockRemainingSeconds;
        } else {
          state.error = action.error.message;
        }
      });
    // Caso de login con Face
    builder
      .addCase(loginWithFaceThunk.pending, state => {
        state.loading = true;
        state.error = undefined;
        state.lockRemainingSeconds = undefined;
      })
      .addCase(loginWithFaceThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginWithFaceThunk.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload.message;
          state.lockRemainingSeconds = action.payload.lockRemainingSeconds;
        } else {
          state.error = action.error.message;
        }
      });
  },
});

export const { resetLoginState, setHardwareSupport } = loginSlice.actions;
export default loginSlice.reducer;
