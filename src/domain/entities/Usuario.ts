import { PerfilUsuario } from "./PerfilUsuario";

export class Usuario {
    constructor(
        public id: string,
        public primerNombre: string,
        public segundoNombre: string | null,
        public primerApellido: string,
        public segundoApellido: string | null,
        public fechaNacimiento: Date | null,
        public sexo: string | null,
        public email: string,
        public fechaAceptacionTerminos: Date,
        public perfil: PerfilUsuario
    ) {}
}