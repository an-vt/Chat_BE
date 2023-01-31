import { JoinRoomSocket } from "model/room.socket.model";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { globalAny } from "../app";

const joinRoomSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function joinRoomSocket({ roomId, userId }: JoinRoomSocket) {
    socket.join(roomId);
  };
};

const connectedUserSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function connectedUserSocket(userId: string) {
    const socketId = socket.id;
    globalAny.onlineUsers.set(userId, socketId);
  };
};

export { joinRoomSocket, connectedUserSocket };
