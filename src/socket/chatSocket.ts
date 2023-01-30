import { MessageModel } from "model/message.model";
import { getAllRoomIdByUserService } from "../service/chat.service";
import { findAllMemberService } from "../service/member.service";
import { findAllUser } from "../service/user.service";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { globalAny } from "../app";
import log from "../logger";
import { getAllMessageService } from "../service/message.service";

const senderMessageSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function senderMessageSocket(data: MessageModel) {
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
  };
};

const addMemberToChatSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function addMemberToChatSocket(userAuthId: string) {
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
  };
};

export { senderMessageSocket, addMemberToChatSocket };
