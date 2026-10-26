import React, { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Common/Card";
import Button from "../components/Common/Button";
import Loader from "../components/Common/Loader";

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects`,
        { name: newSubject },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewSubject("");
      fetchSubjects();
    } catch (error) {
      console.error("Error adding subject:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSubject = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/subjects/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen w-full p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-8" style={{ color: "var(--text-primary)" }}>
          Subjects
        </h1>

        {/* Add Subject Form */}
        <Card className="mb-8">
          <h2 className="text-2xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
            Add New Subject
          </h2>
          <form onSubmit={handleAddSubject} className="flex gap-4">
            <input
              type="text"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              placeholder="Subject name..."
              className="flex-1 px-5 py-3 rounded-xl border-2 font-medium focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--bg-primary)",
                borderColor: "var(--accent-secondary)",
                color: "var(--text-primary)",
              }}
            />
            <Button type="submit" loading={submitting} disabled={submitting || !newSubject.trim()}>
              Add Subject
            </Button>
          </form>
        </Card>

        {/* Subjects List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.length === 0 ? (
            <Card className="col-span-full text-center py-12">
              <p className="text-xl font-semibold" style={{ color: "var(--text-secondary)" }}>
                No subjects yet. Add your first subject to get started!
              </p>
            </Card>
          ) : (
            subjects.map((subject) => (
              <Card key={subject._id}>
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {subject.name}
                  </h3>
                  <Button
                    variant="danger"
                    size="small"
                    onClick={() => handleDeleteSubject(subject._id)}
                  >
                    Delete
                  </Button>
                </div>
                {subject.noteCount !== undefined && (
                  <p className="mt-2 text-sm" style={{ color: "var(--text-secondary)" }}>
                    {subject.noteCount} notes
                  </p>
                )}
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Subjects;
