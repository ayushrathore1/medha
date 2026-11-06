const CurriculumSemester = require("../models/CurriculumSemester");
const CurriculumSubject = require("../models/CurriculumSubject");
const CuratedResource = require("../models/CuratedResource");
const { seedCurriculum } = require("../utils/seedCurriculum");

function actorId(req) {
  return req.userId || req.staffUser?._id || null;
}

function resourceHasDestination(resource = {}) {
  return Boolean(
    resource.url ||
      resource.videoId ||
      resource.curatedResourceId ||
      resource.noteId ||
      ["youtube", "gfg", "link", "pdf"].includes(resource.kind)
  );
}

function stripResourceSecrets(resource) {
  if (!resource) return resource;
  const obj = resource.toObject ? resource.toObject() : { ...resource };
  delete obj.url;
  delete obj.videoId;
  return {
    ...obj,
    id: obj._id?.toString?.() || obj.id,
    hasUrl: resourceHasDestination(resource),
  };
}

function publicTopic(topic) {
  const obj = topic.toObject ? topic.toObject() : { ...topic };
  return {
    ...obj,
    id: obj._id?.toString?.() || obj.id,
    resources: (obj.resources || []).map((r) => {
      const copy = { ...r };
      delete copy.url;
      delete copy.videoId;
      return {
        ...copy,
        id: copy._id?.toString?.() || copy.id,
        hasUrl: resourceHasDestination(r),
      };
    }),
  };
}

function publicUnit(unit) {
  const obj = unit.toObject ? unit.toObject() : { ...unit };
  return {
    ...obj,
    id: obj._id?.toString?.() || obj.id,
    topics: (obj.topics || []).map(publicTopic),
  };
}

function publicSubject(subject, { includeResources = true } = {}) {
  const obj = subject.toObject ? subject.toObject() : { ...subject };
  return {
    id: obj._id.toString(),
    semester: obj.semester,
    name: obj.name,
    code: obj.code,
    short: obj.short,
    scheme: obj.scheme,
    branch: obj.branch,
    course: obj.course,
    active: obj.active,
    unitCount: (obj.units || []).length,
    topicCount: (obj.units || []).reduce((n, u) => n + (u.topics || []).length, 0),
    units: includeResources
      ? (obj.units || []).map(publicUnit)
      : (obj.units || []).map((u) => ({
          id: u._id?.toString?.() || u.id,
          unitNumber: u.unitNumber,
          title: u.title,
          topics: (u.topics || []).map((t) => ({
            id: t._id?.toString?.() || t.id,
            title: t.title,
            order: t.order,
          })),
        })),
    updatedAt: obj.updatedAt,
    createdAt: obj.createdAt,
  };
}

function extractYoutubeId(url = "") {
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/
  );
  return m ? m[1] : null;
}

