import { Usuario } from "../entities/Usuario";
import { Credencial } from "../entities/Credencial";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { CredencialRepository } from "../repositories/CredencialRepository";
import { RegistrationError } from "../entities/RegistrationError";
import { IsValidEmail } from "./IsValidEmail";
import { IsValidPassword } from "./IsValidPassword";
import { AcceptTermsAndConditions } from "./AcceptTermsAndConditions";
import { PerfilUsuario } from "../entities/PerfilUsuario";

export class RegisterUser {
    constructor(
        private usuarioRepository: UsuarioRepository,
        private credencialRepository: CredencialRepository,
        private isValidEmail: IsValidEmail,
        private isValidPassword: IsValidPassword,
        private acceptTermsAndConditions: AcceptTermsAndConditions
    ) {}

    async ejecutar(
        primerNombre: string,
        segundoNombre: string | null,
        primerApellido: string,
        segundoApellido: string | null,
        fechaNacimiento: Date | null,
        sexo: string | null,
        email: string,
        password: string,
        confirmPassword: string,
        acceptTerms: boolean
    ): Promise<Usuario> {
        // ✅ Validar correo electrónico
        if (!this.isValidEmail.ejecutar(email)) {
            throw new Error(RegistrationError.INVALID_EMAIL);
        }

        // ✅ Verificar si el correo ya está registrado
        const existingUser = await this.usuarioRepository.obtenerUsuarioPorCorreo(email);
        if (existingUser) {
            throw new Error(RegistrationError.EMAIL_ALREADY_REGISTERED);
        }

        // ✅ Validar contraseña
        if (!this.isValidPassword.ejecutar(password)) {
            throw new Error(RegistrationError.INVALID_PASSWORD);
        }
        if (password !== confirmPassword) {
            throw new Error(RegistrationError.PASSWORDS_DO_NOT_MATCH);
        }

        // ✅ Validar términos y condiciones
        if (!this.acceptTermsAndConditions.ejecutar(acceptTerms)) {
            throw new Error(RegistrationError.TERMS_NOT_ACCEPTED);
        }

        // ✅ Crear usuario con todos los atributos requeridos
        const usuario = new Usuario(
            crypto.randomUUID(),
            primerNombre,
            segundoNombre || null,
            primerApellido,
            segundoApellido || null,
            fechaNacimiento || null,
            sexo || null,
            email,
            new Date(), // ✅ Fecha de aceptación de términos
            PerfilUsuario.USER // ✅ Se puede cambiar según lógica de negocio
        );

        // ✅ Guardar usuario en el repositorio
        await this.usuarioRepository.guardarUsuario(usuario);

        // ✅ Guardar credencial en el repositorio
        const credencial = new Credencial(usuario.id, usuario.id, password, new Date());
        await this.credencialRepository.guardarCredencial(credencial);

        return usuario;
    }
}
