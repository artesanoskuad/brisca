// src/data/datasources/RealFingerprintDatasource.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { FingerprintDatasource } from '../../domain/usecases/LoginWithFingerprint';
import { User } from '../../domain/entities/User';

export class RealFingerprintDatasource implements FingerprintDatasource {
  async login(): Promise<User> {
    const options = {
      promptMessage: 'Autentícate con tu huella',
      cancelLabel: 'Cancelar',
      fallbackLabel: 'Usar PIN',
      disableDeviceFallback: true,
    };

    const result = await LocalAuthentication.authenticateAsync(options);

    if (result.success) {
      return new User('fingerprint-id', 'Usuario Huella', 'huella@example.com');
    }

    // Manejo específico del error "not_enrolled"
    if (result.error === 'not_enrolled') {
      throw new Error('No tienes huellas registradas. Por favor, registra una huella en la configuración de tu dispositivo.');
    }

    throw new Error(result.error || 'Autenticación con huella fallida');
  }
}
