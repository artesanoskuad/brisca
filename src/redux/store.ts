import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice';
import authReducer from "./auth/authSlice";
import loginReducer from './login/loginSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        auth: authReducer,
        login: loginReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
