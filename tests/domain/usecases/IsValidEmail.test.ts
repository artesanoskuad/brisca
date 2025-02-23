// tests/domain/usecases/IsValidEmail.test.ts
import { IsValidEmail } from '../../../src/domain/usecases/IsValidEmail';
import { RegistrationError } from '../../../src/domain/entities/RegistrationError';

describe('IsValidEmail', () => {
    let isValidEmail: IsValidEmail;

    beforeEach(() => {
        isValidEmail = new IsValidEmail();
    });

    it('debería devolver true para un correo válido', () => {
        expect(isValidEmail.ejecutar("juan@example.com")).toBe(true);
        expect(isValidEmail.ejecutar("juan.perez@example.com")).toBe(true);
        expect(isValidEmail.ejecutar("juan_perez@example.com")).toBe(true);
        expect(isValidEmail.ejecutar("juan+perez@example.com")).toBe(true);
    });

    it('debería lanzar un error para un correo inválido', () => {
        expect(() => isValidEmail.ejecutar("juan@example"))
            .toThrow(RegistrationError.INVALID_EMAIL);
        expect(() => isValidEmail.ejecutar("juan.example.com"))
            .toThrow(RegistrationError.INVALID_EMAIL);
        expect(() => isValidEmail.ejecutar("juan@.com"))
            .toThrow(RegistrationError.INVALID_EMAIL);
        expect(() => isValidEmail.ejecutar("@example.com"))
            .toThrow(RegistrationError.INVALID_EMAIL);
    });
});