async function syncCuratedFromResource({ subject, unit, topic, resource }) {
  if (!["youtube", "gfg", "link"].includes(resource.kind)) return null;
  if (!resource.url && !resource.videoId) return null;

  const videoId = resource.videoId || extractYoutubeId(resource.url || "");
  const sourceKey = `curriculum:${resource._id}`;
  const payload = {
    kind: resource.kind === "gfg" ? "gfg" : "youtube",
    title: resource.title,
    subject: subject.name,
    semester: subject.semester,
    unitNumber: unit.unitNumber,
    unitTitle: unit.title,
    tags: [topic.title.toLowerCase(), subject.name.toLowerCase(), unit.title.toLowerCase()],
    channelTitle: resource.kind === "gfg" ? "GeeksforGeeks" : "Curated",
    url: resource.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null),
    videoId: videoId || null,
    thumbnailUrl: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null,
    sourceKey,
    active: resource.active !== false,
  };

  // link kind that is not youtube/gfg — store as gfg-like openable url under youtube open path? Better extend CuratedResource later.
  if (resource.kind === "link") {
    payload.kind = "gfg";
    payload.channelTitle = "External";
  }

  const doc = await CuratedResource.findOneAndUpdate(
    { sourceKey },
    { $set: payload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  return doc._id;
}

// ─── Semesters ───────────────────────────────────────────────

function yearFromSemesterNumber(n) {
  return Math.min(4, Math.max(1, Math.ceil(Number(n) / 2)));
}

async function ensureCurriculumIndexes() {
  try {
    await CurriculumSubject.collection.dropIndex("semester_1_code_1");
  } catch (_) {
    /* old unique index may already be gone */
  }
  try {
    await CurriculumSubject.syncIndexes();
  } catch (err) {
    console.warn("CurriculumSubject syncIndexes:", err.message);
  }
  try {
    const missingYear = await CurriculumSemester.find({
      $or: [{ year: null }, { year: { $exists: false } }],
    });
    for (const sem of missingYear) {
      sem.year = yearFromSemesterNumber(sem.number);
      await sem.save();
    }
  } catch (err) {
    console.warn("Backfill semester year:", err.message);
  }
}

exports.listSemesters = async (req, res) => {
  try {
    await seedCurriculum();
    await ensureCurriculumIndexes();
    const semesters = await CurriculumSemester.find().sort({ number: 1 }).lean();
    const counts = await CurriculumSubject.aggregate([
      { $match: { active: true } },
      {
        $group: {
          _id: { semester: "$semester", branch: "$branch" },
          subjects: { $sum: 1 },
        },
      },
    ]);
    const countMap = {};
    const branchMap = {};
    for (const row of counts) {
      const sem = row._id.semester;
      const branch = row._id.branch || "CSE";
      countMap[sem] = (countMap[sem] || 0) + row.subjects;
      if (!branchMap[sem]) branchMap[sem] = {};
      branchMap[sem][branch] = row.subjects;
    }
    res.json({
      semesters: semesters.map((s) => ({
        ...s,
        id: s._id.toString(),
        year: s.year || yearFromSemesterNumber(s.number),
        subjectCount: countMap[s.number] || 0,
        branches: branchMap[s.number] || {},
      })),
    });
  } catch (error) {
    console.error("listSemesters:", error);
    res.status(500).json({ message: "Failed to list semesters" });
  }
};

exports.createSemester = async (req, res) => {
  try {
    const number = Number(req.body.number);
    const label = String(req.body.label || `Semester ${number}`).trim();
    if (!Number.isInteger(number) || number < 1 || number > 12) {
      return res.status(400).json({ message: "Semester number must be 1–12" });
    }
    const year = Number(req.body.year) || yearFromSemesterNumber(number);
    if (!Number.isInteger(year) || year < 1 || year > 4) {
      return res.status(400).json({ message: "Year must be 1–4" });
    }
    const existing = await CurriculumSemester.findOne({ number });
    if (existing) {
      return res.status(409).json({ message: `Semester ${number} already exists` });
    }
    const semester = await CurriculumSemester.create({
      number,
      year,
      label,
      description: req.body.description || "",
      createdBy: actorId(req),
      updatedBy: actorId(req),
    });
    res.status(201).json({ semester });
  } catch (error) {
    console.error("createSemester:", error);
    res.status(500).json({ message: "Failed to create semester" });
  }
};

exports.updateSemester = async (req, res) => {
  try {
    const semester = await CurriculumSemester.findById(req.params.semesterId);
    if (!semester) return res.status(404).json({ message: "Semester not found" });

    if (req.body.label != null) semester.label = String(req.body.label).trim();
    if (req.body.description != null) semester.description = String(req.body.description);
    if (req.body.year != null) {
      const year = Number(req.body.year);
      if (!Number.isInteger(year) || year < 1 || year > 4) {
        return res.status(400).json({ message: "Year must be 1–4" });
      }
      semester.year = year;
    }
    if (typeof req.body.active === "boolean") semester.active = req.body.active;
    semester.updatedBy = actorId(req);
    await semester.save();
    res.json({ semester });
  } catch (error) {
    console.error("updateSemester:", error);
    res.status(500).json({ message: "Failed to update semester" });
  }
};

exports.deleteSemester = async (req, res) => {
  try {
    const semester = await CurriculumSemester.findById(req.params.semesterId);
    if (!semester) return res.status(404).json({ message: "Semester not found" });
    const subjectCount = await CurriculumSubject.countDocuments({ semester: semester.number });
    if (subjectCount > 0 && !req.query.force) {
      return res.status(409).json({
        message: `Semester has ${subjectCount} subjects. Pass ?force=1 to delete subjects too.`,
        subjectCount,
      });
    }
    if (req.query.force) {
      await CurriculumSubject.deleteMany({ semester: semester.number });
    }
    await semester.deleteOne();
    res.json({ message: "Semester deleted" });
  } catch (error) {
    console.error("deleteSemester:", error);
    res.status(500).json({ message: "Failed to delete semester" });
  }
};

// ─── Subjects ────────────────────────────────────────────────

exports.listSubjects = async (req, res) => {
  try {
    await seedCurriculum();
    const filter = {};
    if (req.query.semester) filter.semester = Number(req.query.semester);
    if (req.query.branch) filter.branch = String(req.query.branch).trim().toUpperCase();
    if (req.query.active !== "all") filter.active = true;
    const subjects = await CurriculumSubject.find(filter)
      .select("-units.topics.resources.url -units.topics.resources.videoId")
      .sort({ semester: 1, branch: 1, name: 1 });
    res.json({
      subjects: subjects.map((s) => publicSubject(s, { includeResources: false })),
    });
  } catch (error) {
    console.error("listSubjects:", error);
    res.status(500).json({ message: "Failed to list subjects" });
  }
};

exports.getSubject = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId).select(
      "+units.topics.resources.url +units.topics.resources.videoId"
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    // Staff may see metadata; URLs still stripped — open via resource open endpoint
    res.json({ subject: publicSubject(subject, { includeResources: true }) });
  } catch (error) {
    console.error("getSubject:", error);
    res.status(500).json({ message: "Failed to load subject" });
  }
};

