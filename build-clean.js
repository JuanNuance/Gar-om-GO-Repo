const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src', 'modules');

const writeFile = (filePath, content) => {
  const fullPath = path.join(srcDir, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf-8');
};

// ================= ITEM =================
writeFile('item/domain/item.entity.ts', `
export enum CategoriaItem {
  BEBIDAS = 'BEBIDAS',
  PRATOS = 'PRATOS',
  SOBREMESAS = 'SOBREMESAS',
}

export class Item {
  constructor(
    public readonly id: string,
    public readonly nome: string,
    public readonly descricao: string | null,
    public readonly preco: number,
    public readonly categoria: CategoriaItem,
    public readonly restauranteId: string,
  ) {}
}
`);

writeFile('item/domain/item.repository.interface.ts', `
import { Item } from './item.entity';

export interface IItemRepository {
  criar(item: Omit<Item, 'id'>): Promise<Item>;
  listarPorRestaurante(restauranteId: string): Promise<Item[]>;
}

export const ITEM_REPOSITORY = Symbol('ITEM_REPOSITORY');
`);

writeFile('item/application/dto/criar-item.dto.ts', `
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { CategoriaItem } from '../../domain/item.entity';

export class CriarItemDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @IsNumber()
  @Min(0)
  preco: number;

  @IsEnum(CategoriaItem)
  @IsNotEmpty()
  categoria: CategoriaItem;

  @IsUUID()
  @IsNotEmpty()
  restauranteId: string;
}
`);

writeFile('item/application/criar-item.use-case.ts', `
import { Injectable, Inject } from '@nestjs/common';
import type { IItemRepository } from '../domain/item.repository.interface';
import { ITEM_REPOSITORY } from '../domain/item.repository.interface';
import { CriarItemDto } from './dto/criar-item.dto';
import { Item } from '../domain/item.entity';

@Injectable()
export class CriarItemUseCase {
  constructor(
    @Inject(ITEM_REPOSITORY)
    private readonly itemRepository: IItemRepository,
  ) {}

  async executar(dados: CriarItemDto): Promise<Item> {
    return this.itemRepository.criar({
      nome: dados.nome,
      descricao: dados.descricao || null,
      preco: dados.preco,
      categoria: dados.categoria,
      restauranteId: dados.restauranteId,
    });
  }
}
`);

writeFile('item/infrastructure/repositories/prisma-item.repository.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IItemRepository } from '../../domain/item.repository.interface';
import { Item, CategoriaItem } from '../../domain/item.entity';

@Injectable()
export class PrismaItemRepository implements IItemRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(itemPrisma: any): Item {
    return new Item(
      itemPrisma.id,
      itemPrisma.nome,
      itemPrisma.descricao,
      itemPrisma.preco,
      itemPrisma.categoria as CategoriaItem,
      itemPrisma.restauranteId,
    );
  }

  async criar(item: Omit<Item, 'id'>): Promise<Item> {
    const itemCriado = await this.prisma.item.create({
      data: {
        nome: item.nome,
        descricao: item.descricao,
        preco: item.preco,
        categoria: item.categoria,
        restauranteId: item.restauranteId,
      },
    });
    return this.mapToDomain(itemCriado);
  }

  async listarPorRestaurante(restauranteId: string): Promise<Item[]> {
    const itens = await this.prisma.item.findMany({ where: { restauranteId } });
    return itens.map(this.mapToDomain);
  }
}
`);

writeFile('item/presentation/item.controller.ts', `
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CriarItemUseCase } from '../application/criar-item.use-case';
import { CriarItemDto } from '../application/dto/criar-item.dto';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { Inject } from '@nestjs/common';
import type { IItemRepository } from '../domain/item.repository.interface';
import { ITEM_REPOSITORY } from '../domain/item.repository.interface';

@UseGuards(JwtAuthGuard)
@Controller('itens')
export class ItemController {
  constructor(
    private readonly criarItemUseCase: CriarItemUseCase,
    @Inject(ITEM_REPOSITORY) private readonly itemRepository: IItemRepository
  ) {}

  @Post()
  criar(@Body() criarItemDto: CriarItemDto) {
    return this.criarItemUseCase.executar(criarItemDto);
  }

