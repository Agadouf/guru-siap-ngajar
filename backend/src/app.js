import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import routes from "./routes/index.js";

dotenv.config();

const app = express();

app.use(cors());

app.use("/uploads", express.static("src/uploads"));

/*
 * Vercel Blob client-upload requests must be parsed
 * as JSON before reaching handleUpload().
 *
 * The Blob endpoint has its own JSON parser in
 * expression.routes.js.
 */

app.use("/api/expressions", routes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

export default app;