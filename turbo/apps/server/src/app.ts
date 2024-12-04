// Imports
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bodyParser from "body-parser";
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import { intializeGoogleOAuth } from './middlewares/verify.google.js';
import { intializeGithubOAuth } from './middlewares/verify.github.js';
import { expressMiddleware } from "@apollo/server/express4";
import { graphqlServer } from "./graphql/graphql.js";
import SocketService from './lib/socket.lib.js';
import RedisService from './lib/redis.lib.js';
import KafkaService from './lib/kafka.lib.js';
import RabbitMQService from './lib/rabbitmq.lib.js';
import { verifySocket } from './middlewares/verifySocket.middleware.js';
import { ErrorMiddleware } from './middlewares/error.middleware.js';
import authRouter from './routes/auth.routes.js';
import { FRONTEND_URL, OAUTH_SESSION_SECRET } from './config/config.js';


// Services 
const initServices = async () => {
    try {
        const kafkaService = new KafkaService();
        const redisService = new RedisService();
        const rabbitMQService = new RabbitMQService();
        await kafkaService.init();
        await redisService.init();
        await rabbitMQService.init();
        return { redisService, kafkaService, rabbitMQService };
    } catch (err) {
        console.error(err);
    }
}
const services = await initServices();
if (!services) {
    throw new Error('Failed to initialize services');
}
const { redisService, kafkaService, rabbitMQService } = services;

// Server 
const app = express();
const server = createServer(app);

// Socket
const socketService = new SocketService(server);
const io = socketService.getIO();

// Middlewares
app.use(cors({
    origin: [FRONTEND_URL],
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

// GraphQL
await graphqlServer.start();
app.use('/graphql', bodyParser.json(), expressMiddleware(graphqlServer) as any);


// OAuth Middlewares
intializeGoogleOAuth();
intializeGithubOAuth();
app.use(session({
    secret: OAUTH_SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());


// Routes

app.use('/auth', authRouter);


app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
});
app.get('*', (req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: 'Resource not found',
    });
});

// Socket Middlewares
io.use((socket: any, next: any) => {
    cookieParser()(
        socket.request,
        socket.request.res,
        async (err) => await verifySocket(err, socket, next)
    );
})

// Error Middleware
app.use(ErrorMiddleware as any);

// Export
export { server, socketService, redisService, kafkaService, rabbitMQService };    