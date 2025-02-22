// tests/domain/usecases/CrearUsuario.test.ts
import { CreateUser } from '../../../domain/usecases/CreateUser';
import { Usuario } from '../../../domain/entities/Usuario';
import { UsuarioRepository } from '../../../domain/repositories/UsuarioRepository';
import { CredencialRepository } from '../../../domain/repositories/CredencialRepository';
import { IsValidName } from '../../../domain/usecases/IsValidName';
import { IsValidEmail } from '../../../domain/usecases/IsValidEmail';
import { IsValidDate } from '../../../domain/usecases/IsValidDate';
import { IsValidPassword } from '../../../domain/usecases/IsValidPassword';
import { AcceptTermsAndConditions } from '../../../domain/usecases/AcceptTermsAndConditions';
import { CategorizeUser } from '../../../domain/usecases/CategorizeUser';
import { RegistrationError } from '../../../domain/entities/RegistrationError';
import { PerfilUsuario } from '../../../domain/entities/PerfilUsuario';

describe('CrearUsuario', () => {
    let crearUsuario: CreateUser;
    let usuarioRepositoryMock: jest.Mocked<UsuarioRepository>;
    let credencialRepositoryMock: jest.Mocked<CredencialRepository>;
    let isValidNameMock: jest.Mocked<IsValidName>;
    let isValidEmailMock: jest.Mocked<IsValidEmail>;
    let isValidDateMock: jest.Mocked<IsValidDate>;
    let isValidPasswordMock: jest.Mocked<IsValidPassword>;
    let acceptTermsAndConditionsMock: jest.Mocked<AcceptTermsAndConditions>;
    let categorizeUserMock: jest.Mocked<CategorizeUser>;

    beforeEach(() => {
        // Mocks para las dependencias
        usuarioRepositoryMock = {
            guardarUsuario: jest.fn(),
            obtenerUsuarioPorCorreo: jest.fn(),
        } as unknown as jest.Mocked<UsuarioRepository>;

        credencialRepositoryMock = {
            guardarCredencial: jest.fn(),
            obtenerCredencialPorUsuarioId: jest.fn(),
        } as unknown as jest.Mocked<CredencialRepository>;

        isValidNameMock = {
            ejecutar: jest.fn(),
        } as unknown as jest.Mocked<IsValidName>;

        isValidEmailMock = {
            ejecutar: jest.fn(),
        } as unknown as jest.Mocked<IsValidEmail>;

        isValidDateMock = {
            ejecutar: jest.fn(),
        } as unknown as jest.Mocked<IsValidDate>;

        isValidPasswordMock = {
            ejecutar: jest.fn(),
        } as unknown as jest.Mocked<IsValidPassword>;

        acceptTermsAndConditionsMock = {
            ejecutar: jest.fn(),
        } as unknown as jest.Mocked<AcceptTermsAndConditions>;

        categorizeUserMock = {
            ejecutar: jest.fn(),
        } as unknown as jest.Mocked<CategorizeUser>;

        // Instancia de CrearUsuario con los mocks
        crearUsuario = new CreateUser(
            usuarioRepositoryMock,
            credencialRepositoryMock,
            categorizeUserMock,
            isValidNameMock,
            isValidEmailMock,
            isValidDateMock,
            isValidPasswordMock,
            acceptTermsAndConditionsMock
        );
    });

    it('debería crear un usuario correctamente', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);

        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();

        // Datos de prueba
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );

        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);

        // Verificar que se llamaron los métodos esperados
        expect(isValidNameMock.ejecutar).toHaveBeenCalledWith("Juan");
        expect(isValidEmailMock.ejecutar).toHaveBeenCalledWith("juan@example.com");
        expect(usuarioRepositoryMock.guardarUsuario).toHaveBeenCalledWith(usuario);
        expect(credencialRepositoryMock.guardarCredencial).toHaveBeenCalled();
    });

    it('debería lanzar un error si el correo ya está registrado', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        // Simular que el correo ya está registrado
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue({} as Usuario);
    
        // Datos de prueba
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar y verificar el error
        await expect(crearUsuario.ejecutar(usuario, "Password123", "Password123", true))
            .rejects.toThrow(RegistrationError.EMAIL_ALREADY_REGISTERED);
    });

    it('debería validar el segundo nombre si está presente', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba con segundo nombre
        const usuario = new Usuario(
            "1",
            "Juan",
            "Carlos", // Segundo nombre
            "Pérez",
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que se validó el segundo nombre
        expect(isValidNameMock.ejecutar).toHaveBeenCalledWith("Carlos");
    });

    it('debería validar el primer apellido', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez", // Primer apellido
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que se validó el primer apellido
        expect(isValidNameMock.ejecutar).toHaveBeenCalledWith("Pérez");
    });

    it('debería validar el segundo apellido si está presente', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba con segundo apellido
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            "Gómez", // Segundo apellido
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que se validó el segundo apellido
        expect(isValidNameMock.ejecutar).toHaveBeenCalledWith("Gómez");
    });

    it('debería validar el correo electrónico', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que se validó el correo electrónico
        expect(isValidEmailMock.ejecutar).toHaveBeenCalledWith("juan@example.com");
    });

    it('debería validar la fecha de nacimiento si está presente', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba con fecha de nacimiento
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            null,
            new Date("1990-01-01"), // Fecha de nacimiento
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que se validó la fecha de nacimiento
        expect(isValidDateMock.ejecutar).toHaveBeenCalledWith(new Date("1990-01-01"));
    });

    it('debería lanzar un error si el segundo nombre es inválido', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockImplementation((nombre) => {
            if (nombre === "Carlos123") return false; // Simular un segundo nombre inválido
            return true;
        });
    
        // Datos de prueba con segundo nombre inválido
        const usuario = new Usuario(
            "1",
            "Juan",
            "Carlos123", // Segundo nombre inválido
            "Pérez",
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar y verificar el error
        await expect(crearUsuario.ejecutar(usuario, "Password123", "Password123", true))
            .rejects.toThrow(RegistrationError.INVALID_NAME);
    });

    it('debería lanzar un error si el primer apellido es inválido', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockImplementation((nombre) => {
            if (nombre === "Pérez123") return false; // Simular un primer apellido inválido
            return true;
        });
    
        // Datos de prueba con primer apellido inválido
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez123", // Primer apellido inválido
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar y verificar el error
        await expect(crearUsuario.ejecutar(usuario, "Password123", "Password123", true))
            .rejects.toThrow(RegistrationError.INVALID_NAME);
    });

    it('debería lanzar un error si el segundo apellido es inválido', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockImplementation((nombre) => {
            if (nombre === "Gómez123") return false; // Simular un segundo apellido inválido
            return true;
        });
    
        // Datos de prueba con segundo apellido inválido
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            "Gómez123", // Segundo apellido inválido
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar y verificar el error
        await expect(crearUsuario.ejecutar(usuario, "Password123", "Password123", true))
            .rejects.toThrow(RegistrationError.INVALID_NAME);
    });

    it('debería lanzar un error si el correo electrónico es inválido', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true); // Asegurar que el nombre sea válido
        isValidEmailMock.ejecutar.mockImplementation(() => {
            throw new Error(RegistrationError.INVALID_EMAIL); // Lanzar error de correo inválido
        });
    
        // Datos de prueba
        const usuario = new Usuario(
            "1",
            "Juan", // Nombre válido
            null,
            "Pérez", // Apellido válido
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example", // Correo inválido
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar y verificar el error
        await expect(crearUsuario.ejecutar(usuario, "Password123", "Password123", true))
            .rejects.toThrow(RegistrationError.INVALID_EMAIL);
    });

    it('debería lanzar un error si la fecha de nacimiento es inválida', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true); // Asegurar que el nombre sea válido
        isValidEmailMock.ejecutar.mockReturnValue(true); // Asegurar que el correo sea válido
        isValidDateMock.ejecutar.mockImplementation(() => {
            throw new Error(RegistrationError.INVALID_DATE); // Lanzar error de fecha inválida
        });
    
        // Datos de prueba con fecha de nacimiento inválida
        const usuario = new Usuario(
            "1",
            "Juan", // Nombre válido
            null,
            "Pérez", // Apellido válido
            null,
            new Date("3000-01-01"), // Fecha inválida (en el futuro)
            "Masculino",
            "juan@example.com", // Correo válido
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar y verificar el error
        await expect(crearUsuario.ejecutar(usuario, "Password123", "Password123", true))
            .rejects.toThrow(RegistrationError.INVALID_DATE);
    });

    it('debería lanzar un error si el primer nombre es inválido', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockImplementation((nombre) => {
            if (nombre === "Juan123") return false; // Simular un primer nombre inválido
            return true;
        });
    
        // Datos de prueba con primer nombre inválido
        const usuario = new Usuario(
            "1",
            "Juan123", // Primer nombre inválido
            null,
            "Pérez",
            null,
            new Date("1990-01-01"),
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar y verificar el error
        await expect(crearUsuario.ejecutar(usuario, "Password123", "Password123", true))
            .rejects.toThrow(RegistrationError.INVALID_NAME);
    });

    it('debería crear un usuario sin fecha de nacimiento', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba sin fecha de nacimiento
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            null,
            null, // Fecha de nacimiento ausente
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que no se llamó a isValidDateMock.ejecutar
        expect(isValidDateMock.ejecutar).not.toHaveBeenCalled();
    });

    it('debería crear un usuario con fecha de nacimiento válida', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidDateMock.ejecutar.mockReturnValue(true); // Fecha de nacimiento válida
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba con fecha de nacimiento válida
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            null,
            new Date("1990-01-01"), // Fecha de nacimiento válida
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que se validó la fecha de nacimiento
        expect(isValidDateMock.ejecutar).toHaveBeenCalledWith(new Date("1990-01-01"));
    });

    it('debería crear un usuario sin fecha de nacimiento (null)', async () => {
        // Configurar mocks
        isValidNameMock.ejecutar.mockReturnValue(true);
        isValidEmailMock.ejecutar.mockReturnValue(true);
        isValidPasswordMock.ejecutar.mockReturnValue(true);
        acceptTermsAndConditionsMock.ejecutar.mockReturnValue(true);
        categorizeUserMock.ejecutar.mockReturnValue(PerfilUsuario.USER);
    
        usuarioRepositoryMock.obtenerUsuarioPorCorreo.mockResolvedValue(null);
        usuarioRepositoryMock.guardarUsuario.mockResolvedValue();
        credencialRepositoryMock.guardarCredencial.mockResolvedValue();
    
        // Datos de prueba con fecha de nacimiento null
        const usuario = new Usuario(
            "1",
            "Juan",
            null,
            "Pérez",
            null,
            null, // Fecha de nacimiento null
            "Masculino",
            "juan@example.com",
            new Date(),
            PerfilUsuario.USER
        );
    
        // Ejecutar el caso de uso
        await crearUsuario.ejecutar(usuario, "Password123", "Password123", true);
    
        // Verificar que no se llamó a isValidDateMock.ejecutar
        expect(isValidDateMock.ejecutar).not.toHaveBeenCalled();
    });

});