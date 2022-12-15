import { Express, Request, Response } from "express";
import { login, refreshTokenAuthen } from "./controller/auth.controller";
import {
  createPostHandler,
  deletePostHandler,
  getPostHandler,
  updatePostHandler,
} from "./controller/post.controller";
import { createUserHandler } from "./controller/user.controller";
import { validateRequest } from "./middleware";
import {
  createPostSchema,
  deletePostSchema,
  updatePostSchema,
} from "./schema/post.schema";
import {
  createUserSchema,
  createUserSessionSchema,
} from "./schema/user.schema";

export default function (app: Express) {
  app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));

  // Register user
  app.post(
    "/oauth/register",
    validateRequest(createUserSchema),
    createUserHandler
  );

  // Login
  app.post("/oauth/token", validateRequest(createUserSessionSchema), login);

  // refresh token
  app.get("/oauth/token/refresh", refreshTokenAuthen);

  // Create a post
  app.post("/api/posts", validateRequest(createPostSchema), createPostHandler);

  // Update a post
  app.put(
    "/api/posts/:postId",
    validateRequest(updatePostSchema),
    updatePostHandler
  );

  // Get a post
  app.get("/api/posts/:postId", getPostHandler);

  // Delete a post
  app.delete(
    "/api/posts/:postId",
    validateRequest(deletePostSchema),
    deletePostHandler
  );
}
