import express from 'express';
import cors from 'cors';
import {logger} from './middlewares/logger.Middleware.js';
import authRoutes from './routes/auth.routes.js';
import eventsRoutes from './routes/events.routes.js';
import venuesRoutes from './routes/venues.routes.js';
import guestsRoutes from './routes/guests.routes.js';
import budgetRoutes from './routes/budget.routes.js';


const app = express();

// Enable CORS for frontend requests
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Attach pino-http to automatically log all requests using our BetterStack logger instance
app.use(logger);

// Register API Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/venues', venuesRoutes);
app.use('/api/guests', guestsRoutes);
app.use('/api/budget', budgetRoutes);


export default app;