import { createAsyncThunk } from "@reduxjs/toolkit";
import { Usuario } from "../../domain/entities/Usuario";
import { useCases } from "../../di/dependencyProvider"; // Importamos las dependencias inyectadas

// ✅ Registro de usuario
export const registerUser = createAsyncThunk<
    Usuario,
    { usuario: Usuario; password: string; confirmPassword: string; acceptTerms: boolean },
    { rejectValue: string }
>(
    "user/registerUser",
    async ({ usuario, password, confirmPassword, acceptTerms }, { rejectWithValue }) => {
        try {
            await useCases.createUser.ejecutar(usuario, password, confirmPassword, acceptTerms);
            return usuario;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// ✅ Login de usuario
export const loginUser = createAsyncThunk<
    Usuario | null, // Retorna un usuario si el login es exitoso, o `null` si falla
    { correo: string; contraseña: string }, // Argumentos esperados
    { rejectValue: string }
>(
    "user/loginUser",
    async ({ correo, contraseña }, { rejectWithValue }) => {
        try {
            const usuario = await useCases.loginUser.ejecutar(correo, contraseña);

            if (!usuario) {
                return rejectWithValue("Correo o contraseña incorrectos");
            }

            return usuario;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

