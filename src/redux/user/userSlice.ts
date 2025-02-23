import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserState } from "./types";
import { registerUser, loginUser } from "./userThunks"; // 👈 Importamos los thunks

const initialState: UserState = {
    id: null,
    primerNombre: "",
    segundoNombre: null,
    primerApellido: "",
    segundoApellido: null,
    fechaNacimiento: null,
    sexo: null,
    correoElectronico: "",
    perfil: null,
    loading: false,
    error: null,
    success: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        resetUserState: (state) => {
            return { ...initialState };
        },
        updateUserField: <K extends keyof UserState>(
            state: UserState,
            action: PayloadAction<{ field: K; value: UserState[K] }>
        ) => {
            state[action.payload.field] = action.payload.value;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                return {
                    ...state,
                    ...action.payload,
                    loading: false,
                    success: true,
                };
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                if (action.payload) {
                    return {
                        ...state,
                        ...action.payload,
                        loading: false,
                        success: true,
                    };
                } else {
                    state.loading = false;
                    state.error = "Correo o contraseña incorrectos";
                }
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

// ✅ Exportamos las acciones correctamente
export const { resetUserState, updateUserField } = userSlice.actions; // 👈 Asegúrate de exportarlo
export default userSlice.reducer;
