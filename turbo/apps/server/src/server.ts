// Imports
import { server } from './app.js';
import { connectPostgresDB } from './lib/prisma.lib.js';
import { connectMongoDB } from './lib/mongoose.lib.js';
import { PORT } from './config/config.js';


// Server Listener
const initServer = async () => {
    try {
        await connectPostgresDB();
        await connectMongoDB();
        server.listen(PORT, () => {
            console.log(`HTTP Server running on port http://localhost:${PORT}`);
            console.log(`GraphQL server running on http://localhost:${PORT}/graphql`);
        });
    } catch (err) {
        console.error(err);
    }
};

// Initialize Server
initServer();