import { Server, Socket } from "socket.io";
import http, { IncomingMessage } from "http";
import { FRONTEND_URL } from "../config/config.js";
import { SocketEvent, SocketEvents } from "../types/service.types.js";


interface CustomSocket extends Socket {
    request: IncomingMessage & { user: string };
}

class SocketService {

    protected io!: Server;
    protected userSocketsIds: Map<string, string> = new Map();

    constructor(server: http.Server) {

        this.io = new Server({
            cors: {
                origin: [FRONTEND_URL],
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        this.io.attach(server);
        this.userSocketsIds = new Map();
        this.initSockets();
        console.log("Socket.IO attached to the server");
    }

    private initSockets() {

        this.io.on(SocketEvents.CONNECTION, (socket: Socket) => {
            const userId = (socket as CustomSocket).request.user;
            if (this.userSocketsIds.has(userId)) {
                console.log(`User ${userId} already has an active socket: ${this.userSocketsIds.get(userId)}.`);
            } else {
                this.userSocketsIds.set(userId.toString(), socket.id);
            }

            console.log("Current user sockets map: ", Array.from(this.userSocketsIds.entries()));
            console.log(`User ${userId} connected to socket ${socket.id}`);

            this.registerEvents(socket);

            socket.on(SocketEvents.DISCONNECT, () => {
                console.log(`User ${userId} disconnected from socket ${socket.id}`);
                this.userSocketsIds.delete(userId);
            });
        });

    }

    protected registerEvents(socket: Socket) {

        socket.on(SocketEvents.NEW_MESSAGE, (data: MessageEvent) => {
            console.log("New message event received: ", data);
            // Publish message to kafka and redis pub/sub
        })
    }

    protected getSockets = (userIds: string[]) => {
        const sockets = userIds.map((userId)=> this.userSocketsIds.get(userId));
        return sockets;
    }

    public async emitEvents<T extends SocketEvent>(event: SocketEvents, data: T, userIds: string[]) {
        const socketMembers = this.getSockets(userIds) as string[];
        this.io.to(socketMembers).emit(event, data);
    }

    public getIO = () => this.io;
}

export default SocketService;