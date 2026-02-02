import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, TaskInput, TaskQuery } from '../types';
import getParam from '../utils/getParam';
import { success, fail } from '../utils/api-response';


export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { page = '1', limit = '10', status, search } = req.query as TaskQuery;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || isNaN(limitNum)) {
      return fail(res, 'Invalid pagination parameters', 400);
    }

    const skip = (pageNum - 1) * limitNum;

    const where: any = { userId };
    if (status) where.status = status;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);

    return success(res, {
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    return fail(res, 'Error fetching tasks', 500);
  }
};


export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req.params.id);

    const task = await prisma.task.findFirst({ where: { id, userId } });

    if (!task) return fail(res, 'Task not found', 404);

    return success(res, task);
  } catch {
    return fail(res, 'Invalid task ID', 400);
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description, status = 'pending' } = req.body as TaskInput;

    const task = await prisma.task.create({
      data: { title, description, status, userId }
    });

    return success(res, task, 201);
  } catch {
    return fail(res, 'Error creating task', 500);
  }
};


export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req.params.id);

    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) return fail(res, 'Task not found', 404);

    const task = await prisma.task.update({
      where: { id },
      data: req.body
    });

    return success(res, task);
  } catch {
    return fail(res, 'Invalid task ID', 400);
  }
};


export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req.params.id);

    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) return fail(res, 'Task not found', 404);

    await prisma.task.delete({ where: { id } });

    return success(res, { message: 'Task deleted successfully' });
  } catch {
    return fail(res, 'Invalid task ID', 400);
  }
};


export const toggleTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const id = getParam(req.params.id);

    const existingTask = await prisma.task.findFirst({ where: { id, userId } });
    if (!existingTask) return fail(res, 'Task not found', 404);

    const newStatus =
      existingTask.status === 'completed' ? 'pending' : 'completed';

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus }
    });

    return success(res, task);
  } catch {
    return fail(res, 'Invalid task ID', 400);
  }
};
