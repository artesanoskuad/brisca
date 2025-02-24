import { Usuario } from "../entities/Usuario";
import { Credencial } from "../entities/Credencial";
import { UsuarioRepository } from "../repositories/UsuarioRepository";
import { CredencialRepository } from "../repositories/CredencialRepository";
import { RegistrationError } from "../entities/RegistrationError";
import { CategorizeUser } from "./CategorizeUser";
import { IsValidName } from "./IsValidName";
import { IsValidEmail } from "./IsValidEmail";
import { IsValidDate } from "./IsValidDate";
import { IsValidPassword } from "./IsValidPassword";
import { AcceptTermsAndConditions } from "./AcceptTermsAndConditions";

export class CreateUser {
    constructor(
        private usuarioRepository: UsuarioRepository,
        private credencialRepository: CredencialRepository,
        private categorizeUser: CategorizeUser,
        private isValidName: IsValidName,
        private isValidEmail: IsValidEmail,
        private isValidDate: IsValidDate,
        private isValidPassword: IsValidPassword,
        private acceptTermsAndConditions: AcceptTermsAndConditions
    ) {}

    async ejecutar(usuario: Usuario, contraseña: string, confirmarContraseña: string, aceptoTerminos: boolean): Promise<void> {
        try {
            // ✅ Validar nombres y apellidos
            if (!this.isValidName.ejecutar(usuario.primerNombre)) {
                throw RegistrationError.INVALID_NAME;
            }
            if (usuario.segundoNombre && !this.isValidName.ejecutar(usuario.segundoNombre)) {
                throw RegistrationError.INVALID_NAME;
            }
            if (!this.isValidName.ejecutar(usuario.primerApellido)) {
                throw RegistrationError.INVALID_NAME;
            }
            if (usuario.segundoApellido && !this.isValidName.ejecutar(usuario.segundoApellido)) {
                throw RegistrationError.INVALID_NAME;
            }

            // ✅ Validar correo electrónico
            if (!this.isValidEmail.ejecutar(usuario.email)) {
                throw RegistrationError.INVALID_EMAIL;
            }

            // ✅ Verificar si el correo ya está registrado
            const usuarioExistente = await this.usuarioRepository.obtenerUsuarioPorCorreo(usuario.email);
            if (usuarioExistente) {
                throw RegistrationError.EMAIL_ALREADY_REGISTERED;
            }

            // ✅ Validar fecha de nacimiento (si existe)
            if (usuario.fechaNacimiento && !this.isValidDate.ejecutar(usuario.fechaNacimiento)) {
                throw RegistrationError.INVALID_DATE;
            }

            // ✅ Validar contraseña
            if (!this.isValidPassword.ejecutar(contraseña)) {
                throw RegistrationError.INVALID_PASSWORD;
            }
            if (contraseña !== confirmarContraseña) {
                throw RegistrationError.PASSWORDS_DO_NOT_MATCH;
            }

            // ✅ Validar términos y condiciones
            if (!this.acceptTermsAndConditions.ejecutar(aceptoTerminos)) {
                throw RegistrationError.TERMS_NOT_ACCEPTED;
            }

            // ✅ Categorizar usuario
            usuario.perfil = this.categorizeUser.ejecutar(usuario.fechaNacimiento);

            // ✅ Hashear contraseña (Si decides usar `bcrypt`, dime y lo agregamos)
            // const saltRounds = 10;
            // const contraseñaHash = await bcrypt.hash(contraseña, saltRounds);

            // ✅ Guardar usuario en el repositorio
            await this.usuarioRepository.guardarUsuario(usuario);

            // ✅ Guardar credencial en el repositorio
            const credencial = new Credencial(usuario.id, usuario.id, contraseña, new Date());
            await this.credencialRepository.guardarCredencial(credencial);

        } catch (error) {
            console.error("Error al registrar usuario:", error);
            throw error;
        }
    }
}
