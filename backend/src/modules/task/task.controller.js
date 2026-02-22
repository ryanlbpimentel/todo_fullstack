import { listTasksService, createTaskService, updateTaskService, deleteTaskService } from "./task.service.js";

export async function listTasksController(req, res, next) {
    try {
        const listedTasks = await listTasksService(req.user.id);

        res.status(200).json(listedTasks);
    } catch (e) {
        next(e);
    }
}

export async function createTaskController(req, res, next) {
    try {
        const createdTask = await createTaskService(req.body, req.user.id);

        res.status(201).json(createdTask);
    } catch (e) {
        next(e);
    }
}

export async function updateTaskController(req, res, next) {
    try {
        const { updated } = await updateTaskService(req.params.id, req.body, req.user.id);

        res.status(200).json({ message: `Task with id:${updated.id} successfully updated!` });
    } catch (e) {
        next(e);
    }
}

export async function deleteTaskController(req, res, next) {
    try {
        const { deleted } = await deleteTaskService(req.params.id, req.user.id);

        res.status(200).json({ message: `Task with id:${deleted.id} successfully deleted!` });
    } catch (e) {
        next(e);
    }
}