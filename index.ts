import morgan from "morgan";
import express, { Express } from "express";
import cors from "cors";
import helmet from "helmet";
import * as bodyParser from "body-parser";
import { envConfig } from "./src/configs/env.config";
import exceptionFilter from "./src/middlewares/exception.filter";
import router from "./src/router/router";
import "./src/utils/response";

const app: Express = express();
const port = envConfig.PORT || 3000;

app.use(
  cors({
    origin: "*",
  })
);

app.use(helmet());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: false }));

app.use(morgan("dev"));
app.use("/api", router);
app.use(exceptionFilter);

app.listen(port, () => {
  console.info(`⚡️[server]: Server is running at http://localhost:${port}`);
});
