import { Router } from "express";

import authMiddleware from "../../shared/middlewares/authHandler.js";
import { listTasksController, createTaskController, updateTaskController, deleteTaskController } from "./task.controller.js";

const router = Router();

router.use(authMiddleware);

router.get("/list", listTasksController);
router.post("/create", createTaskController);
router.patch("/update/:id", updateTaskController);
router.delete("/delete/:id", deleteTaskController);

export default router;