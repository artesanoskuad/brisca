export class IsValidName {
    ejecutar(nombre: string): boolean {
        const regex = /^[A-Za-zÁ-Úá-úñÑçÇ\s]{1,30}$/;
        return regex.test(nombre);
    }
}