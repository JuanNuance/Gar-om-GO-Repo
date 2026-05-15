const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'modules');
const writeFile = (filePath, content) => {
  const fullPath = path.join(srcDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf-8');
};

// ================= GARCOM =================
writeFile('garcom/domain/garcom.entity.ts', `
export class Garcom {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly email: string,
    public readonly restauranteId: string,
    public readonly role: string,
  ) {}
}
`);

writeFile('garcom/domain/garcom.repository.interface.ts', `
import { Garcom } from './garcom.entity';

export interface IGarcomRepository {
  criar(garcom: Omit<Garcom, 'id' | 'role'> & { passwordHash: string }): Promise<Garcom>;
  listarPorRestaurante(restauranteId: string): Promise<Garcom[]>;
}

export const GARCOM_REPOSITORY = Symbol('GARCOM_REPOSITORY');
`);

writeFile('garcom/application/dto/criar-garcom.dto.ts', `
import { IsEmail, IsNotEmpty, IsString, IsUUID, MinLength } from 'class-validator';

export class CriarGarcomDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6)
  senha: string;

  @IsUUID()
  @IsNotEmpty()
  restauranteId: string;
}
`);

writeFile('garcom/application/criar-garcom.use-case.ts', `
import { Injectable, Inject } from '@nestjs/common';
import type { IGarcomRepository } from '../domain/garcom.repository.interface';
import { GARCOM_REPOSITORY } from '../domain/garcom.repository.interface';
import { CriarGarcomDto } from './dto/criar-garcom.dto';
import { Garcom } from '../domain/garcom.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class CriarGarcomUseCase {
  constructor(
    @Inject(GARCOM_REPOSITORY)
    private readonly garcomRepository: IGarcomRepository,
  ) {}

  async executar(dados: CriarGarcomDto): Promise<Garcom> {
    const passwordHash = await bcrypt.hash(dados.senha, 10);
    return this.garcomRepository.criar({
      nome: dados.nome,
      email: dados.email,
      restauranteId: dados.restauranteId,
      passwordHash,
    });
  }
}
`);

writeFile('garcom/infrastructure/repositories/prisma-garcom.repository.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IGarcomRepository } from '../../domain/garcom.repository.interface';
import { Garcom } from '../../domain/garcom.entity';

@Injectable()
export class PrismaGarcomRepository implements IGarcomRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(g: any): Garcom {
    return new Garcom(g.id, g.nome, g.email, g.restauranteId, g.role);
  }

  async criar(garcom: Omit<Garcom, 'id' | 'role'> & { passwordHash: string }): Promise<Garcom> {
    const garcomCriado = await this.prisma.garcom.create({
      data: garcom,
    });
    return this.mapToDomain(garcomCriado);
  }

  async listarPorRestaurante(restauranteId: string): Promise<Garcom[]> {
    const garcons = await this.prisma.garcom.findMany({ where: { restauranteId } });
    return garcons.map(this.mapToDomain);
  }
}
`);

writeFile('garcom/presentation/garcom.controller.ts', `
import { Body, Controller, Get, Param, Post, UseGuards, Inject } from '@nestjs/common';
import { CriarGarcomUseCase } from '../application/criar-garcom.use-case';
import { CriarGarcomDto } from '../application/dto/criar-garcom.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import type { IGarcomRepository } from '../domain/garcom.repository.interface';
import { GARCOM_REPOSITORY } from '../domain/garcom.repository.interface';

@Controller('garcom')
export class GarcomController {
  constructor(
    private readonly criarGarcomUseCase: CriarGarcomUseCase,
    @Inject(GARCOM_REPOSITORY) private readonly garcomRepository: IGarcomRepository,
  ) {}

  @Post()
  criar(@Body() dto: CriarGarcomDto) {
    return this.criarGarcomUseCase.executar(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('restaurante/:id')
  listar(@Param('id') id: string) {
    return this.garcomRepository.listarPorRestaurante(id);
  }
}
`);

writeFile('garcom/garcom.module.ts', `
import { Module } from '@nestjs/common';
import { GarcomController } from './presentation/garcom.controller';
import { CriarGarcomUseCase } from './application/criar-garcom.use-case';
import { PrismaGarcomRepository } from './infrastructure/repositories/prisma-garcom.repository';
import { GARCOM_REPOSITORY } from './domain/garcom.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [GarcomController],
  providers: [
    PrismaService,
    CriarGarcomUseCase,
    {
      provide: GARCOM_REPOSITORY,
      useClass: PrismaGarcomRepository,
    },
  ],
})
export class GarcomModule {}
`);

// ================= RESTAURANTE =================
// Skipping complete rewrite of Restaurante if it's not explicitly failing, but I will make sure we have basic structure aligned
writeFile('restaurante/domain/restaurante.entity.ts', `
export class Restaurante {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly cnpj: string,
    public readonly endereco: string,
  ) {}
}
`);

writeFile('restaurante/domain/restaurante.repository.interface.ts', `
import { Restaurante } from './restaurante.entity';

