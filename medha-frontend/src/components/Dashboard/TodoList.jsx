import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Common/Card";
import Button from "../Common/Button";
import { FaTrash, FaCheck, FaPlus, FaRobot } from "react-icons/fa6";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/todos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(response.data.todos || []);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setGenerating(true);
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const aiRes = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/chatbot/ask`,
        { input: "Generate a daily study plan for me as a computer science student." },
        { headers }
      );

      let plan = [];
      try {
        const content = aiRes.data.answer;
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            plan = JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.error("Error parsing AI plan:", e);
      }

      if (Array.isArray(plan)) {
        for (const item of plan) {
            if (item.task) {
                const todoRes = await axios.post(
                    `${import.meta.env.VITE_BACKEND_URL}/api/todos`,
                    { task: item.task },
                    { headers }
                );
                setTodos(prev => [...prev, todoRes.data.todo]);
            }
        }
      }
    } catch (error) {
      console.error("Error generating plan:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos`,
        { task: newTask },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos([...todos, response.data.todo]);
      setNewTask("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const handleToggleTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTodos(todos.map(t => t._id === id ? { ...t, isCompleted: !t.isCompleted } : t));
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/todos/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(todos.filter(t => t._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
        Daily Plan
      </h2>
      
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {loading ? (
          <p className="text-center opacity-60">Loading...</p>
        ) : todos.length === 0 ? (
          <p className="text-center opacity-60">No tasks for today. Add one!</p>
        ) : (
          todos.map((todo) => (
            <div
              key={todo._id}
              className="flex items-center justify-between p-3 rounded-lg border transition-all"
              style={{
                borderColor: "var(--accent-secondary)",
                backgroundColor: todo.isCompleted ? "var(--color-success-bg)" : "transparent",
                opacity: todo.isCompleted ? 0.7 : 1,
              }}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <button
                  onClick={() => handleToggleTodo(todo._id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                    todo.isCompleted ? "bg-[var(--color-success-text)] border-[var(--color-success-text)]" : "border-[var(--text-tertiary)]"
                  }`}
                >
                  {todo.isCompleted && <FaCheck className="text-[var(--bg-primary)] text-xs" />}
                </button>
                <span
                  className={`truncate ${todo.isCompleted ? "line-through opacity-60" : ""}`}
                  style={{ color: "var(--text-primary)" }}
                >
                  {todo.task}
                </span>
              </div>
              <button
                onClick={() => handleDeleteTodo(todo._id)}
                className="text-[var(--color-danger-text)] opacity-70 hover:opacity-100 transition-colors"
              >
                <FaTrash size={14} />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2 mt-auto">
        <form onSubmit={handleAddTodo} className="flex-1 flex gap-2">
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 rounded-lg border-2 focus:outline-none focus:ring-2"
            style={{
              backgroundColor: "var(--bg-primary)",
              borderColor: "var(--accent-secondary)",
              color: "var(--text-primary)",
            }}
          />
          <Button type="submit" variant="primary" className="!px-3">
            <FaPlus />
          </Button>
        </form>
      </div>
    </Card>
  );
};

export default TodoList;
