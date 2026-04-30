import Task from "../models/Task.model.js";

export const createTask = async (req, res, next) => {
  try {
    const { title, description, project, assignedTo, priority, dueDate } = req.body;
    
    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      priority,
      dueDate,
      createdBy: req.user._id
    });
    
    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
      
    res.status(201).json(populatedTask);
  } catch (error) {
    next(error);
  }
};

export const getTasksByProject = async (req, res, next) => {
  try {
    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');
    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      const { title, description, assignedTo, status, priority, dueDate } = req.body;
      
      task.title = title || task.title;
      task.description = description || task.description;
      task.assignedTo = assignedTo || task.assignedTo;
      task.status = status || task.status;
      task.priority = priority || task.priority;
      task.dueDate = dueDate || task.dueDate;
      
      const updatedTask = await task.save();
      const populatedTask = await Task.findById(updatedTask._id)
        .populate('assignedTo', 'name email')
        .populate('createdBy', 'name email');
      res.json(populatedTask);
    } else {
      res.status(404);
      throw new Error("Task not found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (task) {
      if (task.createdBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Not authorized to delete task");
      }
      await task.deleteOne();
      res.json({ message: "Task removed" });
    } else {
      res.status(404);
      throw new Error("Task not found");
    }
  } catch (error) {
    next(error);
  }
};

export const getDashboardStats = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }]
    }).populate('project', 'title');

    const stats = {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      done: tasks.filter(t => t.status === 'done').length,
      overdue: tasks.filter(t => t.status === 'overdue' || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done')).length,
      dueToday: tasks.filter(t => {
        if (!t.dueDate) return false;
        const today = new Date();
        const due = new Date(t.dueDate);
        return due.toDateString() === today.toDateString();
      }).length,
      overdueTasks: tasks.filter(t => t.status === 'overdue' || (t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done')),
      inProgressTasks: tasks.filter(t => t.status === 'in-progress'),
      dueTodayTasks: tasks.filter(t => {
        if (!t.dueDate) return false;
        const today = new Date();
        const due = new Date(t.dueDate);
        return due.toDateString() === today.toDateString();
      })
    };
    
    res.json(stats);
  } catch (error) {
    next(error);
  }
};
