import { PerfilUsuario } from "../entities/PerfilUsuario";

export class CategorizeUser {
    ejecutar(fechaNacimiento: Date | null): PerfilUsuario {
        if (!fechaNacimiento) return PerfilUsuario.USER;

        const fechaActual = new Date();
        const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

        return edad < 18 ? PerfilUsuario.USER_WITH_RESTRICTIONS : PerfilUsuario.USER;
    }
}