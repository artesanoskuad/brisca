import { IsValidDate } from '../../../src/domain/usecases/IsValidDate';
import { RegistrationError } from '../../../src/domain/entities/RegistrationError';

describe('IsValidDate', () => {
    let isValidDate: IsValidDate;

    beforeEach(() => {
        isValidDate = new IsValidDate();
    });

    it('debería devolver true para una fecha válida', () => {
        expect(isValidDate.ejecutar(new Date("1990-01-01"))).toBe(true);
    });

    it('debería lanzar un error para una fecha inválida (menor de 18 años)', () => {
        const fechaMenorDeEdad = new Date();
        fechaMenorDeEdad.setFullYear(fechaMenorDeEdad.getFullYear() - 17);

        expect(() => isValidDate.ejecutar(fechaMenorDeEdad))
            .toThrow(RegistrationError.INVALID_DATE);
    });
});