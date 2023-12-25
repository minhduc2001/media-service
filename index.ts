import morgan from "morgan";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import * as bodyParser from "body-parser";
import { envConfig } from "./src/configs/env.config";
import exceptionFilter from "./src/middlewares/exception.filter";
import router from "./src/router/router";
import "./src/utils/response";
import connectDB from "./src/configs/database.config";
const app: Express = express();
const port = envConfig.PORT || 3000;

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(helmet());
app.use(bodyParser.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: false }));

await connectDB();
app.use(morgan("dev"));
app.use("/api", router);
app.use(exceptionFilter);

app.listen(port, () => {
  console.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
