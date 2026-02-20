import {listUsers as listUsersService, listUserById as listUserByIdService, deleteUser as deleteUserService} from "../services/adminServices.js";
import {verifyEmail, registerUser} from "../services/authServices.js";

import bcrypt from "bcrypt";

export async function listUsers(req, res) {
    try {
        const usersListed = await listUsersService();

        if (usersListed.rowCount === 0) return res.status(200).json({ message: "No users found" });

        return res.status(200).json(usersListed.rows);

    } catch (e) {

        return res.status(500).json({ error: "Error fetching users", detail: e.message, code: e.code });

    }
}

export async function listUserById(req, res) {
    const id = Number(req.params.id);

    try {
        const userListed = await listUserByIdService(id);

        if (userListed.rowCount === 0) return res.status(200).json({ message: "Requested user does not exist" });

        return res.status(200).json(userListed.rows);

    } catch (e) {

        return res.status(500).json({ error: "Error fetching user", detail: e.message, code: e.code });

    }
}

export async function createUser(req, res) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ error: "Name, email or password invalid" });

    try {
        const password_hash = await bcrypt.hash(password, 10);  

        const verify = await verifyEmail(email);

        if(verify.rows.length > 0){
            return res.status(409).json({ error: "This email is already registered" });
        }

        const register = await registerUser(name,email,password_hash);

        if (register.rowCount === 0) {
            return res.status(201).json({ error: "Unable to create user due to internal DB error" });
        }
        
        res.status(201).json({ message: "User successfully registered" });
    } catch (e) {
        res.status(500).json({ error: "Internal server error while registering user", detail: e });
    }
}

export async function deleteUser(req, res) {
    const id = Number(req.params.id);
    const admin_id = req.user.id;
    const perm_admin  = req.user.permission_level;
    
    if (!id ) return res.status(400).json({ error: "Invalid id" });
    
    try {
        const userSearched = await listUserByIdService(id);
        
        if (userSearched.rowCount === 0) return res.status(200).json({ message: "The user to be deleted does not exist" });

        const { permission_level } = userSearched.rows[0];

        if ((Number(perm_admin) <= Number(permission_level)) || Number(admin_id) === id) return res.status(200).json({ message: "You can only delete users with lower permission than yours and cannot delete yourself" });

        const userDeleted = await deleteUserService(id);
        console.log("teste")
        if (userDeleted.rowCount === 0) {
            return res.status(201).json({ error: "Unable to delete user because it does not exist in the database" });
        }
        
        res.status(201).json({ message: "User successfully deleted" });
    } catch (e) {
        res.status(500).json({ erro: "Internal server error while deleting user", detalhe: e });
    }
}