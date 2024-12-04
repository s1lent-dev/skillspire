import { socketService } from "../app.js";
import { MessageEvent, SocketEvent, SocketEvents } from "../types/service.types.js";


// Redis PubSub Handlers
const redisMessageEventHandler = async (message: string, channel: SocketEvents) => {
    const msg = await JSON.parse(message) as MessageEvent;
    socketService.emitEvents(channel, msg, msg.memberIds);
}



// Kafka Consumer Handlers
const kafkaMessageEventHandler = async (message: SocketEvent) => {
    console.log("Kafka Message Received", message);
}

export { redisMessageEventHandler, kafkaMessageEventHandler };