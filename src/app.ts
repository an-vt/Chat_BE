import config from "config";
import cors from "cors";
import express from "express";
import { whiteList } from "./common/constants";
import connect from "./db/connect";
import log from "./logger";
import { deserializeUser } from "./middleware";
import router from "./routes";

const port = config.get("port") as number;
const host = config.get("host") as string;

const app = express();

app.use(
  cors({
    // origin: (origin: string | undefined, callback) => {
    //   if (origin && whiteList.indexOf(origin) !== -1) {
    //     callback(null, true);
    //   } else {
    //     callback(new Error());
    //   }
    // },
    origin: "*",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  })
);
app.use("/api", deserializeUser);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(router);

app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connect();
});
