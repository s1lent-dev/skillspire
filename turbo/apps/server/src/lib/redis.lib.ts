import Redis from "ioredis";
import { REDIS_HOST, REDIS_PORT } from "../config/config.js";
import { SocketEvents } from "../types/service.types.js";
import { redisMessageEventHandler } from "../utils/service.util.js";

class RedisService {
    
    protected client: Redis | null = null;
    protected pubsub: Redis | null = null;

    private readonly subscribers: Record<string, (message: string, channel: SocketEvents) => Promise<void>> = {
        [SocketEvents.NEW_MESSAGE]: redisMessageEventHandler,
    }

    constructor() {}

    private async initService() {
        this.client = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
        });
        this.pubsub = new Redis({
            host: REDIS_HOST,
            port: REDIS_PORT,
        });
        this.client.on('connect', () => {
            console.log('Redis connected');
        });
        this.client.on('error', (err) => {
            console.error('Redis error', err);
        });
    }



    // PubSub

    async publish(channel: string, message: string) {
        await this.client?.publish(channel, message);
        console.log(
            `Message published to channel: ${channel}`,
            "Message:",
            message
        );
    }

    private async setupSubscribers() {
        for (const [channel, handler] of Object.entries(this.subscribers)) {
            this.pubsub?.subscribe(channel);
            console.log(`Subscribed to channel: ${channel}`);
            this.pubsub?.on("message", (receivedChannel, message) => {
                if (receivedChannel === channel) {
                    console.log(
                        `Received message on channel: ${channel}`,
                        "Message:",
                        message
                    );
                    handler(message, channel as SocketEvents);
                }
            });
        }
    }




    // Cache
    async hasCache(key: string) {
        const value = await this.client?.exists(key);
        return value === 1;
    }

    async setCache(key: string, value: any, ttl: number = 240) {
        await this.client?.set(key, JSON.stringify(value), 'EX', ttl);
        console.log(`Cache set for key: ${key}`);
    }

    async getCache(key: string) {
        const value = await this.client?.get(key);
        console.log(`Cache get for key: ${key}`);
        return value ? JSON.parse(value) : null;
    }

    async delCache(key: string) {
        await this.client?.del(key);
        console.log(`Cache deleted for key: ${key}`);
    }

    async invalidateCache(keys: string[]) {
        const pipeline = this.client?.pipeline();
        keys.forEach((key) => pipeline?.del(key));
        await pipeline?.exec();
        console.log(`Cache invalidated for keys: ${keys}`);
    }

    async delCachePattern(pattern: string) {
        let cursor = '0';
        do {
            const result = await this.client?.scan(cursor, 'MATCH', pattern, 'COUNT', 100);
            if (!result) break;
            const [nextCursor, keys] = result;
            cursor = nextCursor;

            if (keys.length) {
                const pipeline = this.client?.pipeline();
                keys.forEach((key) => pipeline?.del(key));
                await pipeline?.exec();
                console.log(`Deleted keys: ${keys}`);
            }
        } while (cursor !== '0');
    }

    async flushCache() {
        await this.client?.flushall();
        console.log('Cache flushed');
    }


    public async init() {
        await this.initService();
        await this.setupSubscribers();
        console.log("Redis infrastructure initialized");
    }
}

export default RedisService;