export interface IRestauranteRepository {
  criar(restaurante: Omit<Restaurante, 'id'>): Promise<Restaurante>;
  listarTodos(): Promise<Restaurante[]>;
}
export const RESTAURANTE_REPOSITORY = Symbol('RESTAURANTE_REPOSITORY');
`);

writeFile('restaurante/application/dto/criar-restaurante.dto.ts', `
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CriarRestauranteDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @Length(14, 14)
  cnpj: string;

  @IsString()
  @IsNotEmpty()
  endereco: string;
}
`);

writeFile('restaurante/application/criar-restaurante.use-case.ts', `
import { Injectable, Inject } from '@nestjs/common';
import type { IRestauranteRepository } from '../domain/restaurante.repository.interface';
import { RESTAURANTE_REPOSITORY } from '../domain/restaurante.repository.interface';
import { CriarRestauranteDto } from './dto/criar-restaurante.dto';
import { Restaurante } from '../domain/restaurante.entity';

@Injectable()
export class CriarRestauranteUseCase {
  constructor(
    @Inject(RESTAURANTE_REPOSITORY)
    private readonly restauranteRepository: IRestauranteRepository,
  ) {}

  async executar(dados: CriarRestauranteDto): Promise<Restaurante> {
    return this.restauranteRepository.criar(dados);
  }
}
`);

writeFile('restaurante/infrastructure/repositories/prisma-restaurante.repository.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IRestauranteRepository } from '../../domain/restaurante.repository.interface';
import { Restaurante } from '../../domain/restaurante.entity';

@Injectable()
export class PrismaRestauranteRepository implements IRestauranteRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(r: any): Restaurante {
    return new Restaurante(r.id, r.nome, r.cnpj, r.endereco);
  }

  async criar(restaurante: Omit<Restaurante, 'id'>): Promise<Restaurante> {
    const r = await this.prisma.restaurante.create({ data: restaurante });
    return this.mapToDomain(r);
  }

  async listarTodos(): Promise<Restaurante[]> {
    const rs = await this.prisma.restaurante.findMany();
    return rs.map(this.mapToDomain);
  }
}
`);

writeFile('restaurante/presentation/restaurante.controller.ts', `
import { Body, Controller, Get, Post, Inject } from '@nestjs/common';
import { CriarRestauranteUseCase } from '../application/criar-restaurante.use-case';
import { CriarRestauranteDto } from '../application/dto/criar-restaurante.dto';
import type { IRestauranteRepository } from '../domain/restaurante.repository.interface';
import { RESTAURANTE_REPOSITORY } from '../domain/restaurante.repository.interface';

@Controller('restaurantes')
export class RestauranteController {
  constructor(
    private readonly criarRestauranteUseCase: CriarRestauranteUseCase,
    @Inject(RESTAURANTE_REPOSITORY) private readonly restauranteRepository: IRestauranteRepository,
  ) {}

  @Post()
  criar(@Body() dto: CriarRestauranteDto) {
    return this.criarRestauranteUseCase.executar(dto);
  }

  @Get()
  listar() {
    return this.restauranteRepository.listarTodos();
  }
}
`);

writeFile('restaurante/restaurante.module.ts', `
import { Module } from '@nestjs/common';
import { RestauranteController } from './presentation/restaurante.controller';
import { CriarRestauranteUseCase } from './application/criar-restaurante.use-case';
import { PrismaRestauranteRepository } from './infrastructure/repositories/prisma-restaurante.repository';
import { RESTAURANTE_REPOSITORY } from './domain/restaurante.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [RestauranteController],
  providers: [
    PrismaService,
    CriarRestauranteUseCase,
    {
      provide: RESTAURANTE_REPOSITORY,
      useClass: PrismaRestauranteRepository,
    },
  ],
})
export class RestauranteModule {}
`);

console.log('Scripts run ok.');
