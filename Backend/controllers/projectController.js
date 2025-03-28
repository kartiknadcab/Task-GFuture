const upload = require("../middleware/upload");
const Project = require("../models/Project");

const getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ createdBy: req.user._id })
      .skip(skip)
      .limit(limit)
      .sort("-createdAt");

    const total = await Project.countDocuments({ createdBy: req.user._id });

    res.json({
      projects,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const getProject = async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.json(project);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

const createProject = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { title, description } = req.body;
      console.log(title, description, "title, description:::");

      if (!title || !description) {
        return res.status(400).json({ message: "Please enter all fields" });
      }

      const projectData = {
        title,
        description,
        createdBy: req.user._id,
      };

      if (req.file) {
        projectData.image = `/uploads/projects/${req.file.filename}`;
      }

      const project = await Project.create(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
};

const updateProject = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({ message: err });
    }

    try {
      const { title, description } = req.body;
      
      if (!title || !description) {
        return res.status(400).json({ message: "Please enter all fields" });
      }

      const updateData = { title, description };
      
      if (req.file) {
        updateData.image = `/uploads/projects/${req.file.filename}`;
      }

      const project = await Project.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id },
        updateData,
        { new: true }
      );

      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }

      res.json(project);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
    }
  });
};

const deleteProject = async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await Project.deleteMany({ project: req.params.id });

    res.json({ message: "Project removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
};
