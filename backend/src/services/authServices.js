import pool from "../db.js";

export async function verifyEmail(email) {
    const result = await pool.query("SELECT id,email,password_hash,permission_level FROM users WHERE email = $1", [email]);
    return result;
}

export async function registerUser(name, email, password_hash) {
    const result = await pool.query("INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3)", [name, email, password_hash]);
    return result;
}