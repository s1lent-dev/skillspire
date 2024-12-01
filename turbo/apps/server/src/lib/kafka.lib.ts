import { Kafka, Producer, Consumer } from "kafkajs";
import { KAFKA_BROKER, KAFKA_CLIENT_ID, KAFKA_GROUP_ID1, KAFKA_GROUP_ID2, KAFKA_PARTITIONS1, KAFKA_PARTITIONS2, KAFKA_TOPIC1, KAFKA_TOPIC2 } from "../config/config.js";


class KafkaService {

    protected kafka!: Kafka;
    protected producer!: Producer;
    private consumer1!: Consumer;
    private consumer2!: Consumer;
    private topic1: string = KAFKA_TOPIC1;
    private topic2: string = KAFKA_TOPIC2;

    constructor() {}

    public async initService() {
        this.kafka = new Kafka({
            clientId: KAFKA_CLIENT_ID,
            brokers: [KAFKA_BROKER]
        });
        await this.initAdmin();
        this.producer = this.kafka.producer();
        await this.producer.connect().then(() => console.log("Kafka Producer connected"));

        this.consumer1 = await this.createConsumer(KAFKA_GROUP_ID1);
        this.consumer2 = await this.createConsumer(KAFKA_GROUP_ID2);

    }

    private async initAdmin() {
        const admin = this.kafka.admin();
        await admin.connect();
        await admin.createTopics({
            topics: [
                { topic: KAFKA_TOPIC1, numPartitions: KAFKA_PARTITIONS1 },
                { topic: KAFKA_TOPIC2, numPartitions: KAFKA_PARTITIONS2 }
            ]
        });
        await admin.disconnect();
    }

    protected async createConsumer(groupId: string): Promise<Consumer> {
        const consumer = this.kafka.consumer({ groupId });
        consumer.connect().then(() => console.log(`${groupId} consumer connected`));
        return consumer;
    }

}

export default KafkaService;