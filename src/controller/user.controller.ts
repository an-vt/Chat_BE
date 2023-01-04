import { Request, Response } from "express";
import { omit } from "lodash";
import log from "../logger";
import { createUser, findUser, updateUser } from "../service/user.service";

export async function createUserHandler(req: Request, res: Response) {
  try {
    const emailExisted = await findUser({ email: req.body.email });
    if (emailExisted)
      return res.status(409).json({ msg: "Email already used" });
    const user = await createUser(req.body);
    return res.send(omit(user.toJSON(), "password"));
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}

export async function updateAvatar(req: any, res: Response) {
  try {
    const userId = req.params.id;
    console.log("🚀 ", req.file);
    const avatarUrl = req.file.originalname;

    await updateUser(userId, { avatarUrl, isAvatar: !!avatarUrl });
    return res.status(200).json({
      msg: "Upload successful",
    });
  } catch (e: any) {
    log.error(e);
    return res.status(409).send(e.message);
  }
}
