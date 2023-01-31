import { AttendeeDocument } from "model/attendee.model";
import { MessageModel } from "model/message.model";
import { RoomAdd } from "model/room.model";
import mongoose, { LeanDocument } from "mongoose";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { globalAny } from "../app";
import log from "../logger";
import {
  getAllRoomByUserService,
  getAllRoomIdByUserService,
} from "../service/chat.service";
import { findAllMemberService } from "../service/member.service";
import { getAllMessageService } from "../service/message.service";
import { findAllUser } from "../service/user.service";

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
        io.to(roomId).emit("msg-receive", data);
      } catch (error: any) {
        log.error(error.message);
      }
    }
  };
};

const listMemberUnAddSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function listMemberUnAddSocket(data: RoomAdd) {
    for (const memberId of data.memberIds) {
      const userIdSocket = globalAny.onlineUsers.get(memberId);
      if (userIdSocket) {
        try {
          const attendee = await getAllRoomIdByUserService({
            _id: memberId,
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
                        $ne: memberId,
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
                $ne: memberId,
              },
            });
            const users = await findAllUser({
              $and: filterUsers,
            });
            io.to(userIdSocket).emit("list-member-unadd-receive", users);
          } else {
            const userNotAuths = await findAllUser({ _id: { $ne: memberId } });
            io.to(userIdSocket).emit("list-member-unadd-receive", userNotAuths);
          }
        } catch (error: any) {
          log.error(error.message);
        }
      }
    }
  };
};

const listRoomSocket = (
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>,
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>
) => {
  return async function listRoomSocket(data: RoomAdd) {
    for (const memberId of data.memberIds) {
      const senderUserSocket = globalAny.onlineUsers.get(memberId);
      if (senderUserSocket) {
        try {
          const userIdObject = new mongoose.Types.ObjectId(memberId);
          const results: LeanDocument<AttendeeDocument> | null =
            await getAllRoomByUserService({
              _id: memberId,
            });
          if (results) {
            const promises = results.rooms.map((room) =>
              findAllMemberService({ roomId: room._id })
            );
            const response = await Promise.all(promises);
            const newData = results.rooms.map((item, index) => ({
              ...item,
              members: response[index].filter(
                (member) => !member.userId.equals(userIdObject)
              ),
            }));
            results.rooms = newData;
          }
          socket.to(senderUserSocket).emit("list-room-receive", results);
        } catch (e: any) {
          log.error(e);
        }
      }
    }
  };
};

export { senderMessageSocket, listMemberUnAddSocket, listRoomSocket };
