import { globalAny } from "../app";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

const addUserToSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function addUserSocket(userId: string) {
    console.log("user connected");

    const socketId = socket.id;
    globalAny.onlineUsers.set(userId, socketId);
  };
};

export { addUserToSocket };
