import { Router } from 'express';
import { body } from 'express-validator';
import {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
  toggleTaskStatus
} from '../controllers/taskController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Get all tasks (with pagination, filtering, searching)
router.get('/', getTasks);

// Get single task
router.get('/:id', getTask);
// Create task
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').optional(),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
  ],
  validate,
  createTask
);


// Update task
router.patch(
  '/:id',
  [
    body('title').optional().notEmpty().withMessage('Title cannot be empty'),
    body('description').optional(),
    body('status')
      .optional()
      .isIn(['pending', 'in-progress', 'completed'])
      .withMessage('Invalid status'),
    validate
  ],
  updateTask
);

// Delete task
router.delete('/:id', deleteTask);

// Toggle task status
router.post('/:id/toggle', toggleTaskStatus);

export default router;