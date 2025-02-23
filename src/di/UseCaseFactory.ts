import { CreateUser } from "../domain/usecases/CreateUser";
import { LoginUser } from "../domain/usecases/LoginUser";
import { CategorizeUser } from "../domain/usecases/CategorizeUser";
import { AcceptTermsAndConditions } from "../domain/usecases/AcceptTermsAndConditions";
import { IsValidEmail } from "../domain/usecases/IsValidEmail";
import { IsValidName } from "../domain/usecases/IsValidName";
import { IsValidDate } from "../domain/usecases/IsValidDate";
import { IsValidPassword } from "../domain/usecases/IsValidPassword";
import { UsuarioRepositoryImpl } from "../data/repositories/UsuarioRepositoryImpl";
import { CredencialRepositoryImpl } from "../data/repositories/CredencialRepositoryImpl";

export class UseCaseFactory {
    private static usuarioRepository = new UsuarioRepositoryImpl();
    private static credencialRepository = new CredencialRepositoryImpl();
    private static isValidEmail = new IsValidEmail();
    private static isValidPassword = new IsValidPassword();

    static createUser(): CreateUser {
        return new CreateUser(
            this.usuarioRepository,
            this.credencialRepository,
            new CategorizeUser(),
            new IsValidName(),
            this.isValidEmail,
            new IsValidDate(),
            this.isValidPassword,
            new AcceptTermsAndConditions()
        );
    }

    static loginUser(): LoginUser {
        return new LoginUser(
            this.usuarioRepository,
            this.credencialRepository,
            this.isValidEmail,
            this.isValidPassword
        );
    }
}
