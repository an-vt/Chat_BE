import express from "express";
import { getMe, updateAvatar } from "../../controller/user.controller";
import upload from "../../utils/upload";
const userRouter = express.Router();

userRouter.put("/:id/avatar", updateAvatar);
userRouter.get("/me", getMe);

export { userRouter };
