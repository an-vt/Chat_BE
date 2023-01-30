import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { addMemberToChatSocket, senderMessageSocket } from "./chatSocket";
import { addUserToSocket } from "./userSocket";

const configureSockets = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return {
    addUserSocket: addUserToSocket(io, socket),
    senderMessgeSocket: senderMessageSocket(io, socket),
    addMemberToChatSocket: addMemberToChatSocket(io, socket),
  };
};

const onConnection =
  (io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>) =>
  async (
    socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
  ) => {
    const { addUserSocket, senderMessgeSocket, addMemberToChatSocket } =
      configureSockets(io, socket);

    socket.on("add-user", addUserSocket);
    socket.on("send-msg", senderMessgeSocket);
    socket.on("add-member", addMemberToChatSocket);
  };

export { onConnection };
