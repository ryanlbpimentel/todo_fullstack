import pool from "../../db.js";

export async function verifyEmail(email) {
    const result = await pool.query("SELECT id,email,password_hash,permission_level FROM users WHERE email = $1", [email]);
    return result.rows[0];
}

export async function registerUser(name, email, password_hash) {
    const result = await pool.query("INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id,name", [name, email, password_hash]);
    return result.rows[0];
}