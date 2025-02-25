// src/data/datasources/RealHardwareSupportDatasource.ts
import * as LocalAuthentication from 'expo-local-authentication';
import { HardwareSupportDatasource } from '../../domain/usecases/ObtainHardwareSupport';
import { HardwareSupport } from '../../domain/entities/HardwareSupport';

export class RealHardwareSupportDatasource implements HardwareSupportDatasource {
  async obtainSupport(): Promise<HardwareSupport> {
    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
    const fingerprintAvailable = hasHardware && supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT);
    const faceAvailable = hasHardware && supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION);
    return new HardwareSupport(fingerprintAvailable, faceAvailable);
  }
}
