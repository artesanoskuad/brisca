import { Usuario } from "../../domain/entities/Usuario";
import { Credencial } from "../../domain/entities/Credencial";
import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
import { CredencialRepository } from "../../domain/repositories/CredencialRepository";

export class InMemoryRepository implements UsuarioRepository, CredencialRepository {
    private usuarios: Usuario[] = [];
    private credenciales: Credencial[] = [];

    async guardarUsuario(usuario: Usuario): Promise<void> {
        this.usuarios.push(usuario);
    }

    async obtenerUsuarioPorCorreo(correo: string): Promise<Usuario | null> {
        return this.usuarios.find(u => u.correoElectronico === correo) || null;
    }

    async guardarCredencial(credencial: Credencial): Promise<void> {
        this.credenciales.push(credencial);
    }

    async obtenerCredencialPorUsuarioId(usuarioId: string): Promise<Credencial | null> {
        return this.credenciales.find(c => c.usuarioId === usuarioId) || null;
    }
}