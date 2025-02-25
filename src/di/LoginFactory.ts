// src/di/UseCaseFactory.ts
import { LoginWithEmail } from '../domain/usecases/LoginWithEmail';
import { LoginWithFingerprint } from '../domain/usecases/LoginWithFingerprint';
import { FakeEmailDatasource } from '../data/datasources/FakeEmailDatasource';
import { RealFingerprintDatasource } from '../data/datasources/RealFingerprintDatasource';


export class LoginFactory {
  static createLoginWithEmail(): LoginWithEmail {
    const fakeDatasource = new FakeEmailDatasource();
    return new LoginWithEmail(fakeDatasource);
  }

  static createLoginWithFingerprint(): LoginWithFingerprint {
    const fingerprintDatasource = new RealFingerprintDatasource();
    return new LoginWithFingerprint(fingerprintDatasource);
  }
}
