import { RegistrationError } from "../entities/RegistrationError";

export class IsValidDate {
    ejecutar(fechaNacimiento: Date): boolean {
        const fechaActual = new Date();
        const edad = fechaActual.getFullYear() - fechaNacimiento.getFullYear();

        if (edad < 18) {
            throw new Error(RegistrationError.INVALID_DATE);
        }

        return true;
    }
}