  @Get('restaurante/:id')
  listar(@Param('id') id: string) {
    return this.itemRepository.listarPorRestaurante(id);
  }
}
`);

writeFile('item/item.module.ts', `
import { Module } from '@nestjs/common';
import { ItemController } from './presentation/item.controller';
import { CriarItemUseCase } from './application/criar-item.use-case';
import { PrismaItemRepository } from './infrastructure/repositories/prisma-item.repository';
import { ITEM_REPOSITORY } from './domain/item.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [ItemController],
  providers: [
    PrismaService,
    CriarItemUseCase,
    {
      provide: ITEM_REPOSITORY,
      useClass: PrismaItemRepository,
    },
  ],
})
export class ItemModule {}
`);

// ================= PEDIDO =================
writeFile('pedido/domain/pedido.entity.ts', `
export enum StatusPedido {
  PENDENTE = 'PENDENTE',
  PREPARANDO = 'PREPARANDO',
  ENTREGUE = 'ENTREGUE',
  FINALIZADO = 'FINALIZADO',
  CANCELADO = 'CANCELADO',
}

export class Pedido {
  constructor(
    public readonly id: string,
    public readonly status: StatusPedido,
    public readonly valorTotal: number,
    public readonly mesaId: string,
    public readonly garcomId: string,
    public readonly createdAt: Date,
  ) {}
}
`);

writeFile('pedido/domain/pedido.repository.interface.ts', `
import { Pedido, StatusPedido } from './pedido.entity';

export interface IPedidoRepository {
  criar(mesaId: string, garcomId: string): Promise<Pedido>;
  adicionarItem(pedidoId: string, itemId: string, quantidade: number, precoUnitario: number): Promise<void>;
  alterarStatus(id: string, status: StatusPedido): Promise<Pedido>;
  listarPorRestaurante(restauranteId: string): Promise<Pedido[]>;
}

export const PEDIDO_REPOSITORY = Symbol('PEDIDO_REPOSITORY');
`);

writeFile('pedido/application/dto/criar-pedido.dto.ts', `
import { IsNotEmpty, IsUUID } from 'class-validator';

export class CriarPedidoDto {
  @IsUUID()
  @IsNotEmpty()
  mesaId: string;

  @IsUUID()
  @IsNotEmpty()
  garcomId: string;
}
`);

writeFile('pedido/application/dto/adicionar-item-pedido.dto.ts', `
import { IsInt, IsNotEmpty, IsUUID, Min } from 'class-validator';

export class AdicionarItemPedidoDto {
  @IsUUID()
  @IsNotEmpty()
  pedidoId: string;

  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @IsInt()
  @Min(1)
  quantidade: number;
}
`);

writeFile('pedido/application/criar-pedido.use-case.ts', `
import { Injectable, Inject } from '@nestjs/common';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';
import { CriarPedidoDto } from './dto/criar-pedido.dto';
import { Pedido } from '../domain/pedido.entity';

@Injectable()
export class CriarPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY)
    private readonly pedidoRepository: IPedidoRepository,
  ) {}

  async executar(dados: CriarPedidoDto): Promise<Pedido> {
    return this.pedidoRepository.criar(dados.mesaId, dados.garcomId);
  }
}
`);

writeFile('pedido/application/adicionar-item-pedido.use-case.ts', `
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';
import { AdicionarItemPedidoDto } from './dto/adicionar-item-pedido.dto';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class AdicionarItemPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY)
    private readonly pedidoRepository: IPedidoRepository,
    private readonly prisma: PrismaService,
  ) {}

  async executar(dados: AdicionarItemPedidoDto): Promise<void> {
    const item = await this.prisma.item.findUnique({ where: { id: dados.itemId } });
    if (!item) throw new NotFoundException('Item não encontrado');

    await this.pedidoRepository.adicionarItem(dados.pedidoId, dados.itemId, dados.quantidade, item.preco);
  }
}
`);

writeFile('pedido/application/alterar-status-pedido.use-case.ts', `
import { Injectable, Inject } from '@nestjs/common';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';
import { StatusPedido } from '../domain/pedido.entity';

@Injectable()
export class AlterarStatusPedidoUseCase {
  constructor(
    @Inject(PEDIDO_REPOSITORY)
    private readonly pedidoRepository: IPedidoRepository,
  ) {}

  async executar(id: string, status: StatusPedido) {
    return this.pedidoRepository.alterarStatus(id, status);
  }
}
`);

writeFile('pedido/infrastructure/repositories/prisma-pedido.repository.ts', `
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../prisma/prisma.service';
import { IPedidoRepository } from '../../domain/pedido.repository.interface';
import { Pedido, StatusPedido } from '../../domain/pedido.entity';

@Injectable()
export class PrismaPedidoRepository implements IPedidoRepository {
  constructor(private readonly prisma: PrismaService) {}

