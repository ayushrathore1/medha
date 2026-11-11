const CurriculumSemester = require("../models/CurriculumSemester");
const CurriculumSubject = require("../models/CurriculumSubject");
const CuratedResource = require("../models/CuratedResource");
const Syllabus = require("../models/Syllabus");
const SYLLABUS_CATALOG = require("../data/syllabusCatalog");
const { ARYA_SEM3_SUBJECTS } = require("../data/aryaSem3Syllabus");
const { RTU_SEM5_SUBJECTS } = require("../data/rtuSem5Syllabus");

const ROMAN = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI",
  7: "VII",
  8: "VIII",
};

let seeding = null;

function semesterLabel(n) {
  return `Semester ${ROMAN[n] || n}`;
}

function topicResourcesFromVideos(videos = [], unit, subjectName) {
  if (!videos.length) return [];
  return videos
    .filter((v) => v.videoId || v.url)
    .map((v) => ({
      kind: "youtube",
      title: v.title || `${unit.title} lecture`,
      description: v.channelTitle || "",
      url: v.url || (v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : null),
      videoId: v.videoId || null,
      active: true,
    }));
}

function buildUnits(units = []) {
  return (units || []).map((unit) => {
    const topicTitles = (unit.topics || []).map((t) => (typeof t === "string" ? t : t.title)).filter(Boolean);
    const lectureResources = topicResourcesFromVideos(unit.videos || [], unit);
    const topics = topicTitles.map((title, order) => ({
      title,
      order,
      resources: [],
    }));

    if (lectureResources.length) {
      topics.push({
        title: "Video lectures",
        order: topics.length,
        resources: lectureResources,
      });
    }

    return {
      unitNumber: unit.unitNumber || 1,
      title: unit.title,
      topics,
    };
  });
}

function collectFromCatalog() {
  const subjects = [];
  Object.entries(SYLLABUS_CATALOG).forEach(([name, data]) => {
    subjects.push({
      semester: data.semester || 4,
      name,
      code: data.code || name.slice(0, 8).toUpperCase(),
      short: "",
      scheme: "rtu",
      branch: "CSE",
      course: "B.Tech",
      units: buildUnits(data.units || []),
      active: true,
    });
  });
  return subjects;
}

function collectArya() {
  return ARYA_SEM3_SUBJECTS.map((s) => ({
    semester: 3,
    name: s.name,
    code: s.code,
    short: s.short || "",
    scheme: "arya",
    branch: "CSE",
    course: "B.Tech",
    units: buildUnits(s.units || []),
    active: true,
  }));
}

function collectRtuSem5() {
  return RTU_SEM5_SUBJECTS.map((s) => ({
    semester: 5,
    name: s.name,
    code: s.code,
    short: s.short || "",
    scheme: "rtu",
    // COMMON cores (AOA/CG/CD/OS) visible to CSE · AIDS · IT via branchScope
    branch: s.branch || "CSE",
    course: "B.Tech",
    units: buildUnits(s.units || []),
    active: true,
  }));
}

async function collectFromSyllabusCollection() {
  try {
    const docs = await Syllabus.find().lean();
    return docs.map((s) => ({
      semester: s.semester,
      name: s.subjectName,
      code: s.subjectCode,
      short: "",
      scheme: "rtu",
      branch: "CSE",
      course: "B.Tech",
      units: buildUnits(s.units || []),
      active: true,
    }));
  } catch {
    return [];
  }
}

function mergeSubjects(...lists) {
  const map = new Map();
  for (const list of lists) {
    for (const subject of list) {
      const key = `${subject.semester}::${String(subject.branch || "CSE").toUpperCase()}::${String(subject.code).toUpperCase()}`;
      const prev = map.get(key);
      if (!prev) {
        map.set(key, subject);
        continue;
      }
      // Prefer the version with more units/topics/resources
      const score = (s) =>
        (s.units || []).reduce(
          (n, u) => n + (u.topics || []).length + (u.topics || []).reduce((m, t) => m + (t.resources || []).length, 0),
          0
        );
      if (score(subject) > score(prev)) map.set(key, subject);
    }
  }
  return Array.from(map.values());
}

async function syncCuratedForSubject(subjectDoc) {
  for (const unit of subjectDoc.units || []) {
    for (const topic of unit.topics || []) {
      for (const resource of topic.resources || []) {
        if (resource.kind !== "youtube" && resource.kind !== "gfg" && resource.kind !== "link") continue;
        if (!resource.url && !resource.videoId) continue;
        const sourceKey = `curriculum:${subjectDoc._id}:${unit._id}:${topic._id}:${resource._id}`;
        const videoId = resource.videoId || null;
        const url =
          resource.url || (videoId ? `https://www.youtube.com/watch?v=${videoId}` : null);
        const curated = await CuratedResource.findOneAndUpdate(
          { sourceKey },
          {
            $set: {
              kind: resource.kind === "gfg" || resource.kind === "link" ? "gfg" : "youtube",
              title: resource.title,
              subject: subjectDoc.name,
              semester: subjectDoc.semester,
              unitNumber: unit.unitNumber,
              unitTitle: unit.title,
              tags: [topic.title.toLowerCase(), subjectDoc.name.toLowerCase()],
              channelTitle: resource.description || "Curated",
              url,
              videoId,
              thumbnailUrl: videoId ? `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg` : null,
              sourceKey,
              active: true,
            },
          },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        resource.curatedResourceId = curated._id;
      }
    }
  }
  await subjectDoc.save();
}

/**
 * Import hardcoded / legacy syllabus into Curriculum* collections.
 * Safe by default: skips if subjects already exist unless force=true.
 */
async function seedCurriculum({ force = false } = {}) {
  if (seeding) return seeding;

  seeding = (async () => {
    const existing = await CurriculumSubject.estimatedDocumentCount();
    if (existing > 0 && !force) {
      return { seeded: false, subjects: existing, semesters: await CurriculumSemester.estimatedDocumentCount() };
    }

    if (force) {
      await CurriculumSubject.deleteMany({});
      await CurriculumSemester.deleteMany({});
    }

    const fromDb = await collectFromSyllabusCollection();
    const subjects = mergeSubjects(
      collectFromCatalog(),
      collectArya(),
      collectRtuSem5(),
      fromDb
    );

    const semesterNumbers = [...new Set(subjects.map((s) => s.semester).filter(Boolean))].sort(
      (a, b) => a - b
    );

    for (const number of semesterNumbers) {
      await CurriculumSemester.findOneAndUpdate(
        { number },
        {
          $setOnInsert: {
            number,
            label: semesterLabel(number),
            description: "Imported from Medha syllabus catalog",
            active: true,
          },
        },
        { upsert: true }
      );
    }

    let inserted = 0;
    for (const subject of subjects) {
      const doc = await CurriculumSubject.findOneAndUpdate(
        { semester: subject.semester, code: subject.code },
        {
          $set: {
            ...subject,
            updatedAt: new Date(),
          },
          $setOnInsert: { createdAt: new Date() },
        },
        { upsert: true, new: true }
      );
      try {
        await syncCuratedForSubject(doc);
      } catch (err) {
        console.warn("Curated sync for", subject.code, err.message);
      }
      inserted += 1;
    }

    console.log(
      `📚 Curriculum seeded: ${inserted} subjects across ${semesterNumbers.length} semesters`
    );
    return {
      seeded: true,
      subjects: inserted,
      semesters: semesterNumbers.length,
      semesterNumbers,
    };
  })().finally(() => {
    seeding = null;
  });

  return seeding;
}

module.exports = {
  seedCurriculum,
  collectFromCatalog,
  mergeSubjects,
};
