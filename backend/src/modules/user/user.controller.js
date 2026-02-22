import { registerUserService, loginUserService } from "./user.service.js";

export async function registerUserController(req, res, next) {
    try {
        const registeredUser = await registerUserService(req.body);

        res.status(201).json({ message: `User ${registeredUser.name} successfully registered` });
    } catch (e) {
        next(e);
    }
}

export async function loginUserController(req, res, next) {
    try {
        const token = await loginUserService(req.body);

        res.status(200).json({ token });
    } catch (e) {
        next(e);
    }
}