import { AcceptTermsAndConditions } from '../../../domain/usecases/AcceptTermsAndConditions';
import { RegistrationError } from '../../../domain/entities/RegistrationError';

describe('AcceptTermsAndConditions', () => {
    let acceptTermsAndConditions: AcceptTermsAndConditions;

    beforeEach(() => {
        acceptTermsAndConditions = new AcceptTermsAndConditions();
    });

    it('debería devolver true si se aceptan los términos', () => {
        expect(acceptTermsAndConditions.ejecutar(true)).toBe(true);
    });

    it('debería lanzar un error si no se aceptan los términos', () => {
        expect(() => acceptTermsAndConditions.ejecutar(false))
            .toThrow(RegistrationError.TERMS_NOT_ACCEPTED);
    });
});