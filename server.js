const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(
  "mongodb+srv://teenpro59:95APBykPrJtaT6vD@personal.saxkeww.mongodb.net/taskdb"
);

const TaskSchema = new mongoose.Schema({ name: String });
const Task = mongoose.model("Task", TaskSchema);

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = new Task({ name: req.body.name });
  await task.save();
  res.json(task);
});

app.listen(3000, () => console.log("Server running on port 3000"));
