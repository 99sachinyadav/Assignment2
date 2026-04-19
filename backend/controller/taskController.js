import Task from '../models/Task.js';

 
const getTasks = async (req, res) => {
  try {
    // Only fetch tasks associated with the loggedin user
    const tasks = await Task.find({ userId: req.userId });
    res.json(tasks);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};
 
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    // Ensure the user owns this task
    if (task.userId !== req.userId) {
      res.status(403);
      throw new Error('User not authorized to access this task');
    }

    res.json(task);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

 
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    if(!title || !dueDate || !description){
      res.status(400);
      throw new Error('Please provide all required fields');
    }

    const task = new Task({
      title,
      description,
      dueDate,
      status: status || 'pending',
      userId: req.userId,
    });

    const createdTask = await task.save();
    res.status(201).json(createdTask);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

 
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

 
    if (task.userId !== req.userId) {
      res.status(403);
      throw new Error('User not authorized to modify this task');
    }

    // Partial update logic so all the fields are optional
    const { title, description, dueDate, status } = req.body;

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (dueDate !== undefined) task.dueDate = dueDate;
    if (status !== undefined) task.status = status;

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

 
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      res.status(404);
      throw new Error('Task not found');
    }

    
    if (task.userId !== req.userId) {
      res.status(403);
      throw new Error('User not authorized to delete this task');
    }

    await task.deleteOne();
    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({ message: error.message });
  }
};

export {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
