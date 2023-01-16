import { Response } from "express";
import mongoose, { LeanDocument } from "mongoose";
import log from "../logger";
import { AttendeeDocument } from "../model/attendee.model";
import { MemberDocument } from "../model/member.model";
import { RoomDocument, TYPE_ROOM } from "../model/room.model";
import { UserDocument } from "../model/user.model";
import {
  getAllRoomByUserService,
  updateAttendeeService,
} from "../service/chat.service";
import { addMemberService } from "../service/member.service";
import { findUser } from "../service/user.service";

const addAttendee = async (
  roomId: mongoose.Types.ObjectId,
  type: TYPE_ROOM,
  attendeeId: mongoose.Types.ObjectId,
  nameRoom?: string
) => {
  let room: Partial<RoomDocument> = {
    _id: roomId,
    name: nameRoom,
    unreadCount: 0,
    type,
  };

  if (type === "GROUP") {
    room = {
      _id: roomId,
      unreadCount: 0,
      type,
    };
  }

  const attendee: any = {
    _id: attendeeId,
    rooms: [room],
  };

  // update attendee
  await updateAttendeeService(attendee);
};

const addMember = async (
  roomId: mongoose.Types.ObjectId,
  type: TYPE_ROOM,
  userAuthId: mongoose.Types.ObjectId,
  idMember: string
) => {
  const isAdmin = userAuthId.equals(idMember);
  const user: LeanDocument<UserDocument> | null = await findUser({
    _id: idMember,
  });
  if (user) {
    const member: Partial<MemberDocument> = {
      role: type === "SELF" ? "ADMIN" : isAdmin ? "ADMIN" : "MEMBER",
      roomId: roomId,
      user: user as UserDocument,
    };

    await addMemberService(member as MemberDocument);
  }
};

export async function addChatController(req: any, res: Response) {
  const NEXT_INDEX_RECEIVER = 1;
  try {
    const userAuth: UserDocument = req?.user;

    const type: TYPE_ROOM = req.body.type;
    const memberIds: string[] = req.body.memberIds;
    const groupName: string = req.body.groupName;
    const roomId = mongoose.Types.ObjectId();
    const userAuthId = new mongoose.Types.ObjectId(userAuth["_id"]);
    for (const id of memberIds) {
      let nameGroup = groupName;
      if (type === "SELF") {
        const indexReceiver =
          (memberIds.indexOf(id) + NEXT_INDEX_RECEIVER) % memberIds.length;
        const idReceiver = memberIds[indexReceiver];
        const user: LeanDocument<UserDocument> | null = await findUser({
          _id: idReceiver,
        });
        if (user) nameGroup = user?.name;
      }
      const userId = mongoose.Types.ObjectId(id);
      // add attendee
      await addAttendee(roomId, type, userId, nameGroup);

      // add member
      await addMember(roomId, type, userAuthId, id);
    }

    return res.status(200).json({ msg: "Add chat successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}

export async function addMemberController(req: any, res: Response) {
  try {
    const userAuth: UserDocument = req?.user;

    const roomId: string = req.body.roomId;
    const memberId = req.body.memberId;
    const roomIdObject = mongoose.Types.ObjectId(roomId);
    const type: TYPE_ROOM = "GROUP";
    const userAuthId = new mongoose.Types.ObjectId(userAuth["_id"]);
    // add attendee
    await addAttendee(roomIdObject, type, memberId);

    // add member
    await addMember(roomIdObject, type, userAuthId, memberId);

    return res.status(200).json({ msg: "Add member successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}

export async function getRoomByUserController(req: any, res: Response) {
  try {
    const { userId } = req.params;
    const data: LeanDocument<AttendeeDocument> | null =
      await getAllRoomByUserService({
        _id: userId,
      });
    return res.send(data);
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}