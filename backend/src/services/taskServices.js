import pool from "../db.js";

export async function listTasks(user_id) {
    const result = await pool.query("SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC, id DESC", [user_id]);
    return result;
}

export async function findUser(id,user_id) {
    const result = await pool.query("SELECT * FROM tasks WHERE id = $1 AND user_id = $2", [id,user_id]);
    return result;
}

export async function createTask(user_id, title, description) {
    const result = await pool.query("INSERT INTO tasks (user_id, title, description) VALUES ($1,$2,$3) RETURNING id, title, description, completed, created_at, updated_at", [user_id, title.trim(), description ?? null]);
    return result;
}

export async function updateTask(title, description, completed, id, user_id) {
    const result = await pool.query("UPDATE tasks SET title = COALESCE($1, title), description = COALESCE($2, description), completed = COALESCE($3, completed) WHERE id = $4 AND user_id = $5", [title !== undefined ? title.trim() : null, description !== undefined ? description : null, completed !== undefined ? completed : null, id, user_id]);
    return result;
}

export async function deleteTask(id, user_id) {
    const result = await pool.query("DELETE FROM tasks WHERE id = $1 AND user_id = $2", [id,user_id]);
    return result;
}