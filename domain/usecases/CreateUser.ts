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
import * as bcrypt from "bcrypt";

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
        // Validar nombres y apellidos
        if (!this.isValidName.ejecutar(usuario.primerNombre)) {
            throw new Error(RegistrationError.INVALID_NAME);
        }
        if (usuario.segundoNombre && !this.isValidName.ejecutar(usuario.segundoNombre)) {
            throw new Error(RegistrationError.INVALID_NAME);
        }
        if (!this.isValidName.ejecutar(usuario.primerApellido)) {
            throw new Error(RegistrationError.INVALID_NAME);
        }
        if (usuario.segundoApellido && !this.isValidName.ejecutar(usuario.segundoApellido)) {
            throw new Error(RegistrationError.INVALID_NAME);
        }

        // Validar correo electrónico
        this.isValidEmail.ejecutar(usuario.correoElectronico);

        // Verificar si el correo ya está registrado
        const usuarioExistente = await this.usuarioRepository.obtenerUsuarioPorCorreo(usuario.correoElectronico);
        if (usuarioExistente) {
            throw new Error(RegistrationError.EMAIL_ALREADY_REGISTERED);
        }

        // Validar fecha de nacimiento
        if (usuario.fechaNacimiento) {
            this.isValidDate.ejecutar(usuario.fechaNacimiento);
        }

        // Validar contraseña
        this.isValidPassword.ejecutar(contraseña);
        if (contraseña !== confirmarContraseña) {
            throw new Error(RegistrationError.PASSWORDS_DO_NOT_MATCH);
        }

        // Validar términos y condiciones
        this.acceptTermsAndConditions.ejecutar(aceptoTerminos);

        // Categorizar al usuario
        usuario.perfil = this.categorizeUser.ejecutar(usuario.fechaNacimiento);

        // Hashear la contraseña
        const saltRounds = 10;
        const contraseñaHash = await bcrypt.hash(contraseña, saltRounds);

        // Guardar el usuario
        await this.usuarioRepository.guardarUsuario(usuario);

        // Guardar la credencial
        const credencial = new Credencial(
            usuario.id,
            usuario.id,
            contraseñaHash,
            new Date()
        );
        await this.credencialRepository.guardarCredencial(credencial);
    }
}