import { Request, Response } from "express";
import { get, omit } from "lodash";
import log from "../logger";
import { createAttendeeService } from "../service/chat.service";
import {
  createUser,
  findAllUser,
  findUser,
  updateUser,
} from "../service/user.service";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const emailExisted = await findUser({ email: req.body.email });
    if (emailExisted)
      return res.status(409).json({ msg: "Email already used" });
    const user = await createUser(req.body);
    const attendee = {
      _id: user["_id"],
      rooms: [],
    };
    await createAttendeeService(attendee);
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function updateAvatar(req: any, res: Response) {
  try {
    const userId = req.params.id;
    const { avatarUrl } = req.body;

    await updateUser(userId, { avatarUrl, isAvatar: !!avatarUrl });
    return res.status(200).json({
      msg: "Upload successful",
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getAllUser(req: Request, res: Response) {
  try {
    const userId = req.params.id;

    const users = await findAllUser(userId);
    return res
      .status(200)
      .json(users.map((user) => omit(user.toJSON(), "password")));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function getMe(req: any, res: Response) {
  try {
    const userId = get(req.user, "_id");
    const user = await findUser({ _id: userId });
    return res.status(200).json(omit(user, ["password"]));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
