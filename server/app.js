import express from "express";
import cors from "cors";
import router from "./routes/authRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import helmet from "helmet";
import morgan from "morgan";
import compression from "compression";
import passport from "./config/passport.js";

const app = express();
app.use(passport.initialize());

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));




app.use(express.json());

app.use(helmet());
app.use(compression());

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

app.use("/api/auth", router);
app.use("/api/notes", noteRoutes);

app.use(errorHandler);

app.get("/health", (req, res) => { // Health Check API
    res.status(200).json({
        message: "Server is running"
    });
});

export default app; // Exporting the app