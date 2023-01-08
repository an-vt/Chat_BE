import config from "config";
import cors from "cors";
import express from "express";
import connect from "./db/connect";
import log from "./logger";
import { deserializeUser } from "./middleware";
import router from "./routes";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();
app.use("/api", deserializeUser);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connect();
});
