import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Pool, PoolClient, QueryResult } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private readonly pool: Pool;
  private readonly logger = new Logger(DatabaseService.name);

  constructor() {
    const connectionString = process.env.DIRECT_URL;
    if (!connectionString) {
      throw new Error('DIRECT_URL environment variable is required for DatabaseService');
    }

    this.pool = new Pool({ connectionString });
  }

  async onModuleInit() {
    await this.createTables();
  }

  private async createTables(): Promise<void> {
    const createTablesSQL = `
      CREATE TABLE IF NOT EXISTS restaurante (
        id VARCHAR(255) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        cnpj VARCHAR(20) NOT NULL,
        endereco TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS administrador (
        id VARCHAR(255) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        restaurante_id VARCHAR(255) REFERENCES restaurante(id),
        role VARCHAR(50) NOT NULL DEFAULT 'ADMIN'
      );

      CREATE TABLE IF NOT EXISTS garcom (
        id VARCHAR(255) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        restaurante_id VARCHAR(255) NOT NULL REFERENCES restaurante(id),
        role VARCHAR(50) NOT NULL DEFAULT 'GARCOM'
      );

      CREATE TABLE IF NOT EXISTS mesa (
        id VARCHAR(255) PRIMARY KEY,
        numero INTEGER NOT NULL,
        capacidade INTEGER NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'DISPONIVEL',
        restaurante_id VARCHAR(255) NOT NULL REFERENCES restaurante(id)
      );

      CREATE TABLE IF NOT EXISTS item (
        id VARCHAR(255) PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        descricao TEXT,
        preco DECIMAL(10, 2) NOT NULL,
        categoria VARCHAR(50) NOT NULL,
        restaurante_id VARCHAR(255) NOT NULL REFERENCES restaurante(id)
      );

      CREATE TABLE IF NOT EXISTS pedido (
        id VARCHAR(255) PRIMARY KEY,
        mesa_id VARCHAR(255) NOT NULL REFERENCES mesa(id),
        garcom_id VARCHAR(255) NOT NULL REFERENCES garcom(id),
        status VARCHAR(50) NOT NULL DEFAULT 'PENDENTE',
        valor_total DECIMAL(10, 2) NOT NULL DEFAULT 0,
        tempo_preparo INTEGER,
        tempo_espera INTEGER,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS pedido_item (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        pedido_id VARCHAR(255) NOT NULL REFERENCES pedido(id),
        item_id VARCHAR(255) NOT NULL REFERENCES item(id),
        quantidade INTEGER NOT NULL,
        preco_unitario DECIMAL(10, 2) NOT NULL
      );
    `;

    try {
      await this.pool.query(createTablesSQL);
      this.logger.log('✅ Todas as tabelas foram criadas/verificadas com sucesso');
    } catch (error) {
      this.logger.error('❌ Erro ao criar tabelas no banco de dados', error);
      throw error;
    }
  }

  async query<T = any>(text: string, params: any[] = []): Promise<QueryResult<T>> {
    return this.pool.query<T>(text, params);
  }

  async transaction<T>(work: (client: PoolClient) => Promise<T>): Promise<T> {
    const client = await this.pool.connect();

    try {
      await client.query('BEGIN');
      const result = await work(client);
      await client.query('COMMIT');
      return result;
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
