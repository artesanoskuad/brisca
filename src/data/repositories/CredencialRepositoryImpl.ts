import { CredencialRepository } from "../../domain/repositories/CredencialRepository";
import { Credencial } from "../../domain/entities/Credencial";

export class CredencialRepositoryImpl implements CredencialRepository {
    private credenciales: Map<string, Credencial> = new Map(); // Almacenamos credenciales en memoria

    async guardarCredencial(credencial: Credencial): Promise<void> {
        this.credenciales.set(credencial.usuarioId, credencial);
    }

    async obtenerCredencialPorUsuarioId(usuarioId: string): Promise<Credencial | null> {
        return this.credenciales.get(usuarioId) || null;
    }
}
