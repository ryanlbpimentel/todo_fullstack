import { Router } from "express";

import { listUsers, listUserById, createUser, deleteUser } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/auth.js";
import accessMiddleware from "../middlewares/access.js";

const router = Router();

router.use(authMiddleware);
router.use(accessMiddleware(2));

router.get("/list", listUsers);
router.get("/list/:id", listUserById);
router.post("/create", createUser);
router.delete("/delete/:id", deleteUser);

export default router;