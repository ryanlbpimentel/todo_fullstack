import { listUsers as listUsersService, listUserById as listUserByIdService, createUser as CreateUserService, deleteUser as deleteUserService } from "./roles.service.js";

export async function listUsersController(req, res, next) {
    try {
        const usersListed = await listUsersService();

        res.status(200).json(usersListed);
    } catch (e) {
        next(e);
    }
}

export async function listUserByIdController(req, res, next) {
    const id = Number(req.params.id);

    try {
        const userListed = await listUserByIdService(id);

        res.status(200).json(userListed);

    } catch (e) {
        next(e);
    }
}

export async function createUserController(req, res, next) {

    try {
        const registeredUser = await CreateUserService(req.body);

        res.status(201).json({ message: `User ${registeredUser.name} successfully registered` });
    } catch (e) {
        next(e);
    }
}

export async function deleteUserController(req, res, next) {

    try {
        const userDeleted = await deleteUserService(Number(req.params.id), Number(req.user.id), req.user.permission_level);

        res.status(201).json({ message: `User ${userDeleted} successfully deleted` });
    } catch (e) {
        next(e);
    }
}