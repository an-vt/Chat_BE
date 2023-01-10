import { Response } from "express";
import { pick } from "lodash";
import log from "../logger";
import { MemberDocument } from "../model/member.model";
import { RoomDocument, TYPE_ROOM } from "../model/room.model";
import { UserDocument } from "../model/user.model";
import { update } from "../service/chat.service";
import { findUser } from "../service/user.service";

export async function updateChat(req: any, res: Response) {
  try {
    const userAuthId: UserDocument["_id"] = req?.user["_id"];

    const type: TYPE_ROOM = req.body.type;
    const memberIds: string[] = req.body.memberIds;
    for (const id of memberIds) {
      const promises = memberIds.map((id) =>
        findUser({
          _id: id,
        })
      );
      const datas = await Promise.all(promises);

      const members: (Partial<MemberDocument> | undefined)[] = datas.map(
        (user) => {
          if (user) {
            const isAdmin = user["_id"].equals(userAuthId);

            return {
              ...pick(user, ["_id", "name"]),
              role: type === "SELF" ? "ADMIN" : isAdmin ? "ADMIN" : "MEMBER",
            };
          }
        }
      );
      const room: RoomDocument = {
        members: members as MemberDocument[],
        unreadCount: 0,
        type,
      };

      const attendee: any = {
        _id: id,
        rooms: [room],
      };

      await update(attendee);
    }

    return res.status(200).json({ msg: "Add chat successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}
