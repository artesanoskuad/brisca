export class Credencial {
    constructor(
        public id: string,
        public usuarioId: string,
        public contraseñaHash: string,
        public fechaCreacion: Date
    ) {}
}