exports.createSubject = async (req, res) => {
  try {
    const semester = Number(req.body.semester);
    const name = String(req.body.name || "").trim();
    const code = String(req.body.code || "").trim().toUpperCase();
    if (!semester || !name || !code) {
      return res.status(400).json({ message: "semester, name, and code are required" });
    }
    const sem = await CurriculumSemester.findOne({ number: semester });
    if (!sem) {
      return res.status(400).json({ message: `Create semester ${semester} first` });
    }
    const branch = String(req.body.branch || "CSE").trim().toUpperCase() || "CSE";
    const subject = await CurriculumSubject.create({
      semester,
      name,
      code,
      short: String(req.body.short || "").trim(),
      scheme: String(req.body.scheme || "rtu").trim(),
      branch,
      course: String(req.body.course || "B.Tech").trim(),
      units: [],
      createdBy: actorId(req),
      updatedBy: actorId(req),
    });
    res.status(201).json({ subject: publicSubject(subject) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Subject code already exists for this semester + branch",
      });
    }
    console.error("createSubject:", error);
    res.status(500).json({ message: "Failed to create subject" });
  }
};

exports.updateSubject = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    ["name", "short", "scheme", "course"].forEach((key) => {
      if (req.body[key] != null) subject[key] = String(req.body[key]).trim();
    });
    if (req.body.branch != null) {
      subject.branch = String(req.body.branch).trim().toUpperCase() || "CSE";
    }
    if (req.body.code != null) subject.code = String(req.body.code).trim().toUpperCase();
    if (req.body.semester != null) {
      const semester = Number(req.body.semester);
      const sem = await CurriculumSemester.findOne({ number: semester });
      if (!sem) return res.status(400).json({ message: `Semester ${semester} does not exist` });
      subject.semester = semester;
    }
    if (typeof req.body.active === "boolean") subject.active = req.body.active;
    subject.updatedBy = actorId(req);
    await subject.save();
    res.json({ subject: publicSubject(subject) });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: "Subject code already exists for this semester + branch",
      });
    }
    console.error("updateSubject:", error);
    res.status(500).json({ message: "Failed to update subject" });
  }
};

exports.deleteSubject = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findByIdAndDelete(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (error) {
    console.error("deleteSubject:", error);
    res.status(500).json({ message: "Failed to delete subject" });
  }
};

// ─── Units ───────────────────────────────────────────────────

exports.createUnit = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const title = String(req.body.title || "").trim();
    const unitNumber = Number(req.body.unitNumber) || subject.units.length + 1;
    if (!title) return res.status(400).json({ message: "Unit title is required" });
    if (subject.units.some((u) => u.unitNumber === unitNumber)) {
      return res.status(409).json({ message: `Unit ${unitNumber} already exists` });
    }

    subject.units.push({ unitNumber, title, topics: [] });
    subject.updatedBy = actorId(req);
    await subject.save();
    const unit = subject.units[subject.units.length - 1];
    res.status(201).json({ unit: publicUnit(unit), subject: publicSubject(subject) });
  } catch (error) {
    console.error("createUnit:", error);
    res.status(500).json({ message: "Failed to create unit" });
  }
};

