import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../../common/infrastructure/database/database.service';
import { Administrador } from '../../domain/administrador.entity';
import { IAdministradorRepository } from '../../domain/administrador.repository.interface';

@Injectable()
export class PgAdministradorRepository implements IAdministradorRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private mapToDomain(row: any): Administrador {
    return new Administrador(
      row.id,
      row.nome,
      row.email,
      row.password_hash || row.passwordHash,
      row.restaurante_id || row.restauranteId,
      row.role,
    );
  }

  async save(administrador: Administrador): Promise<void> {
    await this.databaseService.query(
      `INSERT INTO administrador (id, nome, email, password_hash, restaurante_id, role)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        administrador.id,
        administrador.nome,
        administrador.email,
        administrador.passwordHash,
        administrador.restauranteId,
        administrador.role,
      ],
    );
  }

  async findByEmail(email: string): Promise<Administrador | null> {
    const result = await this.databaseService.query(
      `SELECT * FROM administrador WHERE email = $1 LIMIT 1`,
      [email],
    );

    if (!result.rows[0]) return null;
    return this.mapToDomain(result.rows[0]);
  }
}
