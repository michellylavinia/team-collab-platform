import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: String,
  description: String,
  status: {
    type: String,
    default: "todo"
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model("Task", TaskSchema);
