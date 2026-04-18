const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Todo = require("./Todo");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// GET TODOS
app.get("/api/tasks", async (req, res) => {
  const tasks = await Todo.find();
  res.json(tasks);
});

// ADD TASK
app.post("/api/tasks", async (req, res) => {
  const newTask = new Todo({
    text: req.body.text,
  });

  await newTask.save();
  res.json(newTask);
});

// DELETE TASK
app.delete("/api/tasks/:id", async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// TOGGLE COMPLETE
app.put("/api/tasks/:id", async (req, res) => {
  const task = await Todo.findById(req.params.id);

  task.completed = !task.completed;

  await task.save();

  res.json(task);
});

// EDIT TASK
app.patch("/api/tasks/:id", async (req, res) => {
  const updatedTask = await Todo.findByIdAndUpdate(
    req.params.id,
    { text: req.body.text },
    { new: true },
  );

  res.json(updatedTask);
});

// CLEAR COMPLETED
app.delete("/api/tasks", async (req, res) => {
  await Todo.deleteMany({ completed: true });
  res.json({ message: "Completed tasks deleted" });
});

app.listen(process.env.PORT, () => {
  console.log("Server Running on http://localhost:5000");
});
