import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASS } from "../config/config.js";
import { ExchangeTypes, QueueTypes, RabbitMQContent } from "../types/service.types.js";
import { sendMail } from "../services/mail.service.js";

class RabbitMQService {
    protected connection: Connection | null = null;
    protected channel: Channel | null = null;

    private readonly exchanges = [
        { exchange: ExchangeTypes.EMAIL_EXCHANGE, type: "direct", durable: true },
        { exchange: ExchangeTypes.LOCATION_EXCHANGE, type: "direct", durable: true },
        { exchange: ExchangeTypes.NOTIFICATION_EXCHANGE, type: "direct", durable: true },
        { exchange: ExchangeTypes.FEED_EXCHANGE, type: "direct", durable: true },
    ];

    private readonly queues = [
        { queue: QueueTypes.VERIFY_EMAIL, exchange: ExchangeTypes.EMAIL_EXCHANGE },
        { queue: QueueTypes.WELCOME_EMAIL, exchange: ExchangeTypes.EMAIL_EXCHANGE },
        { queue: QueueTypes.RESET_PASSWORD, exchange: ExchangeTypes.EMAIL_EXCHANGE },
    ];

    private readonly consumers: Record<string, (message: RabbitMQContent) => Promise<void>> = {
        [QueueTypes.VERIFY_EMAIL]: sendMail,
        [QueueTypes.WELCOME_EMAIL]: sendMail,
        [QueueTypes.RESET_PASSWORD]: sendMail,
    };

    public async initService() {
        try {
            this.connection = await amqp.connect({
                hostname: RABBITMQ_HOST,
                port: RABBITMQ_PORT,
                username: RABBITMQ_USER,
                password: RABBITMQ_PASS,
            });
            this.channel = await this.connection.createChannel();
            console.log("RabbitMQ connected");
        } catch (error) {
            console.error("RabbitMQ connection failed:", error);
            process.exit(1);
        }
    }

    private async createExchanges() {
        for (const { exchange, type, durable } of this.exchanges) {
            await this.channel?.assertExchange(exchange, type, { durable });
            console.log(`Exchange created: ${exchange}`);
        }
    }

    private async createQueues() {
        for (const { queue } of this.queues) {
            await this.channel?.assertQueue(queue, { durable: true });
            console.log(`Queue created: ${queue}`);
        }
    }

    private async bindQueues() {
        for (const { queue, exchange } of this.queues) {
            await this.channel?.bindQueue(queue, exchange, queue);
            console.log(`Queue ${queue} bound to exchange ${exchange}`);
        }
    }

    private async setupConsumers() {
        for (const [queue, handler] of Object.entries(this.consumers)) {
            await this.channel?.consume(queue, async (msg) => {
                if (msg) {
                    try {
                        const content = JSON.parse(msg.content.toString()) as RabbitMQContent;
                        await handler(content);
                        this.channel?.ack(msg);
                        console.log(`Message processed from queue: ${queue}`);
                    } catch (error) {
                        console.error(`Error processing message from queue ${queue}:`, error);
                        this.channel?.nack(msg, false, false);
                    }
                }
            });
            console.log(`Consumer set up for queue: ${queue}`);
        }
    }

    public async publishToExchange<T extends RabbitMQContent>(exchange: string, routingKey: string, message: T) {
        try {
            this.channel?.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
            console.log(`Message published to exchange: ${exchange}, key: ${routingKey}`);
        } catch (error) {
            console.error("Failed to publish message:", error);
        }
    }

    public async init() {
        await this.initService();
        await this.createExchanges();
        await this.createQueues();
        await this.bindQueues();
        await this.setupConsumers();
        console.log("RabbitMQ infrastructure initialized");
    }

    public async close() {
        try {
            await this.channel?.close();
            await this.connection?.close();
            console.log("RabbitMQ connection closed");
        } catch (error) {
            console.error("Error closing RabbitMQ connection:", error);
        }
    }

    public registerShutdownHooks() {
        process.on("SIGINT", async () => {
            console.log("SIGINT received. Closing RabbitMQ connection...");
            await this.close();
            process.exit(0);
        });

        process.on("SIGTERM", async () => {
            console.log("SIGTERM received. Closing RabbitMQ connection...");
            await this.close();
            process.exit(0);
        });
    }
}

export default RabbitMQService;
