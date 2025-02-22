import { IsValidName } from '../../../domain/usecases/IsValidName';

describe('IsValidName', () => {
    let isValidName: IsValidName;

    beforeEach(() => {
        isValidName = new IsValidName();
    });

    it('debería devolver true para un nombre válido', () => {
        expect(isValidName.ejecutar("Juan")).toBe(true);
    });

    it('debería devolver false para un nombre con números', () => {
        expect(isValidName.ejecutar("Juan123")).toBe(false);
    });

    it('debería devolver false para un nombre con símbolos', () => {
        expect(isValidName.ejecutar("Juan!")).toBe(false);
    });

    it('debería devolver false para un nombre con más de 30 caracteres', () => {
        const nombreLargo = "a".repeat(31);
        expect(isValidName.ejecutar(nombreLargo)).toBe(false);
    });
});