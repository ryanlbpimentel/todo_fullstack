import { Router } from "express";

import authMiddleware from "../middlewares/auth.js";
import { listTasks, createTask, updateTask, deleteTask } from "../controllers/taskController.js";

const router = Router();

router.use(authMiddleware);

router.get("/list", listTasks);
router.post("/create", createTask);
router.patch("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);

export default router;