// src/domain/usecases/LoginWithFingerprint.ts
import { User } from "../entities/User";
import { Either, left, right } from "../utils/Either";
import { LoginLockedException } from "../exceptions/LoginLockedException";

// Define la interfaz para el datasource de login con huella.
export interface FingerprintDatasource {
  login(): Promise<User>;
}

// Caso de uso para login con huella.
export class LoginWithFingerprint {
  constructor(private fingerprintDatasource: FingerprintDatasource) {}

  async execute(): Promise<Either<Error, User>> {
    try {
      const user = await this.fingerprintDatasource.login();
      return right(user);
    } catch (error: any) {
      if (error instanceof LoginLockedException) {
        return left(error);
      }
      return left(new Error("Error al iniciar sesión con huella"));
    }
  }
}
