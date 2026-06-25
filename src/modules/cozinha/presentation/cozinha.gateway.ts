import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@Injectable()
@WebSocketGateway({ cors: true })
export class CozinhaGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  notificarNovoPedido(pedido: any) {
    this.server?.emit('novoPedido', pedido);
  }

  notificarStatusAlterado(pedido: any) {
    this.server?.emit('statusPedidoAlterado', pedido);
  }
}
