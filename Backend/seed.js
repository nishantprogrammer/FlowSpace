import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.model.js";
import Project from "./models/Project.model.js";
import Task from "./models/Task.model.js";

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flowspace');
    
    await User.deleteMany();
    await Project.deleteMany();
    await Task.deleteMany();

    const admin = await User.create({
      name: "Admin User",
      email: "admin@flowspace.dev",
      password: "Demo1234!",
      role: "admin"
    });

    const member1 = await User.create({
      name: "Member One",
      email: "member@flowspace.dev",
      password: "Demo1234!",
      role: "member"
    });

    const member2 = await User.create({
      name: "Member Two",
      email: "member2@flowspace.dev",
      password: "Demo1234!",
      role: "member"
    });

    const project1 = await Project.create({
      title: "Flowspace Launch",
      description: "Getting the new team task manager ready for Ethara AI.",
      owner: admin._id,
      members: [admin._id, member1._id, member2._id]
    });

    const project2 = await Project.create({
      title: "Design System",
      description: "Implementing the Whipsaw-inspired dark theme.",
      owner: member1._id,
      members: [admin._id, member1._id]
    });

    await Task.insertMany([
      { title: "Define CSS Variables", description: "Set up the dark theme vars.", project: project1._id, assignedTo: member1._id, createdBy: admin._id, status: "done", priority: "high" },
      { title: "Build Kanban Board", description: "Implement drag and drop.", project: project1._id, assignedTo: member2._id, createdBy: admin._id, status: "in-progress", priority: "high" },
      { title: "Review Typography", description: "Check DM Serif Display.", project: project1._id, assignedTo: admin._id, createdBy: member1._id, status: "todo", priority: "medium" },
      { title: "Fix Overdue Hook", description: "Mongoose pre-save hook for overdue tasks.", project: project1._id, assignedTo: member1._id, createdBy: admin._id, status: "overdue", priority: "high", dueDate: new Date(Date.now() - 86400000) },
    ]);

    console.log("Database seeded successfully.");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDB();
