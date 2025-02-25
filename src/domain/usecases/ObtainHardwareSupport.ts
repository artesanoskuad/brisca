// src/domain/usecases/ObtainHardwareSupport.ts
import { HardwareSupport } from "../entities/HardwareSupport";

export interface HardwareSupportDatasource {
  obtainSupport(): Promise<HardwareSupport>;
}

export class ObtainHardwareSupport {
  constructor(private datasource: HardwareSupportDatasource) {}

  async execute(): Promise<HardwareSupport> {
    return this.datasource.obtainSupport();
  }
}
