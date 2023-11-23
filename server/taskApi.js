// tasksController.js
const express = require('express');
const Task = require('./models/task');

const tasksController = express.Router();

// all 
tasksController.get('/', async (req, res) => {
  try {
    const tasks = await Task.findAll();
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching all tasks:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//finding task by id
tasksController.get('/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findByPk(taskId);

    if (!task) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    res.json(task);
  } catch (error) {
    console.error("Error fetching task by ID:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Create 
tasksController.post('/', async (req, res) => {
  const { title, description, completed } = req.body;
  try {
    const task = await Task.create({ title, description, completed });
    res.json(task);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

// Update
tasksController.put('/:id', async (req, res) => {
  const taskId = req.params.id;
  const { title, description, completed } = req.body;
  const task = await Task.findByPk(taskId);
  if (task) {
    task.title = title;
    task.description = description;
    task.completed = completed;
    await task.save();
    res.json(task);
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

// Delete 
tasksController.delete('/:id', async (req, res) => {
  const taskId = req.params.id;
  const task = await Task.findByPk(taskId);
  if (task) {
    await task.destroy();
    res.json({ id: taskId });
  } else {
    res.status(404).json({ error: 'Task not found' });
  }
});

module.exports = tasksController;
