import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import compression from 'compression';
const app = express()
import helmet from 'helmet';
import authRoutes from './routes/authRoutes.js';
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import siteRoutes from './routes/siteRoutes.js';
import helperRouter from './routes/helperRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';


app.use(cors({
        origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
        credentials: true
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "20kb" }));
app.use(express.static("public"))
app.use(cookieParser())
app.use(helmet());
app.use(compression());

// Auth routes
app.use('/api/auth', authRoutes);
// Sites
app.use('/api/sites', siteRoutes);
// Categories
app.use('/api/categories', categoryRoutes);
// AI
app.use('/api/ai', aiRoutes);
app.use("/api/upload-helper", helperRouter);
// Default health-check route
app.get('/', (req, res) => {
        res.status(200).json({ success: true, message: 'Server is working' });
});
// Attach global error handler
app.use(globalErrorHandler);

export { app }