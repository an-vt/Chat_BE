import config from "config";
import cors from "cors";
import express from "express";
import { getAllMessageService } from "./service/message.service";
import { Server } from "socket.io";
// import {
//   ClientToServerEvents,
//   InterServerEvents,
//   ServerToClientEvents,
//   SocketData,
// } from "types/socket-io";
import connect from "./db/connect";
import log from "./logger";
import { deserializeUser } from "./middleware";
import router from "./routes";
import { MessageModel } from "model/message.model";

const globalAny: any = global;
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

const server = app.listen(port, host, () => {
  log.info(`Server listing at http://${host}:${port}`);

  connect();
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

enum Events {
  CONNECTION = "connection",
  TEST = "test",
}

globalAny.onlineUsers = new Map();
io.on("connection", (socket) => {
  globalAny.chatSocket = socket;

  socket.on("add-user", (userId: any) => {
    console.log("🚀 ~ file: app.ts:65 ~ socket.on ~ userId", userId);
    globalAny.onlineUsers.set(userId, socket.id);
  });
  socket.on("send-msg", async (data: MessageModel) => {
    const { roomId, senderUId } = data;
    const sendUserSocket = globalAny.onlineUsers.get(senderUId);
    console.log(
      "🚀 ~ file: app.ts:70 ~ socket.on ~ sendUserSocket",
      sendUserSocket
    );
    if (sendUserSocket) {
      try {
        const data = await getAllMessageService(roomId);
        socket.emit("msg-receive", data);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  });
});
