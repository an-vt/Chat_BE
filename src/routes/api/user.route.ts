import express from "express";
import { updateAvatar } from "../../controller/user.controller";
import upload from "../../utils/upload";
const userRouter = express.Router();

userRouter.post("/:id/avatar", upload.single("avatarUrl"), updateAvatar);

export { userRouter };
