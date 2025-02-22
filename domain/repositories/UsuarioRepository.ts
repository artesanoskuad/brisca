import { Usuario } from "../entities/Usuario";

export interface UsuarioRepository {
    guardarUsuario(usuario: Usuario): Promise<void>;
    obtenerUsuarioPorCorreo(correo: string): Promise<Usuario | null>;
}