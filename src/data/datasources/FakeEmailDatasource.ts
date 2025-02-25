// src/data/datasources/FakeEmailDatasource.ts
import { EmailDatasource } from '../../domain/usecases/LoginWithEmail';
import { User } from '../../domain/entities/User';
import { LoginLockedException } from '../../domain/exceptions/LoginLockedException';

export class FakeEmailDatasource implements EmailDatasource {
  private failCount = 0;
  private maxFailsBeforeLock = 3;

  async login(email: string, password: string): Promise<User> {
    // Simula un retardo en la respuesta (por ejemplo, 500ms)
    await new Promise(resolve => setTimeout(resolve, 500));

    // Condición para login exitoso
    if (email === 'test@example.com' && password === 'password123') {
      // Reiniciamos el contador de fallos si es exitoso
      this.failCount = 0;
      return new User('fake-id', 'Fake User', email);
    } else {
      // Incrementamos el contador de fallos
      this.failCount++;

      // Si se alcanzan los intentos fallidos, se lanza un LoginLockedException
      if (this.failCount >= this.maxFailsBeforeLock) {
        // Reinicia el contador (o mantener el estado, según tu lógica)
        this.failCount = 0;
        throw new LoginLockedException(120); // bloquea por 120 segundos
      }
      // Si no se alcanzó el límite, lanzamos un error de credenciales inválidas
      throw new Error('Credenciales inválidas');
    }
  }
}
