// src/domain/usecases/LoginWithEmail.ts
import { User } from "../entities/User";
import { Either, left, right } from "../utils/Either";
import { LoginLockedException } from "../exceptions/LoginLockedException";

// Define la interfaz para el datasource de login por email.
export interface EmailDatasource {
  login(email: string, password: string): Promise<User>;
}

// Caso de uso para login con Email.
export class LoginWithEmail {
  constructor(private emailDatasource: EmailDatasource) {}

  async execute(email: string, password: string): Promise<Either<Error, User>> {
    try {
      const user = await this.emailDatasource.login(email, password);
      return right(user);
    } catch (error: any) {
      if (error instanceof LoginLockedException) {
        return left(error);
      }
      return left(new Error("Credenciales inválidas o error en el servidor"));
    }
  }
}
