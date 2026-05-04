# Camada de Infraestrutura: Prisma

Este diretório contém o `PrismaService`, que é o wrapper do NestJS para o `PrismaClient`.

### Por que foi implementado?
- **Conectividade:** Centraliza a conexão com o banco de dados PostgreSQL.
- **Lifecycle Hooks:** Utiliza `onModuleInit` e `onModuleDestroy` para garantir que o cliente se conecte e desconecte corretamente conforme o ciclo de vida do NestJS.
- **Injeção de Dependência:** Permite que outros serviços/repositórios injetem o banco de dados de forma desacoplada.
