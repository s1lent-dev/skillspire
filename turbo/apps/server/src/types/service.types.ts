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

// Mail Service
enum MailType {
    WELCOME_EMAIL,
    RESET_PASSWORD,
    VERIFY_EMAIL,
}
interface MailContent {
    email: string;
    contentType: MailType;
    content: string;
}


// Generic type for RabbitMQ content
type RabbitMQContent = MailContent;


export { ExchangeTypes, QueueTypes, MailType, MailContent, RabbitMQContent };