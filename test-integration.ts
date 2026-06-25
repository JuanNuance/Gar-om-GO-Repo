import { NestFactory } from '@nestjs/core';
import { AppModule } from './src/app.module';
import { DatabaseService } from './src/common/infrastructure/database/database.service';
import { IAdministradorRepository } from './src/modules/administrador/domain/administrador.repository.interface';
import { Administrador } from './src/modules/administrador/domain/administrador.entity';
import { IRestauranteRepository, RESTAURANTE_REPOSITORY } from './src/modules/restaurante/domain/restaurante.repository.interface';
import { Restaurante } from './src/modules/restaurante/domain/restaurante.entity';
import { IGarcomRepository, GARCOM_REPOSITORY } from './src/modules/garcom/domain/garcom.repository.interface';
import { Garcom } from './src/modules/garcom/domain/garcom.entity';
import { IMesaRepository, MESA_REPOSITORY } from './src/modules/mesa/domain/mesa.repository.interface';
import { Mesa, StatusMesa } from './src/modules/mesa/domain/mesa.entity';
import { IItemRepository, ITEM_REPOSITORY } from './src/modules/item/domain/item.repository.interface';
import { Item, CategoriaItem } from './src/modules/item/domain/item.entity';
import { IPedidoRepository, PEDIDO_REPOSITORY } from './src/modules/pedido/domain/pedido.repository.interface';
import { Pedido, StatusPedido } from './src/modules/pedido/domain/pedido.entity';
import { VisualizarPedidosCozinhaUseCase } from './src/modules/cozinha/application/visualizar-pedidos-cozinha.use-case';
import { AlterarStatusPedidoCozinhaUseCase } from './src/modules/cozinha/application/alterar-status-pedido-cozinha.use-case';

async function bootstrap() {
  console.log('Iniciando Testes de Integração...');
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const db = app.get(DatabaseService);
  const adminRepo = app.get<IAdministradorRepository>(IAdministradorRepository);
  const restRepo = app.get<IRestauranteRepository>(RESTAURANTE_REPOSITORY);
  const garcomRepo = app.get<IGarcomRepository>(GARCOM_REPOSITORY);
  const mesaRepo = app.get<IMesaRepository>(MESA_REPOSITORY);
  const itemRepo = app.get<IItemRepository>(ITEM_REPOSITORY);
  const pedidoRepo = app.get<IPedidoRepository>(PEDIDO_REPOSITORY);
  const visualizarCozinha = app.get(VisualizarPedidosCozinhaUseCase);
  const alterarStatusCozinha = app.get(AlterarStatusPedidoCozinhaUseCase);

  try {
    console.log('1. Limpando banco de dados para testes...');
    await db.query('TRUNCATE TABLE pedido_item, pedido, item, mesa, garcom, administrador, restaurante CASCADE');

    console.log('2. Testando criação de Restaurante...');
    const restauranteId = 'rest-123';
    const restaurante = new Restaurante(restauranteId, 'Restaurante Teste', '12.345.678/0001-99', 'Rua Teste, 123');
    await restRepo.criar(restaurante);

    console.log('3. Testando criação de Administrador...');
    const adminId = 'admin-123';
    const admin = new Administrador(adminId, 'Admin Teste', 'admin@teste.com', 'hash_senha', restauranteId);
    await adminRepo.save(admin);

    console.log('4. Testando criação de Garçom...');
    const garcomId = 'garcom-123';
    const garcom = new Garcom(garcomId, 'Garcom Teste', 'garcom@teste.com', restauranteId, 'GARCOM');
    await garcomRepo.criar(garcom);

    console.log('5. Testando criação de Mesa...');
    const mesaId = 'mesa-123';
    const mesa = new Mesa(mesaId, 1, 4, StatusMesa.DISPONIVEL, restauranteId);
    await mesaRepo.criar(mesa);

    console.log('6. Testando criação de Item...');
    const itemId = 'item-123';
    const item = new Item(itemId, 'Hamburguer', 'Delicioso', 25.50, CategoriaItem.PRATOS, restauranteId);
    await itemRepo.criar(item);

    console.log('7. Testando criação de Pedido...');
    const pedidoId = 'pedido-123';
    const pedido = new Pedido(pedidoId, StatusPedido.PENDENTE, 0, mesaId, garcomId, new Date());
    await pedidoRepo.criar(pedido);

    console.log('8. Testando adição de Item ao Pedido...');
    await pedidoRepo.adicionarItem(pedidoId, itemId, 2, 25.50);

    console.log('9. Validando cruzamento de dados: Visualizar Pedidos (Cozinha)...');
    const pedidosCozinha = await visualizarCozinha.executar(restauranteId);
    if (pedidosCozinha.length !== 1) {
      throw new Error(`Esperava 1 pedido na cozinha, encontrou ${pedidosCozinha.length}`);
    }
    console.log(`- Pedido encontrado na cozinha: ${pedidosCozinha[0].id} (Mesa ${pedidosCozinha[0].numero_mesa}) com valor total ${pedidosCozinha[0].valor_total}`);

    console.log('10. Validando cruzamento de dados: Alterar Status Pedido (Cozinha)...');
    const pedidoAtualizado = await alterarStatusCozinha.executar(pedidoId, StatusPedido.PREPARANDO, 15, 30);
    if (pedidoAtualizado.status !== StatusPedido.PREPARANDO) {
      throw new Error(`Status do pedido não atualizado. Atual: ${pedidoAtualizado.status}`);
    }
    console.log(`- Pedido atualizado com sucesso para status: ${pedidoAtualizado.status}, tempo de preparo: ${pedidoAtualizado.tempo_preparo}`);

    console.log('✅ TESTES DE INTEGRAÇÃO CONCLUÍDOS COM SUCESSO!');
  } catch (err) {
    console.error('❌ FALHA NOS TESTES DE INTEGRAÇÃO:', err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

bootstrap();
