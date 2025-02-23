import { RegistrationError } from "../entities/RegistrationError";

export class IsValidPassword {
    ejecutar(contraseña: string): boolean {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d!@#$%^&*]{8,}$/;
        if (!regex.test(contraseña)) {
            throw new Error(RegistrationError.INVALID_PASSWORD);
        }

        return true;
    }
}