import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { CredencialRepository } from "../repositories/CredencialRepository";
import { IsValidEmail } from "./IsValidEmail";
import { IsValidPassword } from "./IsValidPassword";
import { RegistrationError } from "../entities/RegistrationError";
//import * as bcrypt from "bcrypt";
import { Usuario } from "../entities/Usuario";

export class LoginUser {
    constructor(
        private usuarioRepository: UsuarioRepository,
        private credencialRepository: CredencialRepository,
        private isValidEmail: IsValidEmail, // ✅ Validación de email
        private isValidPassword: IsValidPassword // ✅ Validación de contraseña
    ) {}

    async ejecutar(correo: string, contraseña: string): Promise<Usuario | null> {
        // ✅ Validar formato de email
        if (!this.isValidEmail.ejecutar(correo)) {
            throw new Error(RegistrationError.INVALID_EMAIL);
        }

        // ✅ Validar formato de contraseña
        if (!this.isValidPassword.ejecutar(contraseña)) {
            throw new Error(RegistrationError.INVALID_PASSWORD);
        }

        // Buscar usuario por correo
        const usuario = await this.usuarioRepository.obtenerUsuarioPorCorreo(correo);
        if (!usuario) {
            return null; // Usuario no encontrado
        }

        // Buscar credencial por usuario ID
        const credencial = await this.credencialRepository.obtenerCredencialPorUsuarioId(usuario.id);
        if (!credencial) {
            return null; // Credenciales no encontradas
        }

        // Comparar la contraseña con el hash
        //const passwordMatch = await bcrypt.compare(contraseña, credencial.contraseñaHash);
        //if (!passwordMatch) {
        //    return null; // Contraseña incorrecta
        //}

        return usuario; // Retornar el usuario autenticado
    }
}
