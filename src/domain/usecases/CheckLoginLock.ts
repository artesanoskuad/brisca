// src/domain/usecases/CheckLoginLock.ts
export class CheckLoginLock {
    private attempts: number = 0;
    private lockTime: number = 120; // segundos de bloqueo
    private lastAttemptTime: number = 0;
  
    registerAttempt(success: boolean): void {
      if (success) {
        this.attempts = 0;
        this.lastAttemptTime = 0;
      } else {
        this.attempts += 1;
        this.lastAttemptTime = Date.now();
      }
    }
  
    getLockRemainingSeconds(): number {
      if (this.attempts < 3) return 0;
      const elapsed = (Date.now() - this.lastAttemptTime) / 1000;
      const remaining = this.lockTime - elapsed;
      return remaining > 0 ? Math.ceil(remaining) : 0;
    }
  }
  