  private mapToDomain(pedidoPrisma: any): Pedido {
    return new Pedido(
      pedidoPrisma.id,
      pedidoPrisma.status as StatusPedido,
      pedidoPrisma.valorTotal,
      pedidoPrisma.mesaId,
      pedidoPrisma.garcomId,
      pedidoPrisma.createdAt,
    );
  }

  async criar(mesaId: string, garcomId: string): Promise<Pedido> {
    const pedido = await this.prisma.pedido.create({
      data: {
        mesaId,
        garcomId,
        status: 'PENDENTE',
        valorTotal: 0,
      },
    });
    return this.mapToDomain(pedido);
  }

  async adicionarItem(pedidoId: string, itemId: string, quantidade: number, precoUnitario: number): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      await tx.itemPedido.create({
        data: { pedidoId, itemId, quantidade },
      });
      const valorAdicional = quantidade * precoUnitario;
      await tx.pedido.update({
        where: { id: pedidoId },
        data: { valorTotal: { increment: valorAdicional } },
      });
    });
  }

  async alterarStatus(id: string, status: StatusPedido): Promise<Pedido> {
    const pedido = await this.prisma.pedido.update({
      where: { id },
      data: { status },
    });
    return this.mapToDomain(pedido);
  }

  async listarPorRestaurante(restauranteId: string): Promise<Pedido[]> {
    const pedidos = await this.prisma.pedido.findMany({
      where: {
        mesa: { restauranteId },
      },
    });
    return pedidos.map(this.mapToDomain);
  }
}
`);

writeFile('pedido/presentation/pedido.controller.ts', `
import { Body, Controller, Get, Param, Patch, Post, UseGuards, Inject } from '@nestjs/common';
import { CriarPedidoUseCase } from '../application/criar-pedido.use-case';
import { AdicionarItemPedidoUseCase } from '../application/adicionar-item-pedido.use-case';
import { AlterarStatusPedidoUseCase } from '../application/alterar-status-pedido.use-case';
import { CriarPedidoDto } from '../application/dto/criar-pedido.dto';
import { AdicionarItemPedidoDto } from '../application/dto/adicionar-item-pedido.dto';
import { StatusPedido } from '../domain/pedido.entity';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import type { IPedidoRepository } from '../domain/pedido.repository.interface';
import { PEDIDO_REPOSITORY } from '../domain/pedido.repository.interface';

@UseGuards(JwtAuthGuard)
@Controller('pedidos')
export class PedidoController {
  constructor(
    private readonly criarPedidoUseCase: CriarPedidoUseCase,
    private readonly adicionarItemUseCase: AdicionarItemPedidoUseCase,
    private readonly alterarStatusUseCase: AlterarStatusPedidoUseCase,
    @Inject(PEDIDO_REPOSITORY) private readonly pedidoRepository: IPedidoRepository,
  ) {}

  @Post()
  criar(@Body() criarPedidoDto: CriarPedidoDto) {
    return this.criarPedidoUseCase.executar(criarPedidoDto);
  }

  @Post('item')
  adicionarItem(@Body() dto: AdicionarItemPedidoDto) {
    return this.adicionarItemUseCase.executar(dto);
  }

  @Patch(':id/status')
  alterarStatus(@Param('id') id: string, @Body('status') status: StatusPedido) {
    return this.alterarStatusUseCase.executar(id, status);
  }

  @Get('restaurante/:id')
  listarPorRestaurante(@Param('id') id: string) {
    return this.pedidoRepository.listarPorRestaurante(id);
  }
}
`);

writeFile('pedido/pedido.module.ts', `
import { Module } from '@nestjs/common';
import { PedidoController } from './presentation/pedido.controller';
import { CriarPedidoUseCase } from './application/criar-pedido.use-case';
import { AdicionarItemPedidoUseCase } from './application/adicionar-item-pedido.use-case';
import { AlterarStatusPedidoUseCase } from './application/alterar-status-pedido.use-case';
import { PrismaPedidoRepository } from './infrastructure/repositories/prisma-pedido.repository';
import { PEDIDO_REPOSITORY } from './domain/pedido.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [PedidoController],
  providers: [
    PrismaService,
    CriarPedidoUseCase,
    AdicionarItemPedidoUseCase,
    AlterarStatusPedidoUseCase,
    {
      provide: PEDIDO_REPOSITORY,
      useClass: PrismaPedidoRepository,
    },
  ],
})
export class PedidoModule {}
`);

console.log('Scripts run ok.');
