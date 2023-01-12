import { Response } from "express";
import mongoose, { LeanDocument } from "mongoose";
import log from "../logger";
import { MemberDocument } from "../model/member.model";
import { RoomDocument, TYPE_ROOM } from "../model/room.model";
import { UserDocument } from "../model/user.model";
import { update } from "../service/chat.service";
import { addMember } from "../service/member.service";
import { findUser } from "../service/user.service";

export async function updateChat(req: any, res: Response) {
  try {
    const userAuth: UserDocument = req?.user;

    const type: TYPE_ROOM = req.body.type;
    const memberIds: string[] = req.body.memberIds;
    const roomId = mongoose.Types.ObjectId();
    for (const id of memberIds) {
      const room: Partial<RoomDocument> = {
        _id: roomId,
        unreadCount: 0,
        type,
      };

      const attendee: any = {
        _id: id,
        rooms: [room],
      };

      // update attendee
      await update(attendee);

      // create member
      const userAuthId = new mongoose.Types.ObjectId(userAuth["_id"]);
      const isAdmin = userAuthId.equals(id);
      const user: LeanDocument<UserDocument> | null = await findUser({
        _id: id,
      });
      if (user) {
        const member: Partial<MemberDocument> = {
          role: type === "SELF" ? "ADMIN" : isAdmin ? "ADMIN" : "MEMBER",
          roomId: roomId,
          user: user as UserDocument,
        };

        await addMember(member as MemberDocument);
      }
    }

    return res.status(200).json({ msg: "Add chat successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}
