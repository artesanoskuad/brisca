import { RegistrationError } from '../entities/RegistrationError';

export class IsValidEmail {
    ejecutar(correo: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(correo)) {
            throw new Error(RegistrationError.INVALID_EMAIL);
        }
        return true;
    }
}