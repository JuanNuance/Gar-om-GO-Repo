import { Garcom } from './garcom.entity';

export abstract class IGarcomRepository {
  abstract save(garcom: Garcom): Promise<void>;
  abstract findByEmail(email: string): Promise<Garcom | null>;
  abstract findAllByRestauranteId(restauranteId: string): Promise<Garcom[]>;
  abstract findById(id: string): Promise<Garcom | null>;
  abstract delete(id: string): Promise<void>;
}
