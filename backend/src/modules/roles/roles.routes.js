import { Router } from "express";

import { listUsersController, listUserByIdController, createUserController, deleteUserController } from "./roles.controller.js";
import authMiddleware from "../../shared/middlewares/authHandler.js";
import accessMiddleware from "../../shared/middlewares/accessHandler.js";

const router = Router();

router.use(authMiddleware);
router.use(accessMiddleware(2));

router.get("/list", listUsersController);
router.get("/list/:id", listUserByIdController);
router.post("/create", createUserController);
router.delete("/delete/:id", deleteUserController);

export default router;