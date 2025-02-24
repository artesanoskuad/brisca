// src/domain/usecases/LoginWithFace.ts
import { User } from "../entities/User";
import { Either, left, right } from "../utils/Either";
import { LoginLockedException } from "../exceptions/LoginLockedException";

// Define la interfaz para el datasource de login con reconocimiento facial.
export interface FaceDatasource {
  login(): Promise<User>;
}

// Caso de uso para login con Face.
export class LoginWithFace {
  constructor(private faceDatasource: FaceDatasource) {}

  async execute(): Promise<Either<Error, User>> {
    try {
      const user = await this.faceDatasource.login();
      return right(user);
    } catch (error: any) {
      if (error instanceof LoginLockedException) {
        return left(error);
      }
      return left(new Error("Error al iniciar sesión con reconocimiento facial"));
    }
  }
}
