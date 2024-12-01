import amqp, { Connection, Channel, ConsumeMessage } from "amqplib";
import { RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_USER, RABBITMQ_PASS } from "../config/config.js";

class RabbitMQService {
    protected connection: Connection | null = null;
    protected channel: Channel | null = null;

    constructor() {}

    public async initService() {
        this.connection = await amqp.connect({
            hostname: RABBITMQ_HOST,
            port: RABBITMQ_PORT,
            username: RABBITMQ_USER,
            password: RABBITMQ_PASS,
        });
        this.channel = await this.connection.createChannel();
        console.log("RabbitMQ connected");
    }

    private async createExchange(exchange: string) {
        await this.channel?.assertExchange(exchange, "direct", {
            durable: false,
        });
        console.log(`Exchange ${exchange} created`);
    }

    private async createQueue(queue: string) {
        await this.channel?.assertQueue(queue, {
            durable: false,
        });
        console.log(`Queue ${queue} created`);
    }

    private async publishToExchange(exchange: string, key: string, message: string) {
        this.channel?.publish(exchange, key, Buffer.from(message));
        console.log(`Message published to exchange: ${exchange}, key: ${key}`);
    }

    public async sendWelcomeEmail({email, contentType, content} : any) {
        await this.publishToExchange("welcome-email", "welcome-email", 'hello' );
    }

    public async sendPasswordResetEmail({email, contentType, content} : any) {
        await this.publishToExchange("reset-password", "reset-password", 'hello');
    }

    public async sendVerifyEmail({email, contentType, content} : any) {
        await this.publishToExchange("verify-email", "verify-email", 'hello');
    }

    private async consumeMessage(queue: string, handler: (message: ConsumeMessage) => void) {
        await this.channel?.consume(queue, (msg) => {
            if (msg) {
                handler(msg);
                this.channel?.ack(msg);
            }
        });
        console.log(`Consumer set up for queue ${queue}`);
    }

    async consumeWelcomeEmail() {
        await this.consumeMessage("welcome-email", async (msg) => {
            const emailData = JSON.parse(msg?.content.toString() || "");
            // await sendMail(emailData);
        });
    }

    async consumePasswordResetEmail() {
        await this.consumeMessage("reset-password", async (msg) => {
            const emailData = JSON.parse(msg?.content.toString() || "");
            // await sendMail(emailData);
        });
    }

    async consumeVerifyEmail() {
        await this.consumeMessage("verify-email", async (msg) => {
            const emailData = JSON.parse(msg?.content.toString() || "");
            // await sendMail(emailData);
        });
    }

    private async initExchange() {
        await this.createExchange('location-exchange');
        await this.createExchange('email-exchange');
        await this.createExchange('notification-queue');
        await this.createExchange('feed-exchange');
    }

    private async initQueue() {
        await this.createQueue('reset-password');
        await this.createQueue("welcome-email");
        await this.createQueue('verify-email');
    }

    private async bindQueue() {
        await this.channel?.bindQueue('reset-password', 'email-exchange', 'reset-password');
        await this.channel?.bindQueue('welcome-email', 'email-exchange', 'welcome-email');
        await this.channel?.bindQueue('verify-email', 'email-exchange', 'verify-email');
    }

    private async initConsumers() {
        await this.consumeWelcomeEmail();
        await this.consumePasswordResetEmail();
        await this.consumeVerifyEmail();
    }

    public async init() {
        await this.initExchange();
        await this.initQueue();
        await this.bindQueue();
        await this.initConsumers();
    }
}

export default RabbitMQService;