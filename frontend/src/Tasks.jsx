import { useEffect, useState } from "react";
import api from "./api/axios";
import "./Tasks.css";
import logoutIcon from "./assets/switch.png";

function Tasks({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================
  // Fetch Tasks
  // =========================
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
    fetchTasks();
  }, [user]);

  // =========================
  // Add Task
  // =========================
  const addTask = async () => {
    if (!newTask.trim()) return;

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

  // =========================
  // Unified Update (Edit / Done)
  // =========================
  const updateTask = async (taskId, updatedFields) => {
    try {
      const current = tasks.find(t => t.id === taskId);

      const res = await api.put(`/tasks/${taskId}`, {
        title: updatedFields.title ?? current.title,
        isDone: updatedFields.isDone ?? current.isDone,
        userId: user.id
      });

      setTasks(prev =>
        prev.map(t => (t.id === taskId ? res.data : t))
      );

    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  // Toggle Done
  const toggleTask = (task) => {
    updateTask(task.id, { isDone: !task.isDone });
  };

  // Save Edited Title
  const saveEdit = () => {
    if (!editValue.trim()) return;

    updateTask(editingId, { title: editValue });

    setEditingId(null);
    setEditValue("");
  };

  // =========================
  // Delete Task
  // =========================
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}?userId=${user.id}`);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;

  return (
    <div className="tasks-wrapper">
      <div className="tasks-card">

        <button className="logout-btn" onClick={onLogout}>
          <img src={logoutIcon} alt="Logout" className="logout-icon" />
        </button>

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
              <li
                key={task.id}
                className={`tasks-item ${task.isDone ? "completed" : ""}`}
              >
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
                        onClick={saveEdit}
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
                      style={{
                        textDecoration: task.isDone ? "line-through" : "none",
                        opacity: task.isDone ? 0.6 : 1
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
                        className="tasks-done"
                        onClick={() => toggleTask(task)}
                      >
                        {task.isDone ? "Undo" : "Done"}
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