exports.updateUnit = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    if (req.body.title != null) unit.title = String(req.body.title).trim();
    if (req.body.unitNumber != null) {
      const unitNumber = Number(req.body.unitNumber);
      if (subject.units.some((u) => u.unitNumber === unitNumber && String(u._id) !== String(unit._id))) {
        return res.status(409).json({ message: `Unit ${unitNumber} already exists` });
      }
      unit.unitNumber = unitNumber;
    }
    subject.updatedBy = actorId(req);
    await subject.save();
    res.json({ unit: publicUnit(unit), subject: publicSubject(subject) });
  } catch (error) {
    console.error("updateUnit:", error);
    res.status(500).json({ message: "Failed to update unit" });
  }
};

exports.deleteUnit = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    unit.deleteOne();
    subject.updatedBy = actorId(req);
    await subject.save();
    res.json({ message: "Unit deleted", subject: publicSubject(subject) });
  } catch (error) {
    console.error("deleteUnit:", error);
    res.status(500).json({ message: "Failed to delete unit" });
  }
};

// ─── Topics ──────────────────────────────────────────────────

exports.createTopic = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });

    const title = String(req.body.title || "").trim();
    if (!title) return res.status(400).json({ message: "Topic title is required" });

    unit.topics.push({
      title,
      order: req.body.order != null ? Number(req.body.order) : unit.topics.length,
      resources: [],
    });
    subject.updatedBy = actorId(req);
    await subject.save();
    const topic = unit.topics[unit.topics.length - 1];
    res.status(201).json({ topic: publicTopic(topic), subject: publicSubject(subject) });
  } catch (error) {
    console.error("createTopic:", error);
    res.status(500).json({ message: "Failed to create topic" });
  }
};

exports.updateTopic = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    const topic = unit.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    if (req.body.title != null) topic.title = String(req.body.title).trim();
    if (req.body.order != null) topic.order = Number(req.body.order);
    subject.updatedBy = actorId(req);
    await subject.save();
    res.json({ topic: publicTopic(topic), subject: publicSubject(subject) });
  } catch (error) {
    console.error("updateTopic:", error);
    res.status(500).json({ message: "Failed to update topic" });
  }
};

exports.deleteTopic = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    const topic = unit.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    topic.deleteOne();
    subject.updatedBy = actorId(req);
    await subject.save();
    res.json({ message: "Topic deleted", subject: publicSubject(subject) });
  } catch (error) {
    console.error("deleteTopic:", error);
    res.status(500).json({ message: "Failed to delete topic" });
  }
};

// ─── Topic resources ─────────────────────────────────────────

exports.addTopicResource = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId).select(
      "+units.topics.resources.url +units.topics.resources.videoId"
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    const topic = unit.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });

    const kind = String(req.body.kind || "").toLowerCase();
    const title = String(req.body.title || "").trim();
    if (!["note", "youtube", "gfg", "link", "pdf"].includes(kind)) {
      return res.status(400).json({ message: "Invalid resource kind" });
    }
    if (!title) return res.status(400).json({ message: "Resource title is required" });

    const url = req.body.url ? String(req.body.url).trim() : null;
    const videoId = req.body.videoId
      ? String(req.body.videoId).trim()
      : extractYoutubeId(url || "");
    const noteId = req.body.noteId || null;

    if (["youtube", "gfg", "link", "pdf"].includes(kind) && !url && !videoId) {
      return res.status(400).json({ message: "url (or videoId) is required for this resource kind" });
    }
    if (kind === "note" && !noteId && !url) {
      return res.status(400).json({ message: "noteId or url is required for note resources" });
    }

    topic.resources.push({
      kind,
      title,
      description: String(req.body.description || ""),
      url,
      videoId: videoId || null,
      noteId,
      active: true,
    });
    subject.updatedBy = actorId(req);
    await subject.save();

    const resource = topic.resources[topic.resources.length - 1];
    try {
      const curatedId = await syncCuratedFromResource({ subject, unit, topic, resource });
      if (curatedId) {
        resource.curatedResourceId = curatedId;
        await subject.save();
      }
    } catch (syncErr) {
      console.warn("Curated sync skipped:", syncErr.message);
    }

    res.status(201).json({
      resource: stripResourceSecrets(resource),
      subject: publicSubject(subject),
    });
  } catch (error) {
    console.error("addTopicResource:", error);
    res.status(500).json({ message: "Failed to add resource" });
  }
};

