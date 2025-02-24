import { RegistrationError } from '../entities/RegistrationError';

export class IsValidEmail {
    ejecutar(email: string): boolean {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email)) {
            throw new Error(RegistrationError.INVALID_EMAIL);
        }
        return true;
    }
}