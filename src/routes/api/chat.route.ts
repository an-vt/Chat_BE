import express from "express";
import {
  addChatController,
  addMemberController,
  getRoomByUserController,
} from "../../controller/chat.controller";
import { validateRequest } from "../../middleware";
import {
  addMemberSchema,
  createChatSchema,
  getRoomByUserSchema,
} from "../../schema/chat.schema";
const chatRouter = express.Router();

chatRouter.post("/add", validateRequest(createChatSchema), addChatController);
chatRouter.post(
  "/room/add",
  validateRequest(addMemberSchema),
  addMemberController
);
chatRouter.get(
  "/room/user/:userId",
  validateRequest(getRoomByUserSchema),
  getRoomByUserController
);

export { chatRouter };
