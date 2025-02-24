import { PerfilUsuario } from "../../domain/entities/PerfilUsuario";

export interface UserState {
    id: string | null;
    primerNombre: string;
    segundoNombre?: string | null;
    primerApellido: string;
    segundoApellido?: string | null;
    fechaNacimiento?: Date | null;
    sexo?: string | null;
    email: string;
    perfil: PerfilUsuario | null;
    loading: boolean;
    error: string | null;
    success: boolean;
}