exports.updateTopicResource = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId).select(
      "+units.topics.resources.url +units.topics.resources.videoId"
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    const topic = unit.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const resource = topic.resources.id(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (req.body.title != null) resource.title = String(req.body.title).trim();
    if (req.body.description != null) resource.description = String(req.body.description);
    if (req.body.url != null) {
      resource.url = String(req.body.url).trim() || null;
      resource.videoId = extractYoutubeId(resource.url || "") || resource.videoId;
    }
    if (req.body.videoId != null) resource.videoId = String(req.body.videoId).trim() || null;
    if (req.body.noteId != null) resource.noteId = req.body.noteId || null;
    if (typeof req.body.active === "boolean") resource.active = req.body.active;
    subject.updatedBy = actorId(req);
    await subject.save();

    try {
      const curatedId = await syncCuratedFromResource({ subject, unit, topic, resource });
      if (curatedId) resource.curatedResourceId = curatedId;
      await subject.save();
    } catch (syncErr) {
      console.warn("Curated sync skipped:", syncErr.message);
    }

    res.json({ resource: stripResourceSecrets(resource), subject: publicSubject(subject) });
  } catch (error) {
    console.error("updateTopicResource:", error);
    res.status(500).json({ message: "Failed to update resource" });
  }
};

exports.deleteTopicResource = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId);
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    if (!unit) return res.status(404).json({ message: "Unit not found" });
    const topic = unit.topics.id(req.params.topicId);
    if (!topic) return res.status(404).json({ message: "Topic not found" });
    const resource = topic.resources.id(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    if (resource.curatedResourceId) {
      await CuratedResource.deleteOne({ _id: resource.curatedResourceId }).catch(() => {});
    }
    resource.deleteOne();
    subject.updatedBy = actorId(req);
    await subject.save();
    res.json({ message: "Resource deleted", subject: publicSubject(subject) });
  } catch (error) {
    console.error("deleteTopicResource:", error);
    res.status(500).json({ message: "Failed to delete resource" });
  }
};

/**
 * Staff-only: open a topic resource URL (does not leak in list responses).
 */
exports.openTopicResource = async (req, res) => {
  try {
    const subject = await CurriculumSubject.findById(req.params.subjectId).select(
      "+units.topics.resources.url +units.topics.resources.videoId"
    );
    if (!subject) return res.status(404).json({ message: "Subject not found" });
    const unit = subject.units.id(req.params.unitId);
    const topic = unit?.topics.id(req.params.topicId);
    const resource = topic?.resources.id(req.params.resourceId);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    let url = resource.url;
    if (!url && resource.videoId) url = `https://www.youtube.com/watch?v=${resource.videoId}`;
    if (!url && resource.curatedResourceId) {
      const curated = await CuratedResource.findById(resource.curatedResourceId)
        .select("+url +videoId")
        .lean();
      url = curated?.url || (curated?.videoId ? `https://www.youtube.com/watch?v=${curated.videoId}` : null);
    }
    if (!url) return res.status(404).json({ message: "No URL stored for this resource" });
    res.json({ url, kind: resource.kind, title: resource.title });
  } catch (error) {
    console.error("openTopicResource:", error);
    res.status(500).json({ message: "Failed to open resource" });
  }
};

exports.ensureSeeded = async (_req, _res, next) => {
  try {
    await seedCurriculum();
  } catch (err) {
    console.warn("Curriculum seed skipped:", err.message);
  }
  next();
};

/** Super-admin: re-import hardcoded catalogs into Mongo curriculum collections. */
exports.reseedFromCatalog = async (req, res) => {
  try {
    const force = req.query.force === "1" || req.body?.force === true;
    const result = await seedCurriculum({ force });
    res.json({
      message: result.seeded
        ? "Curriculum imported from catalog into the database"
        : "Curriculum already present (pass force=1 to rebuild)",
      ...result,
    });
  } catch (error) {
    console.error("reseedFromCatalog:", error);
    res.status(500).json({ message: "Failed to seed curriculum", error: error.message });
  }
};

/** Public tree for the student app — titles only, no destination URLs. */
exports.publicTree = async (_req, res) => {
  try {
    await seedCurriculum();
    const semesters = await CurriculumSemester.find({ active: true }).sort({ number: 1 }).lean();
    const subjects = await CurriculumSubject.find({ active: true })
      .select("-units.topics.resources.url -units.topics.resources.videoId")
      .sort({ semester: 1, name: 1 });

    res.json({
      semesters: semesters.map((s) => ({
        id: s._id.toString(),
        number: s.number,
        label: s.label,
      })),
      subjects: subjects.map((s) => publicSubject(s, { includeResources: false })),
    });
  } catch (error) {
    console.error("publicTree:", error);
    res.status(500).json({ message: "Failed to load curriculum" });
  }
};
