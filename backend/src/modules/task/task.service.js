import { listTasks, createTask, findUser, updateTask, deleteTask } from "./task.repository.js";

export async function listTasksService(user_id) {
    if (!user_id) throw new Error("User id is required to list tasks");

    const listedTasks = await listTasks(user_id);
    if (!listedTasks) throw new Error("Unable to list tasks due to internal DB error");

    if (listedTasks.length === 0) throw new Error("No tasks found for this user");

    return listedTasks;
}

export async function createTaskService({ title, description }, user_id) {
    if (!title || typeof title !== "string" || title.trim().length < 2) throw new Error("Title is required and must have at least 2 characters.");

    const createdTask = await createTask(user_id, title, description);
    if (!createdTask) throw new Error("Unable to create task due to internal DB error");

    return createdTask;
}

export async function updateTaskService(id, { title, description, completed }, user_id) {
    if (!id) throw new Error("Task id is required to update task");
    if (!title && (typeof title !== "string" || title.trim().length < 2)) throw new Error("Title must have at least 2 characters");
    if (!completed && typeof completed !== "boolean") throw new Error("Completed must be a boolean");

    const searchedTask = await findUser(id, user_id);
    if (!searchedTask) throw new Error("Task not found");

    const updated = await updateTask(title, description, completed, id, user_id);
    if (!updated) throw new Error("Unable to update task due to internal DB error");

    return { id, updated };
}

export async function deleteTaskService(id, user_id) {
    if (!id) throw new Error("Invalid id");

    const searchedTask = await findUser(id, user_id);
    if (!searchedTask) throw new Error("Task not found");

    const deleted = await deleteTask(id, user_id);
    if (!deleted) throw new Error("Unable to delete task due to internal DB error");

    return { id, deleted };
}