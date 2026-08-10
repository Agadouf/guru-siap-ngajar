import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());

app.use("/uploads", express.static("src/uploads"));

// IMPORTANT:
// Do NOT globally parse JSON before the Blob upload route.
// The Blob route handles its own JSON body.
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

export default app;