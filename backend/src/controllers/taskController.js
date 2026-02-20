import {
    listTasks as listTasksService, createTask as createTaskService,
    findUser as findUserService, updateTask as updateTaskService, deleteTask as deleteTaskService
} from "../services/taskServices.js";

export async function listTasks(req, res) {
    const user_id = req.user.id;

    try {
        const listedTasks = await listTasksService(user_id);

        if (listedTasks.rowCount === 0) return res.status(200).json({ erro: "Doesnt exist tasks for this user" });

        return res.status(200).json(listedTasks.rows);

    } catch (e) {

        return res.status(500).json({ erro: "Internal error while listing tasks", detalhe: e.message, codigo: e.code, });

    }
}

export async function createTask(req, res) {
    const { title, description } = req.body;
    const user_id = req.user.id;

    if (!title || typeof title !== "string" || title.trim().length < 2) return res.status(400).json({ erro: "Title is required and must have at least 2 characters.", });

    try {
        const createdTask = await createTaskService(user_id, title, description);

        return res.status(201).json(createdTask.rows[0]);
    } catch (e) {

        return res.status(500).json({ erro: "Internal error while creating task", detalhe: e.message, codigo: e.code });

    }
}

export async function updateTask(req, res) {
    const id = Number(req.params.id);
    const user_id = req.user.id;
    const { title, description, completed } = req.body;

    if (!id) return res.status(400).json({ error: "Invalid id" });

    if (!title && (typeof title !== "string" || title.trim().length < 2)) return res.status(400).json({ error: "Title must be a string with at least 2 characters" });

    if (!completed && typeof completed !== "boolean") return res.status(400).json({ error: "completed must be boolean" });

    try {
        const searchedTask = await findUserService(id, user_id);

        if (searchedTask.rowCount === 0) return res.status(404).json({ error: "Task not found" });

        await updateTaskService(title, description, completed, id, user_id);

        return res.status(200).json({ message: `Task with id:${id} successfully updated!` });

    } catch (e) {

        return res.status(500).json({ erro: "Internal error while updating task", detalhe: e });
    }
}

export async function deleteTask(req, res) {
    const id = Number(req.params.id);
    const user_id = req.user.id;

    if (!id) return res.status(400).json({ error: "Invalid id" });

    try {
        const searchedTask = await findUserService(id, user_id);

        if (searchedTask.rowCount === 0) return res.status(404).json({ error: "Task not found" });

        const deleted = await deleteTaskService(id, user_id);

        if (deleted.rowCount === 0) return res.status(404).json({ error: "Internal error deleting task" });

        return res.status(200).json({ message: "Task successfully deleted!" });

    } catch (e) {
        return res.status(500).json({ erro: "Internal error while deleting task", detail: e });
    }
}