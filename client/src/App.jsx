import React, { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    fetchTasks();

    socket.on("taskCreated", (task) => {
      setTasks(prev => [...prev, task]);
    });

    socket.on("taskDeleted", (id) => {
      setTasks(prev => prev.filter(t => t._id !== id));
    });

    socket.on("receiveNotification", (msg) => {
      alert(msg);
    });

  }, []);

  const fetchTasks = async () => {
    const res = await axios.get("http://localhost:5000/tasks");
    setTasks(res.data);
  };

  const addTask = async () => {
    await axios.post("http://localhost:5000/tasks", { title });
    setTitle("");
  };

  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
  };

  const sendNotif = () => {
    socket.emit("sendNotification", "Ada update baru!");
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Team Collaboration</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task..."
      />
      <button onClick={addTask}>Add</button>
      <button onClick={sendNotif}>Notif</button>

      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title}
            <button onClick={() => deleteTask(task._id)}>X</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
