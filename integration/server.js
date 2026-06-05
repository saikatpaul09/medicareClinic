import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import cookieParser from "cookie-parser";

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// middle wares
// body parser middleware
app.use(express.json());

//cors midleware
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["POST", "GET", "PUT", "DELETE"],
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
//middleware for error handling
app.use(errorHandler);
//Routes
app.use("/api", userRoutes);
//Error handling

app.listen(port, () => console.log(`server running on port ${port}`));
