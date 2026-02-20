import pool from "../db.js";

export async function listUsers(){
    const result = await pool.query("SELECT id,name,email,created_at,updated_at,permission_level FROM users");
    return result;
}

export async function listUserById(id){
    const result = await pool.query("SELECT id,name,email,created_at,updated_at,permission_level FROM users WHERE id = $1",[id]);
    return result;
}

export async function deleteUser(id){
    const result = await pool.query("DELETE FROM users WHERE id = $1",[id]);
    return result;
}