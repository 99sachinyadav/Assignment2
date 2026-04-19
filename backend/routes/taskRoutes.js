import express from 'express';
const router = express.Router();
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controller/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  validateCreateTask,
  validateUpdateTask,
} from '../validator/taskValidator.js';

// i have Applied protection middleware to all task routes.
// user  must be logged in to access any of these. as i was directed in the assignment
router.use(protect);


  router.get("/getTasks",getTasks)
  router.post("/createTask",validateCreateTask, createTask);

router.get('/getTasks/:id', getTaskById);
router.put('/updateTask/:id', validateUpdateTask, updateTask);
router.delete('/deleteTask/:id', deleteTask);

export default router;
