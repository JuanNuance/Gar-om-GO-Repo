import { Administrador } from './administrador.entity';

export abstract class IAdministradorRepository {
  abstract save(administrador: Administrador): Promise<void>;
  abstract findByEmail(email: string): Promise<Administrador | null>;
}
