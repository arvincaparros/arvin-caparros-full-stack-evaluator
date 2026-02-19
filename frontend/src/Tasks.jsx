import { useEffect, useState } from "react";
import api from "./api/axios";
import "./Tasks.css";

function Tasks({ user }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load Tasks (per user)
  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const res = await api.get(`/tasks/${user.id}`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Add Task
  const addTask = async () => {
    if (!newTask.trim() || !user) return;

    try {
      const res = await api.post("/tasks", {
        title: newTask,
        userId: user.id
      });

      setTasks(prev => [...prev, res.data]);
      setNewTask("");
    } catch (err) {
      console.error(err);
      setError("Failed to add task.");
    }
  };

  // Toggle Done
  const toggleTask = async (task) => {
    try {
      await api.put(`/tasks/${task.id}`, {
        title: task.title,
        isDone: !task.isDone,
        userId: user.id
      });

      setTasks(prev =>
        prev.map(t =>
          t.id === task.id ? { ...t, isDone: !t.isDone } : t
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}?userId=${user.id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  // Update Title
  const updateTask = async (id) => {
    if (!editValue.trim()) return;

    try {
      const current = tasks.find(t => t.id === id);

      await api.put(`/tasks/${id}`, {
        title: editValue,
        isDone: current?.isDone,
        userId: user.id
      });

      setTasks(prev =>
        prev.map(t =>
          t.id === id ? { ...t, title: editValue } : t
        )
      );

      setEditingId(null);
      setEditValue("");
    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="tasks-wrapper">
      <div className="tasks-card">
        <h2>Task Manager</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="tasks-input-group">
          <input
            type="text"
            placeholder="Enter task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={addTask}>Add</button>
        </div>

        {tasks.length === 0 ? (
          <p style={{ textAlign: "center", opacity: 0.6 }}>
            No tasks yet.
          </p>
        ) : (
          <ul className="tasks-list">
            {tasks.map((task) => (
              <li key={task.id} className="tasks-item">
                {editingId === task.id ? (
                  <div className="tasks-edit-mode">
                    <input
                      className="tasks-edit-input"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      autoFocus
                    />
                    <div className="tasks-actions">
                      <button
                        className="tasks-save"
                        onClick={() => updateTask(task.id)}
                      >
                        Save
                      </button>
                      <button
                        className="tasks-cancel"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <span
                      className="tasks-text"
                      onClick={() => toggleTask(task)}
                      style={{
                        textDecoration: task.isDone ? "line-through" : "none"
                      }}
                    >
                      {task.title}
                    </span>

                    <div className="tasks-actions">
                      <button
                        className="tasks-edit"
                        onClick={() => {
                          setEditingId(task.id);
                          setEditValue(task.title);
                        }}
                      >
                        Edit
                      </button>

                      <button
                        className="tasks-delete"
                        onClick={() => deleteTask(task.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Tasks;
