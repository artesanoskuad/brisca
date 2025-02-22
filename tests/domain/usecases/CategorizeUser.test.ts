import { CategorizeUser } from '../../../domain/usecases/CategorizeUser';
import { PerfilUsuario } from '../../../domain/entities/PerfilUsuario';

describe('CategorizeUser', () => {
    let categorizeUser: CategorizeUser;

    beforeEach(() => {
        categorizeUser = new CategorizeUser();
    });

    it('debería devolver USER si el usuario es mayor de 18 años', () => {
        const fechaNacimiento = new Date("1990-01-01");
        expect(categorizeUser.ejecutar(fechaNacimiento)).toBe(PerfilUsuario.USER);
    });

    it('debería devolver USER_WITH_RESTRICTIONS si el usuario es menor de 18 años', () => {
        const fechaNacimiento = new Date();
        fechaNacimiento.setFullYear(fechaNacimiento.getFullYear() - 17);
        expect(categorizeUser.ejecutar(fechaNacimiento)).toBe(PerfilUsuario.USER_WITH_RESTRICTIONS);
    });

    it('debería devolver USER si no se proporciona fecha de nacimiento', () => {
        expect(categorizeUser.ejecutar(null)).toBe(PerfilUsuario.USER);
    });
});