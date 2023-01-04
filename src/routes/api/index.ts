import express from "express";
import { userRouter } from "./user.route";
const apiRouter = express.Router();

apiRouter.use("/user", userRouter);

export default apiRouter;
