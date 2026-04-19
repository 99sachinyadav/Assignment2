import Joi from 'joi';

const createTaskSchema = Joi.object({
  title: Joi.string().required().messages({
    'any.required': 'Task title is required',
    'string.empty': 'Task title cannot be empty',
  }),
  description: Joi.string().optional().allow(''),
  dueDate: Joi.date().iso().required().messages({
    'any.required': 'Due date is required',
    'date.format': 'Due date must be a valid ISO date',
  }),
  status: Joi.string().valid('pending', 'completed').optional(),
});

const updateTaskSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional().allow(''),
  dueDate: Joi.date().iso().optional(),
  status: Joi.string().valid('pending', 'completed').optional(),
}).min(1).messages({
  'object.min': 'You must provide at least one field to update',
});

const validateCreateTask = (req, res, next) => {
  const { error } = createTaskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

const validateUpdateTask = (req, res, next) => {
  const { error } = updateTaskSchema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message);
    return res.status(400).json({ errors: errorMessages });
  }
  next();
};

export {
  validateCreateTask,
  validateUpdateTask,
};
