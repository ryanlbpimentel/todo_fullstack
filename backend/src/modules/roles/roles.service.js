import { listUsers as listUsersService, listUserById as listUserByIdService, deleteUser as deleteUserService } from "./roles.repository.js";
import { registerUserService } from "../user/user.service.js";

export async function listUsers() {
    const usersListed = await listUsersService();
    if (!usersListed) throw new Error("Unable to list users due to internal DB error");

    return usersListed;
}

export async function listUserById(id) {
    const userListed = await listUserByIdService(id);
    if (!userListed) throw new Error("Requested user does not exist");

    return userListed;
}

export async function createUser({name, email, password}) {
    const register = await registerUserService({name, email, password});

    return register;
}

export async function deleteUser(id, admin_id, perm_admin) {
    if (!id) throw new Error("Invalid id");

    const userSearched = await listUserByIdService(id);
    if (!userSearched) throw new Error("User not found");

    const { permission_level } = userSearched;
    
    if (admin_id === id) throw new Error("You cannot delete yourself");
    if ((Number(perm_admin) <= Number(permission_level))) throw new Error("You do not have permission to delete this user");

    const userDeleted = await deleteUserService(id);
    if (!userDeleted) throw new Error("Unable to delete user because it does not exist in the database");
    
    return id;
}