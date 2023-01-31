import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import {
  senderMessageSocket,
  listRoomSocket,
  listMemberUnAddSocket,
} from "./chatSocket";
import { joinRoomSocket, connectedUserSocket } from "./userSocket";

const configureSockets = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return {
    connectedUserSocket: connectedUserSocket(io, socket),
    joinRoomSocket: joinRoomSocket(io, socket),
    senderMessgeSocket: senderMessageSocket(io, socket),
    listMemberUnAddSocket: listMemberUnAddSocket(io, socket),
    listRoomSocket: listRoomSocket(io, socket),
  };
};

const onConnection =
  (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) =>
  async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    const {
      connectedUserSocket,
      joinRoomSocket,
      senderMessgeSocket,
      listMemberUnAddSocket,
      listRoomSocket,
    } = configureSockets(io, socket);

    socket.on("connected-user", connectedUserSocket);
    socket.on("join-room", joinRoomSocket);
    socket.on("msg-send", senderMessgeSocket);
    socket.on("list-member-unadd-send", listMemberUnAddSocket);
    socket.on("list-room-send", listRoomSocket);
  };

export { onConnection };
