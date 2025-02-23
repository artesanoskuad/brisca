import { Credencial } from "../entities/Credencial";

export interface CredencialRepository {
    guardarCredencial(credencial: Credencial): Promise<void>;
    obtenerCredencialPorUsuarioId(usuarioId: string): Promise<Credencial | null>;
}