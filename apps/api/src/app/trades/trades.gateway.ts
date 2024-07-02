import { Logger } from "@nestjs/common";
import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer,
} from "@nestjs/websockets";

import { Server } from "socket.io";
import { startClientTickerSubscription, stopAllClientSubscriptions, stopClientTickerSubscription } from "./trades";

@WebSocketGateway({ cors: true })
export class TradesGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly logger = new Logger(TradesGateway.name);
    
    @WebSocketServer() io: Server = new Server();
    connectedClients = {};
    
    afterInit() {
        this.logger.log("[EVENT] Trades Gateway Initialized!");
    }
    
    handleConnection(client: any) {
        const { sockets } = this.io.sockets;
        
        this.logger.log(`[EVENT] Client connected: ${client.id}`);
        this.logger.debug(`[INFO] ${sockets.size} clients are connected`);
        
        this.connectedClients[client.id] = client;
    }
    
    handleDisconnect(client: any) {
        this.logger.log(`[EVENT] Client disconnected: ${client.id}`);
        
        delete this.connectedClients[client.id];
        stopAllClientSubscriptions(client.id)
    }
    
    @SubscribeMessage('sub')
    subscribeToTicker(@ConnectedSocket() client: any, @MessageBody() body: string): void {
        this.logger.log(`*SUBBBBB ****************\n${body}`)
        const jsonBody = JSON.parse(body);
        startClientTickerSubscription(this.io, client.id, jsonBody.ticker, jsonBody.lastPrice);
    }
    
    @SubscribeMessage('unsub')
    unsubscribeToTicker(@ConnectedSocket() client: any, @MessageBody() body: string): void {
        this.logger.log(`*!!UNSUBBBBB ****************\n${body}`)
        const jsonBody = JSON.parse(body);
        stopClientTickerSubscription(client.id, jsonBody.ticker);
    }
}
