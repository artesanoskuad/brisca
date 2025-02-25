// src/domain/exceptions/LoginLockedException.ts
export class LoginLockedException extends Error {
    constructor(public remainingSeconds: number) {
      super(`Login bloqueado por ${remainingSeconds} segundos`);
      Object.setPrototypeOf(this, LoginLockedException.prototype);
    }
  }
  