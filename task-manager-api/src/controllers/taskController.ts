import { Response } from 'express';
import prisma from '../config/database';
import { AuthRequest, TaskInput, TaskQuery } from '../types';
import getParam from '../utils/getParam';

export const getTasks = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { page = '1', limit = '10', status, search } = req.query as TaskQuery;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const skip = (pageNum - 1) * limitNum;

    // Build where clause
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Get tasks with pagination
    const [tasks, total] = await Promise.all([
      prisma.task.findMany({
        where,
        skip,
        take: limitNum,
        orderBy: { createdAt: 'desc' }
      }),
      prisma.task.count({ where })
    ]);

    res.status(200).json({
      tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

export const getTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
const id = getParam(req.params.id);

    const task = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    res.status(200).json({ task });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({ message: 'Error fetching task' });
  }
};

export const createTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
    const { title, description, status = 'pending' } = req.body as TaskInput;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        status,
        userId
      }
    });

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Error creating task' });
  }
};

export const updateTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
const id = getParam(req.params.id);
    const { title, description, status } = req.body as TaskInput;

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Update task
    const task = await prisma.task.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description }),
        ...(status && { status })
      }
    });

    res.status(200).json({
      message: 'Task updated successfully',
      task
    });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Error updating task' });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
const id = getParam(req.params.id);

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Delete task
    await prisma.task.delete({
      where: { id }
    });

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const toggleTaskStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.userId!;
const id = getParam(req.params.id);

    // Check if task exists and belongs to user
    const existingTask = await prisma.task.findFirst({
      where: { id, userId }
    });

    if (!existingTask) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Toggle status
    const newStatus = existingTask.status === 'completed' ? 'pending' : 'completed';

    const task = await prisma.task.update({
      where: { id },
      data: { status: newStatus }
    });

    res.status(200).json({
      message: 'Task status updated successfully',
      task
    });
  } catch (error) {
    console.error('Toggle task status error:', error);
    res.status(500).json({ message: 'Error toggling task status' });
  }
};