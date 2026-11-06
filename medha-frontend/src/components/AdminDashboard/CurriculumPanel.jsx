import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaBookOpen,
  FaPlus,
  FaTrash,
  FaPen,
  FaArrowLeft,
  FaLink,
  FaYoutube,
  FaFileLines,
  FaSpinner,
} from "react-icons/fa6";
import api from "../../api/api";

const RESOURCE_KINDS = [
  { value: "youtube", label: "YouTube" },
  { value: "gfg", label: "GeeksforGeeks" },
  { value: "link", label: "Link" },
  { value: "pdf", label: "PDF URL" },
  { value: "note", label: "Note ID" },
];

const YEAR_OPTIONS = [
  { value: 1, label: "Year I" },
  { value: 2, label: "Year II" },
  { value: 3, label: "Year III" },
  { value: 4, label: "Year IV" },
];

const BRANCH_OPTIONS = [
  "COMMON",
  "CSE",
  "IT",
  "ECE",
  "EE",
  "ME",
  "CE",
  "AI",
  "AIDS",
  "CSBS",
];

function yearFromSemesterNumber(n) {
  return Math.min(4, Math.max(1, Math.ceil(Number(n) / 2)));
}

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

export default function CurriculumPanel({ admin }) {
  const { activeTab, isFullAdmin } = admin;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [subjectDetail, setSubjectDetail] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [selectedTopicId, setSelectedTopicId] = useState(null);

  const [semesterForm, setSemesterForm] = useState({ number: "", label: "", year: "1" });
  const [subjectForm, setSubjectForm] = useState({
    name: "",
    code: "",
    short: "",
    scheme: "rtu",
    branch: "CSE",
  });
  const [unitForm, setUnitForm] = useState({ title: "", unitNumber: "" });
  const [topicForm, setTopicForm] = useState({ title: "" });
  const [resourceForm, setResourceForm] = useState({
    kind: "youtube",
    title: "",
    url: "",
    noteId: "",
    description: "",
  });
  const [editSubject, setEditSubject] = useState(null);
  const [editUnit, setEditUnit] = useState(null);
  const [editTopic, setEditTopic] = useState(null);

  const loadTree = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [semRes, subRes] = await Promise.all([
        api.get("/curriculum/semesters"),
        api.get("/curriculum/subjects", { params: { active: "all" } }),
      ]);
      setSemesters(semRes.data.semesters || []);
      setSubjects(subRes.data.subjects || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load curriculum";
      const hint =
        err.response?.status === 404
          ? " Curriculum API is missing on this backend — use the local API (restart Vite after .env.development) or deploy the new routes."
          : "";
      setError(`${msg}${hint}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === "curriculum") loadTree();
  }, [activeTab, loadTree]);

  const yearSemesters = useMemo(() => {
    if (!selectedYear) return [];
    return semesters.filter(
      (s) => (s.year || yearFromSemesterNumber(s.number)) === selectedYear
    );
  }, [semesters, selectedYear]);

  const semesterBranches = useMemo(() => {
    if (!selectedSemester) return [];
    const fromSubjects = subjects
      .filter((s) => s.semester === selectedSemester.number)
      .map((s) => String(s.branch || "CSE").toUpperCase());
    const fromMeta = Object.keys(selectedSemester.branches || {}).map((b) =>
      String(b).toUpperCase()
    );
    return [...new Set([...BRANCH_OPTIONS, ...fromSubjects, ...fromMeta])];
  }, [subjects, selectedSemester]);

  const branchSubjects = useMemo(() => {
    if (!selectedSemester || !selectedBranch) return [];
    return subjects.filter(
      (s) =>
        s.semester === selectedSemester.number &&
        String(s.branch || "CSE").toUpperCase() === selectedBranch
    );
  }, [subjects, selectedSemester, selectedBranch]);

  const yearStats = useMemo(() => {
    return YEAR_OPTIONS.map((y) => {
      const sems = semesters.filter(
        (s) => (s.year || yearFromSemesterNumber(s.number)) === y.value
      );
      const subjectCount = sems.reduce((n, s) => n + (s.subjectCount || 0), 0);
      return { ...y, semesterCount: sems.length, subjectCount };
    });
  }, [semesters]);

  const loadSubject = async (subjectId) => {
    setError("");
    try {
      const res = await api.get(`/curriculum/subjects/${subjectId}`);
      setSubjectDetail(res.data.subject);
      setSelectedUnitId(null);
      setSelectedTopicId(null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subject");
    }
  };

  const selectedUnit = subjectDetail?.units?.find((u) => u.id === selectedUnitId || u._id === selectedUnitId);
  const selectedTopic = selectedUnit?.topics?.find((t) => t.id === selectedTopicId || t._id === selectedTopicId);

  const run = async (fn) => {
    setSaving(true);
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Request failed");
    } finally {
      setSaving(false);
    }
  };

  if (activeTab !== "curriculum") return null;

  return (
    <section className="admin-dash-panel">
      <div className="panel-head">
        <div>
          <h2>
            <FaBookOpen style={{ color: "var(--ad-aura)" }} /> Curriculum
          </h2>
          <p>
            Year → Semester → Branch → Subject → Unit → Topic. Each year and semester can carry different branches.
            {isFullAdmin ? " Team roles live under Team." : " Role assignment is admin-only."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isFullAdmin ? (
            <button
              type="button"
              className="admin-btn admin-btn-lime"
              onClick={() =>
                run(async () => {
                  if (
                    !window.confirm(
                      "Import the built-in Medha syllabus catalogs into the database? Existing curriculum rows with the same semester+branch+code will be updated."
                    )
                  ) {
                    return;
                  }
                  await api.post("/curriculum/seed", { force: true });
                  setSelectedYear(null);
                  setSelectedSemester(null);
                  setSelectedBranch(null);
                  setSubjectDetail(null);
                  await loadTree();
                })
              }
            >
              Import syllabus to DB
            </button>
          ) : null}
          <button type="button" className="admin-btn admin-btn-ghost" onClick={loadTree}>
            Refresh
          </button>
        </div>
      </div>

      {error ? <div className="admin-alert admin-alert-error">{error}</div> : null}
      {saving || loading ? (
        <div className="admin-alert admin-alert-info">
          <FaSpinner className="mr-2 inline animate-spin" />
          {loading ? "Loading curriculum…" : "Saving…"}
        </div>
      ) : null}

      <div className="admin-crumb">
        <button
          type="button"
          onClick={() => {
            setSelectedYear(null);
            setSelectedSemester(null);
            setSelectedBranch(null);
            setSubjectDetail(null);
            setSelectedUnitId(null);
            setSelectedTopicId(null);
          }}
        >
          Years
        </button>
        {selectedYear ? (
          <>
            <span className="sep">/</span>
            <button
              type="button"
              onClick={() => {
                setSelectedSemester(null);
                setSelectedBranch(null);
                setSubjectDetail(null);
                setSelectedUnitId(null);
                setSelectedTopicId(null);
              }}
            >
              Year {selectedYear}
            </button>
          </>
        ) : null}
        {selectedSemester ? (
          <>
            <span className="sep">/</span>
            <button
              type="button"
              onClick={() => {
                setSelectedBranch(null);
                setSubjectDetail(null);
                setSelectedUnitId(null);
                setSelectedTopicId(null);
              }}
            >
              {selectedSemester.label}
            </button>
          </>
        ) : null}
        {selectedBranch ? (
          <>
            <span className="sep">/</span>
            <button
              type="button"
              onClick={() => {
                setSubjectDetail(null);
                setSelectedUnitId(null);
                setSelectedTopicId(null);
              }}
            >
              {selectedBranch}
            </button>
          </>
        ) : null}
        {subjectDetail ? (
          <>
            <span className="sep">/</span>
            <button
              type="button"
              onClick={() => {
                setSelectedUnitId(null);
                setSelectedTopicId(null);
              }}
            >
              {subjectDetail.name}
            </button>
          </>
        ) : null}
        {selectedUnit ? (
          <>
            <span className="sep">/</span>
            <button type="button" onClick={() => setSelectedTopicId(null)}>
              Unit {selectedUnit.unitNumber}
            </button>
          </>
        ) : null}
        {selectedTopic ? (
          <>
            <span className="sep">/</span>
            <span className="font-semibold text-[var(--ad-ink)]">{selectedTopic.title}</span>
          </>
        ) : null}
      </div>

      {!selectedYear && (
        <div className="space-y-2.5">
          {yearStats.map((y) => (
            <button
              key={y.value}
              type="button"
              className="admin-list-row"
              onClick={() => {
                setSelectedYear(y.value);
                setSemesterForm((f) => ({ ...f, year: String(y.value) }));
              }}
            >
              <div>
                <p className="font-bold text-[var(--ad-ink)]">{y.label}</p>
                <p className="mt-1 text-xs text-[var(--ad-muted)]">
                  {y.semesterCount} semester{y.semesterCount === 1 ? "" : "s"} · {y.subjectCount} subjects
                </p>
              </div>
              <span className="text-sm font-semibold text-[var(--ad-ink)]">Open →</span>
            </button>
          ))}
        </div>
      )}

      {selectedYear && !selectedSemester && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="space-y-2.5">
            <button
              type="button"
              className="mb-1 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ad-muted)]"
              onClick={() => setSelectedYear(null)}
            >
              <FaArrowLeft /> All years
            </button>
            {yearSemesters.length === 0 && !loading ? (
              <p className="text-sm text-[var(--ad-muted)]">
                No semesters in Year {selectedYear} yet. Create one on the right.
              </p>
            ) : (
              yearSemesters.map((sem) => {
                const branchKeys = Object.keys(sem.branches || {});
                return (
                  <button
                    key={sem.id || sem._id}
                    type="button"
                    className="admin-list-row"
                    onClick={() => {
                      setSelectedSemester(sem);
                      setSelectedBranch(null);
                    }}
                  >
                    <div>
                      <p className="font-bold text-[var(--ad-ink)]">{sem.label}</p>
                      <p className="mt-1 text-xs text-[var(--ad-muted)]">
                        <span className="admin-pill ice mr-1">Sem {sem.number}</span>
                        {sem.subjectCount || 0} subjects
                        {branchKeys.length
                          ? ` · ${branchKeys.length} branch${branchKeys.length === 1 ? "" : "es"}`
                          : ""}
                        {!sem.active ? " · inactive" : ""}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[var(--ad-ink)]">Open →</span>
                  </button>
                );
              })
            )}
          </div>
          <form
            className="admin-side-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const number = Number(semesterForm.number);
                await api.post("/curriculum/semesters", {
                  number,
                  year: Number(semesterForm.year) || selectedYear,
                  label: semesterForm.label || `Semester ${number}`,
                });
                setSemesterForm({ number: "", label: "", year: String(selectedYear) });
                await loadTree();
              });
            }}
          >
            <h3 className="m-0 text-base font-extrabold">New semester</h3>
            <Field label="Year">
              <select
                className="admin-input"
                value={semesterForm.year || String(selectedYear)}
                onChange={(e) => setSemesterForm((f) => ({ ...f, year: e.target.value }))}
              >
                {YEAR_OPTIONS.map((y) => (
                  <option key={y.value} value={y.value}>
                    {y.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Number (1–12)">
              <input
                className="admin-input"
                type="number"
                min={1}
                max={12}
                required
                value={semesterForm.number}
                onChange={(e) => {
                  const number = e.target.value;
                  setSemesterForm((f) => ({
                    ...f,
                    number,
                    year: number
                      ? String(yearFromSemesterNumber(number))
                      : f.year,
                  }));
                }}
              />
            </Field>
            <Field label="Label">
              <input
                className="admin-input"
                placeholder="e.g. Semester III"
                value={semesterForm.label}
                onChange={(e) => setSemesterForm((f) => ({ ...f, label: e.target.value }))}
              />
            </Field>
            <button type="submit" className="admin-btn admin-btn-ink admin-btn-block">
              <FaPlus /> Create semester
            </button>
          </form>
        </div>
      )}

      {selectedSemester && !selectedBranch && !subjectDetail && (
        <div>
          <button
            type="button"
            className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ad-muted)]"
            onClick={() => setSelectedSemester(null)}
          >
            <FaArrowLeft /> Year {selectedYear} semesters
          </button>
          <div className="mb-3 flex items-center justify-between gap-2">
            <div>
              <h3 className="m-0 text-lg font-extrabold">{selectedSemester.label}</h3>
              <p className="mt-1 text-xs text-[var(--ad-muted)]">
                Pick a branch — subjects differ by year, semester, and branch.
              </p>
            </div>
            {isFullAdmin ? (
              <button
                type="button"
                className="text-xs font-bold text-[var(--ad-rose)]"
                onClick={() =>
                  run(async () => {
                    if (!window.confirm("Delete this semester and all its subjects?")) return;
                    await api.delete(
                      `/curriculum/semesters/${selectedSemester.id || selectedSemester._id}/force`
                    );
                    setSelectedSemester(null);
                    setSelectedBranch(null);
                    await loadTree();
                  })
                }
              >
                Delete semester
              </button>
            ) : null}
          </div>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {semesterBranches.map((branch) => {
              const count =
                (selectedSemester.branches && selectedSemester.branches[branch]) ||
                subjects.filter(
                  (s) =>
                    s.semester === selectedSemester.number &&
                    String(s.branch || "CSE").toUpperCase() === branch
                ).length;
              return (
                <button
                  key={branch}
                  type="button"
                  className="admin-list-row"
                  onClick={() => {
                    setSelectedBranch(branch);
                    setSubjectForm((f) => ({ ...f, branch }));
                  }}
                >
                  <div>
                    <p className="font-bold text-[var(--ad-ink)]">{branch}</p>
                    <p className="mt-1 text-xs text-[var(--ad-muted)]">
                      {count} subject{count === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">Open →</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedSemester && selectedBranch && !subjectDetail && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div>
            <button
              type="button"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ad-muted)]"
              onClick={() => setSelectedBranch(null)}
            >
              <FaArrowLeft /> Branches
            </button>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="m-0 text-lg font-extrabold">
                {selectedSemester.label} · {selectedBranch}
              </h3>
            </div>
            <div className="space-y-2.5">
              {branchSubjects.map((subject) => (
                <div key={subject.id} className="admin-list-row">
                  <button
                    type="button"
                    className="min-w-0 flex-1 bg-transparent p-0 text-left"
                    onClick={() => loadSubject(subject.id)}
                  >
                    <p className="font-bold">{subject.name}</p>
                    <p className="mt-1 text-xs text-[var(--ad-muted)]">
                      <span className="admin-pill lime mr-1">{subject.code}</span>
                      <span className="admin-pill ice mr-1">{subject.branch || selectedBranch}</span>
                      {subject.unitCount} units · {subject.topicCount} topics
                    </p>
                  </button>
                  <button
                    type="button"
                    className="rounded-full p-2 text-[var(--ad-muted)] hover:bg-[var(--ad-ice)]"
                    onClick={() =>
                      setEditSubject({
                        id: subject.id,
                        name: subject.name,
                        code: subject.code,
                        short: subject.short || "",
                        scheme: subject.scheme || "rtu",
                        branch: subject.branch || selectedBranch,
                        active: subject.active,
                      })
                    }
                  >
                    <FaPen size={13} />
                  </button>
                </div>
              ))}
              {branchSubjects.length === 0 ? (
                <p className="text-sm text-[var(--ad-muted)]">
                  No subjects for {selectedBranch} in this semester yet.
                </p>
              ) : null}
            </div>
          </div>
          <form
            className="admin-side-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.post("/curriculum/subjects", {
                  semester: selectedSemester.number,
                  ...subjectForm,
                  branch: subjectForm.branch || selectedBranch,
                });
                setSubjectForm({
                  name: "",
                  code: "",
                  short: "",
                  scheme: "rtu",
                  branch: selectedBranch,
                });
                await loadTree();
              });
            }}
          >
            <h3 className="m-0 text-base font-extrabold">New subject</h3>
            <Field label="Branch">
              <select
                className="admin-input"
                value={subjectForm.branch || selectedBranch}
                onChange={(e) => setSubjectForm((f) => ({ ...f, branch: e.target.value }))}
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Name">
              <input
                className="admin-input"
                required
                value={subjectForm.name}
                onChange={(e) => setSubjectForm((f) => ({ ...f, name: e.target.value }))}
              />
            </Field>
            <Field label="Code">
              <input
                className="admin-input"
                required
                placeholder="4CS4-05"
                value={subjectForm.code}
                onChange={(e) => setSubjectForm((f) => ({ ...f, code: e.target.value }))}
              />
            </Field>
            <Field label="Short">
              <input
                className="admin-input"
                value={subjectForm.short}
                onChange={(e) => setSubjectForm((f) => ({ ...f, short: e.target.value }))}
              />
            </Field>
            <Field label="Scheme">
              <select
                className="admin-input"
                value={subjectForm.scheme}
                onChange={(e) => setSubjectForm((f) => ({ ...f, scheme: e.target.value }))}
              >
                <option value="rtu">Scheme A</option>
                <option value="arya">Scheme B</option>
              </select>
            </Field>
            <button type="submit" className="admin-btn admin-btn-ink admin-btn-block">
              <FaPlus /> Add subject
            </button>
          </form>
        </div>
      )}

      {subjectDetail && !selectedUnitId && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div>
            <button type="button" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ad-muted)]" onClick={() => setSubjectDetail(null)}>
              <FaArrowLeft /> {selectedBranch || "Subjects"}
            </button>
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="m-0 text-lg font-extrabold">{subjectDetail.name}</h3>
                <p className="mt-1 text-xs text-[var(--ad-muted)]">
                  {subjectDetail.code}
                  {subjectDetail.branch ? ` · ${subjectDetail.branch}` : ""}
                </p>
              </div>
              <button
                type="button"
                className="text-xs font-bold text-[var(--ad-rose)]"
                onClick={() =>
                  run(async () => {
                    if (!window.confirm("Delete this subject and all units/topics?")) return;
                    await api.delete(`/curriculum/subjects/${subjectDetail.id}`);
                    setSubjectDetail(null);
                    await loadTree();
                  })
                }
              >
                <FaTrash className="mr-1 inline" /> Delete subject
              </button>
            </div>
            <div className="space-y-2.5">
              {(subjectDetail.units || [])
                .slice()
                .sort((a, b) => a.unitNumber - b.unitNumber)
                .map((unit) => (
                  <div key={unit.id || unit._id} className="admin-list-row">
                    <button
                      type="button"
                      className="min-w-0 flex-1 bg-transparent p-0 text-left"
                      onClick={() => {
                        setSelectedUnitId(unit.id || unit._id);
                        setSelectedTopicId(null);
                      }}
                    >
                      <p className="font-bold">
                        Unit {String(unit.unitNumber).padStart(2, "0")} · {unit.title}
                      </p>
                      <p className="mt-1 text-xs text-[var(--ad-muted)]">{(unit.topics || []).length} topics</p>
                    </button>
                    <button
                      type="button"
                      className="rounded-full p-2 text-[var(--ad-muted)] hover:bg-[var(--ad-ice)]"
                      onClick={() => setEditUnit({ id: unit.id || unit._id, title: unit.title, unitNumber: unit.unitNumber })}
                    >
                      <FaPen size={13} />
                    </button>
                  </div>
                ))}
            </div>
          </div>
          <form
            className="admin-side-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.post(`/curriculum/subjects/${subjectDetail.id}/units`, {
                  title: unitForm.title,
                  unitNumber: unitForm.unitNumber ? Number(unitForm.unitNumber) : undefined,
                });
                setUnitForm({ title: "", unitNumber: "" });
                await loadSubject(subjectDetail.id);
                await loadTree();
              });
            }}
          >
            <h3 className="m-0 text-base font-extrabold">New unit</h3>
            <Field label="Title"><input className="admin-input" required value={unitForm.title} onChange={(e) => setUnitForm((f) => ({ ...f, title: e.target.value }))} /></Field>
            <Field label="Unit number (optional)"><input className="admin-input" type="number" min={1} value={unitForm.unitNumber} onChange={(e) => setUnitForm((f) => ({ ...f, unitNumber: e.target.value }))} /></Field>
            <button type="submit" className="admin-btn admin-btn-ink admin-btn-block"><FaPlus /> Add unit</button>
          </form>
        </div>
      )}

      {subjectDetail && selectedUnit && !selectedTopicId && (
        <div className="grid gap-5 lg:grid-cols-[1fr_300px]">
          <div>
            <button type="button" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ad-muted)]" onClick={() => setSelectedUnitId(null)}>
              <FaArrowLeft /> Units
            </button>
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="m-0 text-lg font-extrabold">
                Unit {selectedUnit.unitNumber}: {selectedUnit.title}
              </h3>
              <button
                type="button"
                className="text-xs font-bold text-[var(--ad-rose)]"
                onClick={() =>
                  run(async () => {
                    if (!window.confirm("Delete this unit?")) return;
                    await api.delete(`/curriculum/subjects/${subjectDetail.id}/units/${selectedUnit.id || selectedUnit._id}`);
                    setSelectedUnitId(null);
                    await loadSubject(subjectDetail.id);
                  })
                }
              >
                Delete unit
              </button>
            </div>
            <div className="space-y-2">
              {(selectedUnit.topics || []).map((topic) => (
                <div key={topic.id || topic._id} className="admin-list-row">
                  <button type="button" className="min-w-0 flex-1 bg-transparent p-0 text-left" onClick={() => setSelectedTopicId(topic.id || topic._id)}>
                    <p className="font-semibold">{topic.title}</p>
                    <p className="mt-1 text-xs text-[var(--ad-muted)]">{(topic.resources || []).length} resources</p>
                  </button>
                  <button type="button" className="rounded-full p-2 text-[var(--ad-muted)] hover:bg-[var(--ad-ice)]" onClick={() => setEditTopic({ id: topic.id || topic._id, title: topic.title })}>
                    <FaPen size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
          <form
            className="admin-side-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.post(`/curriculum/subjects/${subjectDetail.id}/units/${selectedUnit.id || selectedUnit._id}/topics`, {
                  title: topicForm.title,
                });
                setTopicForm({ title: "" });
                await loadSubject(subjectDetail.id);
              });
            }}
          >
            <h3 className="m-0 text-base font-extrabold">New topic</h3>
            <Field label="Topic name"><input className="admin-input" required value={topicForm.title} onChange={(e) => setTopicForm({ title: e.target.value })} /></Field>
            <button type="submit" className="admin-btn admin-btn-ink admin-btn-block"><FaPlus /> Add topic</button>
          </form>
        </div>
      )}

      {subjectDetail && selectedUnit && selectedTopic && (
        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
          <div>
            <button type="button" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[var(--ad-muted)]" onClick={() => setSelectedTopicId(null)}>
              <FaArrowLeft /> Topics
            </button>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="m-0 text-lg font-extrabold">{selectedTopic.title}</h3>
              <button
                type="button"
                className="text-xs font-bold text-[var(--ad-rose)]"
                onClick={() =>
                  run(async () => {
                    if (!window.confirm("Delete this topic?")) return;
                    await api.delete(
                      `/curriculum/subjects/${subjectDetail.id}/units/${selectedUnit.id || selectedUnit._id}/topics/${selectedTopic.id || selectedTopic._id}`
                    );
                    setSelectedTopicId(null);
                    await loadSubject(subjectDetail.id);
                  })
                }
              >
                Delete topic
              </button>
            </div>
            <div className="space-y-2">
              {(selectedTopic.resources || []).length === 0 ? (
                <p className="text-sm text-[var(--ad-muted)]">No notes or links yet for this topic.</p>
              ) : (
                (selectedTopic.resources || []).map((resource) => (
                  <div key={resource.id || resource._id} className="admin-list-row cursor-default">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 font-semibold">
                        {resource.kind === "youtube" ? <FaYoutube className="text-[var(--ad-orange)]" /> : null}
                        {resource.kind === "gfg" || resource.kind === "link" ? <FaLink style={{ color: "var(--ad-sky)" }} /> : null}
                        {resource.kind === "note" || resource.kind === "pdf" ? <FaFileLines style={{ color: "var(--ad-aura)" }} /> : null}
                        {resource.title}
                      </p>
                      <p className="mt-1"><span className="admin-pill ice">{resource.kind}</span></p>
                    </div>
                    <div className="flex gap-2">
                      {resource.hasUrl ? (
                        <button
                          type="button"
                          className="admin-btn admin-btn-lime"
                          style={{ padding: "0.35rem 0.75rem", fontSize: "0.75rem" }}
                          onClick={() =>
                            run(async () => {
                              const res = await api.post(
                                `/curriculum/subjects/${subjectDetail.id}/units/${selectedUnit.id || selectedUnit._id}/topics/${selectedTopic.id || selectedTopic._id}/resources/${resource.id || resource._id}/open`
                              );
                              if (res.data?.url) window.open(res.data.url, "_blank", "noopener,noreferrer");
                            })
                          }
                        >
                          Open
                        </button>
                      ) : null}
                      <button
                        type="button"
                        className="rounded-full p-2 text-[var(--ad-rose)] hover:bg-[var(--ad-rose-soft)]"
                        onClick={() =>
                          run(async () => {
                            await api.delete(
                              `/curriculum/subjects/${subjectDetail.id}/units/${selectedUnit.id || selectedUnit._id}/topics/${selectedTopic.id || selectedTopic._id}/resources/${resource.id || resource._id}`
                            );
                            await loadSubject(subjectDetail.id);
                          })
                        }
                      >
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <form
            className="admin-side-form"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.post(
                  `/curriculum/subjects/${subjectDetail.id}/units/${selectedUnit.id || selectedUnit._id}/topics/${selectedTopic.id || selectedTopic._id}/resources`,
                  {
                    kind: resourceForm.kind,
                    title: resourceForm.title,
                    url: resourceForm.url || undefined,
                    noteId: resourceForm.noteId || undefined,
                    description: resourceForm.description,
                  }
                );
                setResourceForm({ kind: "youtube", title: "", url: "", noteId: "", description: "" });
                await loadSubject(subjectDetail.id);
              });
            }}
          >
            <h3 className="m-0 text-base font-extrabold">Add note / link</h3>
            <Field label="Type">
              <select className="admin-input" value={resourceForm.kind} onChange={(e) => setResourceForm((f) => ({ ...f, kind: e.target.value }))}>
                {RESOURCE_KINDS.map((k) => (
                  <option key={k.value} value={k.value}>{k.label}</option>
                ))}
              </select>
            </Field>
            <Field label="Title"><input className="admin-input" required value={resourceForm.title} onChange={(e) => setResourceForm((f) => ({ ...f, title: e.target.value }))} /></Field>
            {resourceForm.kind === "note" ? (
              <Field label="Note ID"><input className="admin-input" value={resourceForm.noteId} onChange={(e) => setResourceForm((f) => ({ ...f, noteId: e.target.value }))} /></Field>
            ) : (
              <Field label="URL"><input className="admin-input" required value={resourceForm.url} onChange={(e) => setResourceForm((f) => ({ ...f, url: e.target.value }))} placeholder="https://…" /></Field>
            )}
            <Field label="Description"><textarea className="admin-input" rows={2} value={resourceForm.description} onChange={(e) => setResourceForm((f) => ({ ...f, description: e.target.value }))} /></Field>
            <button type="submit" className="admin-btn admin-btn-ink admin-btn-block"><FaPlus /> Attach resource</button>
            <p className="m-0 text-xs text-[var(--ad-muted)]">URLs stay on the server — not exposed in the public catalog.</p>
          </form>
        </div>
      )}

      {editSubject ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-md space-y-3 rounded-[1.4rem] border border-[var(--ad-line)] bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.patch(`/curriculum/subjects/${editSubject.id}`, editSubject);
                setEditSubject(null);
                await loadTree();
                if (subjectDetail?.id === editSubject.id) await loadSubject(editSubject.id);
              });
            }}
          >
            <h3 className="m-0 text-lg font-extrabold">Edit subject</h3>
            <Field label="Branch">
              <select
                className="admin-input"
                value={editSubject.branch || "CSE"}
                onChange={(e) => setEditSubject((s) => ({ ...s, branch: e.target.value }))}
              >
                {BRANCH_OPTIONS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </Field>
            <Field label="Name"><input className="admin-input" value={editSubject.name} onChange={(e) => setEditSubject((s) => ({ ...s, name: e.target.value }))} /></Field>
            <Field label="Code"><input className="admin-input" value={editSubject.code} onChange={(e) => setEditSubject((s) => ({ ...s, code: e.target.value }))} /></Field>
            <Field label="Short"><input className="admin-input" value={editSubject.short} onChange={(e) => setEditSubject((s) => ({ ...s, short: e.target.value }))} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={!!editSubject.active} onChange={(e) => setEditSubject((s) => ({ ...s, active: e.target.checked }))} /> Active</label>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setEditSubject(null)}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-ink">Save</button>
            </div>
          </form>
        </div>
      ) : null}

      {editUnit && subjectDetail ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-md space-y-3 rounded-[1.4rem] border border-[var(--ad-line)] bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.patch(`/curriculum/subjects/${subjectDetail.id}/units/${editUnit.id}`, {
                  title: editUnit.title,
                  unitNumber: Number(editUnit.unitNumber),
                });
                setEditUnit(null);
                await loadSubject(subjectDetail.id);
              });
            }}
          >
            <h3 className="m-0 text-lg font-extrabold">Edit unit</h3>
            <Field label="Title"><input className="admin-input" value={editUnit.title} onChange={(e) => setEditUnit((u) => ({ ...u, title: e.target.value }))} /></Field>
            <Field label="Number"><input className="admin-input" type="number" value={editUnit.unitNumber} onChange={(e) => setEditUnit((u) => ({ ...u, unitNumber: e.target.value }))} /></Field>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setEditUnit(null)}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-ink">Save</button>
            </div>
          </form>
        </div>
      ) : null}

      {editTopic && subjectDetail && selectedUnit ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <form
            className="w-full max-w-md space-y-3 rounded-[1.4rem] border border-[var(--ad-line)] bg-white p-5"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api.patch(
                  `/curriculum/subjects/${subjectDetail.id}/units/${selectedUnit.id || selectedUnit._id}/topics/${editTopic.id}`,
                  { title: editTopic.title }
                );
                setEditTopic(null);
                await loadSubject(subjectDetail.id);
              });
            }}
          >
            <h3 className="m-0 text-lg font-extrabold">Edit topic</h3>
            <Field label="Title"><input className="admin-input" value={editTopic.title} onChange={(e) => setEditTopic((t) => ({ ...t, title: e.target.value }))} /></Field>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" className="admin-btn admin-btn-ghost" onClick={() => setEditTopic(null)}>Cancel</button>
              <button type="submit" className="admin-btn admin-btn-ink">Save</button>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
