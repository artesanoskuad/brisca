import { IsValidPassword } from '../../../src/domain/usecases/IsValidPassword';
import { RegistrationError } from '../../../src/domain/entities/RegistrationError';

describe('IsValidPassword', () => {
    let isValidPassword: IsValidPassword;

    beforeEach(() => {
        isValidPassword = new IsValidPassword();
    });

    it('debería devolver true para una contraseña válida', () => {
        expect(isValidPassword.ejecutar("Password123")).toBe(true);
    });

    it('debería lanzar un error para una contraseña inválida (sin mayúsculas)', () => {
        expect(() => isValidPassword.ejecutar("password123"))
            .toThrow(RegistrationError.INVALID_PASSWORD);
    });

    it('debería lanzar un error para una contraseña inválida (sin números)', () => {
        expect(() => isValidPassword.ejecutar("Password"))
            .toThrow(RegistrationError.INVALID_PASSWORD);
    });

    it('debería lanzar un error para una contraseña inválida (menos de 8 caracteres)', () => {
        expect(() => isValidPassword.ejecutar("Pass1"))
            .toThrow(RegistrationError.INVALID_PASSWORD);
    });
});