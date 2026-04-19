import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    // This connects the MongoDB Task to the PostgreSQL User.
    // We just store the integer ID of the Postgres user here.
    userId: {
      type: Number,
      required: [true, 'User ID is required to associate the task to a user'],
      index: true, // Speeds up queries when searching for all tasks of a user
    },
  },
  {
    timestamps: true,  
  }
);

const Task = mongoose.model('Task', taskSchema);

export default Task;
