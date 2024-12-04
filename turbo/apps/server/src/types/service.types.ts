//* NodeMailer
// Enums for Mail Types
enum MailType {
    WELCOME_EMAIL,
    RESET_PASSWORD,
    VERIFY_EMAIL,
}

// Interface for Mail Content
interface MailContent {
    email: string;
    contentType: MailType;
    content: string;
}


//* RabbitMQ
// Enums for RabbitMQ Exchanges and Queues
enum ExchangeTypes {
    EMAIL_EXCHANGE = "email-exchange",
    LOCATION_EXCHANGE = "location-exchange",
    NOTIFICATION_EXCHANGE = "notification-exchange",
    FEED_EXCHANGE = "feed-exchange",
}
enum QueueTypes {
    RESET_PASSWORD = "reset-password",
    WELCOME_EMAIL = "welcome-email",
    VERIFY_EMAIL = "verify-email",
}
// Generic type for RabbitMQ content
type RabbitMQContent = MailContent;


//* Kafka 
// Enums for Kafka Topics
enum KafkaTopics {
    CHAT_TOPIC = "chat-topic",
    LOCATION_TOPIC = "location-topic",
}
enum KafkaGroups {
    CHAT_GROUP = "chat-group",
    LOCATION_GROUP = "location-group",
}



//* Redis
// Enums for Redis Keys
enum RedisKeys {
    GET_CONNECTIONS = "get-connections",
    GET_CHATS = "get-chats",
}




//* Socket 
// Enums for Socket Events
enum SocketEvents {
    CONNECTION = "connection",
    DISCONNECT = "disconnect",
    JOIN_ROOM = "join-room",
    LEAVE_ROOM = "leave-room",
    ONLINE_STATUS = "online-status",
    NEW_MESSAGE = "new-message",
    MESSAGE_READ = "message-read",
    TYPING = "typing",
    NEW_CHAT = "new-chat",
    NEW_GROUP = "new-group",
    GROUP_JOINED = "group-joined",
    GROUP_LEFT = "group-left",
    GROUP_REMOVED = "group-removed",
    MAKE_ADMIN = "make-admin",
    REMOVE_ADMIN = "remove-admin",
    NEW_CONNECTION = "new-connection",
    NEW_NOTIFICATION = "new-notification",
    NEW_FEED = "new-feed",
    NEW_POST = "new-post",
    NEW_COMMENT = "new-comment",
    NEW_LIKE = "new-like",
    NEW_SHARE = "new-share",
    NEW_FOLLOW = "new-follow",
    REFETCH_FEED = "refetch-feed",
    REFETCH_NOTIFICATION = "refetch-notification",
    REFETCH_CONNECTIONS = "refetch-connections",
    REFETCH_CHATS = "refetch-chats",
}

enum ChatType {
    PRIVATE = "PRIVATE",
    GROUP = "GROUP",
}

enum ContentType {
    TEXT = "TEXT",
    IMAGE = "IMAGE",
    VIDEO = "VIDEO",
    FILE = "FILE",
    LOCATION = "LOCATION",
    CONTACT = "CONTACT",
    STICKER = "STICKER",
    EMOJI = "EMOJI",
    GIF = "GIF",
    GROUP = "GROUP",
}

interface MessageEvent {
    chatId: string;
    chatType: ChatType;
    senderId: string;
    username: string;
    memberIds: string[];
    content: string;
    contentType: ContentType;
    status: string;
    createdAt: Date | null;
}

type SocketEvent = MessageEvent;



export { MailType, MailContent, ExchangeTypes, QueueTypes, RabbitMQContent, RedisKeys, SocketEvents, MessageEvent, ChatType, ContentType, SocketEvent };