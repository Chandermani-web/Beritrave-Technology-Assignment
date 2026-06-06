const Task = require('../models/Task');
const asyncHandler = require('../utils/asyncHandler');

const allowedStatuses = ['Pending', 'In Progress', 'Completed'];

const normalizeStatus = (status) => {
  if (!status) {
    return 'Pending';
  }

  const value = String(status).trim();
  return allowedStatuses.includes(value) ? value : null;
};

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const normalizedStatus = normalizeStatus(status);

  if (status && !normalizedStatus) {
    res.status(400);
    throw new Error('Invalid task status');
  }

  const task = await Task.create({
    title: String(title).trim(),
    description: description ? String(description).trim() : '',
    status: normalizedStatus || 'Pending',
    userId: req.user._id,
  });

  res.status(201).json(task);
});

const getTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json(task);
});

const updateTask = asyncHandler(async (req, res) => {
  const { title, description, status } = req.body;
  const normalizedStatus = normalizeStatus(status);

  if (status && !normalizedStatus) {
    res.status(400);
    throw new Error('Invalid task status');
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    {
      ...(title !== undefined ? { title: String(title).trim() } : {}),
      ...(description !== undefined ? { description: String(description).trim() } : {}),
      ...(status !== undefined ? { status: normalizedStatus || 'Pending' } : {}),
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json(task);
});

const updateTaskStatus = asyncHandler(async (req, res) => {
  const normalizedStatus = normalizeStatus(req.body.status);

  if (!normalizedStatus) {
    res.status(400);
    throw new Error('Invalid task status');
  }

  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { status: normalizedStatus },
    { new: true, runValidators: true }
  );

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json(task);
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user._id });

  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  res.json({ message: 'Task deleted successfully' });
});

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
};