import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "https://guru-siap-ngajar-front.vercel.app",
      "https://guru-siap-ngajar-front-lof0mp8qk-abdalrahim.vercel.app",
      /^https:\/\/guru-siap-ngajar-front-.*-abdalrahim\.vercel\.app$/,
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("src/uploads"));

app.use("/api", routes);

export default app;