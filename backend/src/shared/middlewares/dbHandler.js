import pool from "../../db.js";

async function dbCheck(req, res, next) {
    try {
        await pool.query("SELECT 1");
        next();
    } catch (e) {
        console.log("API is up but DB failed", e);
        res.status(500).json({ error: 'API is up but DB failed' });
    }
}

export default dbCheck