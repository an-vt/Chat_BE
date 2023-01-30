import config from "config";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";
import { getAllMessageService } from "./service/message.service";
// import {
//   ClientToServerEvents,
//   InterServerEvents,
//   ServerToClientEvents,
//   SocketData,
// } from "types/socket-io";
import { MessageModel } from "model/message.model";
import { getAllRoomIdByUserService } from "service/chat.service";
import { findAllMemberService } from "service/member.service";
import { findAllUser } from "service/user.service";
import connect from "./db/connect";
import log from "./logger";
import { deserializeUser } from "./middleware";
import router from "./routes";

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
    const socketId = socket.id;
    globalAny.onlineUsers.set(userId, socketId);
  });
  socket.on("add-member", async (userAuthId: string) => {
    try {
      const attendee = await getAllRoomIdByUserService({
        _id: userAuthId,
      });

      if (attendee && attendee?.rooms?.length > 0) {
        const filters: any[] =
          attendee?.rooms
            .filter((room) => room.type === "SELF")
            .map((room) => ({
              $and: [
                { roomId: room._id },
                {
                  userId: {
                    $ne: userAuthId,
                  },
                },
              ],
            })) ?? [];
        const member = await findAllMemberService({
          $or: filters,
        });
        const filterUsers =
          member.map((member) => ({
            _id: {
              $ne: member.userId,
            },
          })) ?? [];

        // filter remove user auth
        filterUsers.push({
          _id: {
            $ne: userAuthId,
          },
        });
        const users = await findAllUser({
          $and: filterUsers,
        });
        io.sockets.emit("list-member", users);
      } else {
        const userNotAuths = await findAllUser({ _id: { $ne: userAuthId } });
        io.sockets.emit("list-member", userNotAuths);
      }
    } catch (error: any) {
      log.error(error.message);
    }
  });
  socket.on("send-msg", async (data: MessageModel) => {
    const { roomId, senderUId } = data;
    const sendUserSocket = globalAny.onlineUsers.get(senderUId);
    if (sendUserSocket) {
      try {
        const data = await getAllMessageService(roomId);
        io.sockets.emit("msg-receive", data);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  });
});
