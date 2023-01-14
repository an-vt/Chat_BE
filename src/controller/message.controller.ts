import { Response } from "express";
import log from "../logger";
import { MessageDocument } from "../model/message.model";
import { createMessageService } from "../service/message.service";

export async function addMessageController(req: any, res: Response) {
  try {
    await createMessageService(req.body as MessageDocument);
    return res.status(200).json({ msg: "Add message successfully" });
  } catch (e: any) {
    log.error(e);
    return res.status(400).send(e.message);
  }
}
