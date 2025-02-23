import { UsuarioRepository } from "../../domain/repositories/UsuarioRepository";
import { Usuario } from "../../domain/entities/Usuario";

export class UsuarioRepositoryImpl implements UsuarioRepository {
    private usuarios: Map<string, Usuario> = new Map(); // Almacén en memoria

    async guardarUsuario(usuario: Usuario): Promise<void> {
        this.usuarios.set(usuario.id, usuario);
    }

    async obtenerUsuarioPorCorreo(correo: string): Promise<Usuario | null> {
        for (const usuario of this.usuarios.values()) {
            if (usuario.correoElectronico === correo) {
                return usuario;
            }
        }
        return null;
    }
}
