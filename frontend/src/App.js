import React, { useEffect, useState } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [editTask, setEditTask] = useState(null);

  const API_URL = "http://localhost:8000/api/tasks/";

  const fetchTasks = () =>
    fetch(API_URL)
      .then((r) => r.json())
      .then(setTasks)
      .catch(console.error);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const method = editTask ? "PUT" : "POST";
    const url = editTask ? `${API_URL}${editTask.id}/` : API_URL;
    const body = JSON.stringify({ title, completed: editTask ? editTask.completed : false });

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });

    setTitle("");
    setEditTask(null);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setTitle(task.title);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}${id}/`, { method: "DELETE" });
    fetchTasks();
  };

  const handleToggle = async (task) => {
    await fetch(`${API_URL}${task.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...task, completed: !task.completed }),
    });
    fetchTasks();
  };

  return (
    <div style={{ padding: 20, maxWidth: 400, margin: "auto" }}>
      <h1>Task List</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task title"
          style={{ width: "70%", padding: "5px" }}
        />
        <button type="submit" style={{ marginLeft: 10 }}>
          {editTask ? "Update" : "Add"}
        </button>
      </form>

      <ul style={{ marginTop: 20 }}>
        {tasks.map((task) => (
          <li key={task.id} style={{ marginBottom: 10 }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => handleToggle(task)}
              style={{ marginRight: 8 }}
            />
            <span style={{ textDecoration: task.completed ? "line-through" : "none" }}>
              {task.title}
            </span>
            <button onClick={() => handleEdit(task)} style={{ marginLeft: 10 }}>
              Edit
            </button>
            <button onClick={() => handleDelete(task.id)} style={{ marginLeft: 5 }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
