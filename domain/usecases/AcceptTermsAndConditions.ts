import { RegistrationError } from "../entities/RegistrationError";

export class AcceptTermsAndConditions {
    ejecutar(aceptoTerminos: boolean): boolean {
        if (!aceptoTerminos) {
            throw new Error(RegistrationError.TERMS_NOT_ACCEPTED);
        }

        return true;
    }
}