import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../Common/Card";
import Button from "../Common/Button";
import Loader from "../Common/Loader";

const SubjectManager = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem("token");
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${baseUrl}/api/subjects`, { headers });
      setSubjects(res.data.subjects || []);
      setError("");
    } catch (err) {
      console.error("Error fetching subjects:", err);
      setError("Failed to load subjects.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    try {
      setAdding(true);
      const res = await axios.post(
        `${baseUrl}/api/subjects`,
        { name: newSubject },
        { headers }
      );
      setSubjects([...subjects, res.data.subject]);
      setNewSubject("");
      setError("");
    } catch (err) {
      console.error("Error adding subject:", err);
      setError(err.response?.data?.message || "Failed to add subject.");
    } finally {
      setAdding(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      await axios.delete(`${baseUrl}/api/subjects/${id}`, { headers });
      setSubjects(subjects.filter((sub) => sub._id !== id));
    } catch (err) {
      console.error("Error deleting subject:", err);
      setError("Failed to delete subject.");
    }
  };

  if (loading) return <Loader />;

  return (
    <Card className="mb-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: "var(--text-primary)" }}>
        Subject Manager
      </h2>

      {/* Add Subject Form */}
      <form onSubmit={handleAddSubject} className="flex flex-col sm:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Enter subject name (e.g., Physics, Math)"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border bg-transparent focus:outline-none focus:ring-2"
          style={{
            borderColor: "var(--border-color)",
            color: "var(--text-primary)",
            backgroundColor: "var(--bg-secondary)",
          }}
        />
        <Button type="submit" variant="primary" disabled={adding || !newSubject.trim()}>
          {adding ? "Adding..." : "Add Subject"}
        </Button>
      </form>

      {error && (
        <div className="mb-4 text-sm font-medium text-red-500">
          {error}
        </div>
      )}

      {/* Subject List */}
      <div className="space-y-3">
        {subjects.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No subjects added yet.</p>
        ) : (
          subjects.map((subject) => (
            <div
              key={subject._id}
              className="flex justify-between items-center p-4 rounded-lg border"
              style={{
                borderColor: "var(--border-color)",
                backgroundColor: "var(--bg-secondary)",
              }}
            >
              <span className="font-medium" style={{ color: "var(--text-primary)" }}>
                {subject.name}
              </span>
              <Button
                variant="danger" // Assuming danger variant exists or falls back to default/secondary
                onClick={() => handleDeleteSubject(subject._id)}
                className="text-sm px-3 py-1"
                style={{ backgroundColor: "rgba(239, 68, 68, 0.2)", color: "#ef4444" }} // Inline style for danger if variant missing
              >
                Delete
              </Button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
};

export default SubjectManager;
