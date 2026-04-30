import Project from "../models/Project.model.js";
import User from "../models/User.model.js";

export const createProject = async (req, res, next) => {
  try {
    const { title, description } = req.body;
    const project = await Project.create({
      title,
      description,
      owner: req.user._id,
      members: [req.user._id]
    });
    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

export const getAllProjects = async (req, res, next) => {
  try {
    const projects = await Project.find({
      $or: [{ owner: req.user._id }, { members: req.user._id }]
    }).populate('members', 'name email').populate('owner', 'name email');
    res.json(projects);
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('members', 'name email')
      .populate('owner', 'name email');
    
    if (project) {
      res.json(project);
    } else {
      res.status(404);
      throw new Error("Project not found");
    }
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const { title, description, status } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (project) {
      if (project.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(403);
        throw new Error("Not authorized to update project");
      }
      
      project.title = title || project.title;
      project.description = description || project.description;
      project.status = status || project.status;
      
      const updatedProject = await project.save();
      res.json(updatedProject);
    } else {
      res.status(404);
      throw new Error("Project not found");
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);
    if (project) {
      await project.deleteOne();
      res.json({ message: "Project removed" });
    } else {
      res.status(404);
      throw new Error("Project not found");
    }
  } catch (error) {
    next(error);
  }
};

export const addMember = async (req, res, next) => {
  try {
    const { emails } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    const users = await User.find({ email: { $in: emails } });
    if (!users || users.length === 0) {
      res.status(404);
      throw new Error("No users found");
    }

    let added = false;
    for (const user of users) {
      if (!project.members.includes(user._id)) {
        project.members.push(user._id);
        added = true;
      }
    }

    if (added) {
      await project.save();
    }
    
    const updatedProject = await Project.findById(project._id)
      .populate('members', 'name email')
      .populate('owner', 'name email');
      
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};

export const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      res.status(404);
      throw new Error("Project not found");
    }

    if (project.owner.toString() === userId) {
      res.status(400);
      throw new Error("Cannot remove the project owner");
    }

    project.members = project.members.filter(mId => mId.toString() !== userId);
    await project.save();
    
    const updatedProject = await Project.findById(project._id)
      .populate('members', 'name email')
      .populate('owner', 'name email');
      
    res.json(updatedProject);
  } catch (error) {
    next(error);
  }
};
