import express from "express";
import { updateChat } from "../../controller/chat.controller";
import { validateRequest } from "../../middleware";
import { createChatSchema } from "../../schema/chat.schema";
const chatRouter = express.Router();

chatRouter.post("/add", validateRequest(createChatSchema), updateChat);
chatRouter.post("/add/member", validateRequest(createChatSchema), updateChat);

export { chatRouter };
