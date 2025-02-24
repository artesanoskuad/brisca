// src/di/UseCaseFactory.ts
import { LoginWithEmail } from '../domain/usecases/LoginWithEmail';
import { FakeEmailDatasource } from '../data/datasources/FakeEmailDatasource';

export class LoginFactory {
  static createLoginWithEmail(): LoginWithEmail {
    const fakeDatasource = new FakeEmailDatasource();
    return new LoginWithEmail(fakeDatasource);
  }
}
