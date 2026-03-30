import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import Task from "./models/Task.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/team-platform")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// ROUTES
app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.json(tasks);
});

app.post("/tasks", async (req, res) => {
  const task = new Task(req.body);
  await task.save();

  io.emit("taskCreated", task);
  res.json(task);
});

app.delete("/tasks/:id", async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);

  io.emit("taskDeleted", req.params.id);
  res.json({ success: true });
});

// SOCKET
io.on("connection", (socket) => {
  console.log("User connected");

  socket.on("sendNotification", (msg) => {
    io.emit("receiveNotification", msg);
  });
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});
