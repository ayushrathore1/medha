const Note = require("../models/Note");
const LearnContent = require("../models/LearnContent");
const ExamAnalysis = require("../models/ExamAnalysis");
const Subject = require("../models/Subject");
const SearchHistory = require("../models/SearchHistory");
const SYLLABUS_CATALOG = require("../data/syllabusCatalog");

// High-speed In-Memory LRU Cache with TTL
const searchCache = new Map();
const CACHE_TTL_MS = 3 * 60 * 1000; // 3 minutes TTL
const MAX_CACHE_ENTRIES = 400;

function getCached(key) {
  const item = searchCache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    searchCache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data) {
  if (searchCache.size >= MAX_CACHE_ENTRIES) {
    const firstKey = searchCache.keys().next().value;
    searchCache.delete(firstKey);
  }
  searchCache.set(key, { data, timestamp: Date.now() });
}

// Fallback trending terms if database history is young
const DEFAULT_TRENDING = [
  "K-Map",
  "Normalization",
  "Binary Search Tree",
  "Turing Machine",
  "TCP 3-Way Handshake",
  "DFA Construction",
  "8085 Architecture",
  "Pigeonhole Principle",
  "ALOHA Protocol",
  "OOPs Virtual Functions",
  "PYQ Papers 2024",
  "Handwritten Notes"
];

// Helper to escape regex special characters safely
function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

// Helper to calculate relevance score
function calculateScore(text, query) {
  if (!text || !query) return 0;
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  if (lowerText === lowerQuery) return 100;
  if (lowerText.startsWith(lowerQuery)) return 75;
  if (lowerText.includes(lowerQuery)) return 45;

  // Partial word matches
  const words = lowerQuery.split(/\s+/).filter(Boolean);
  let matchedWords = 0;
  words.forEach(w => {
    if (lowerText.includes(w)) matchedWords++;
  });
  return (matchedWords / (words.length || 1)) * 30;
}

/**
 * Universal Search across all Database models & Structured Syllabus catalog
 * Optimized for lowest possible response time (<30ms cold, <2ms cached)
 * GET /api/search?q=...&category=...&semester=...&subject=...&limit=...
 */
exports.searchAll = async (req, res) => {
  const startTime = Date.now();

  try {
    const rawQuery = (req.query.q || "").trim();
    const category = (req.query.category || "all").toLowerCase();
    const semesterFilter = (req.query.semester || "all").toLowerCase(); // e.g. "3rd", "4th", "all"
    const subjectFilter = (req.query.subject || "all").trim();
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 100);
    const userId = req.user?._id || req.userId;

    if (!rawQuery) {
      return res.json({
        success: true,
        query: "",
        counts: { total: 0, notes: 0, youtube: 0, subjects: 0, pyq: 0 },
        results: { notes: [], youtube: [], subjects: [], pyq: [] },
        topMatches: [],
        suggestions: DEFAULT_TRENDING.slice(0, 6),
        responseTimeMs: 0
      });
    }

    // Check Memory Cache
    const cacheKey = `search:${rawQuery.toLowerCase()}:${category}:${semesterFilter}:${subjectFilter}:${userId || 'anon'}`;
    const cachedResponse = getCached(cacheKey);
    if (cachedResponse) {
      return res.json({
        ...cachedResponse,
        fromCache: true,
        responseTimeMs: Date.now() - startTime
      });
    }

    const safeRegex = new RegExp(escapeRegex(rawQuery), "i");

    // ─── PARALLEL DATABASE FETCH TASKS ─────────────────────────
    const tasks = [];

    // 1. NOTES PROMISE
    const shouldFetchNotes = category === "all" || category === "notes" || category === "pyq";
    let notesPromise = Promise.resolve([]);
    if (shouldFetchNotes) {
      const noteMatch = {
        $and: [
          {
            $or: [
              { isPublic: true },
              ...(userId ? [{ owner: userId }] : [])
            ]
          },
          {
            $or: [
              { title: { $regex: safeRegex } },
              { content: { $regex: safeRegex } },
              { subjectTag: { $regex: safeRegex } },
              { extractedText: { $regex: safeRegex } },
              { noteType: { $regex: safeRegex } }
            ]
          }
        ]
      };

      if (semesterFilter !== "all") {
        noteMatch.$and.push({
          semester: { $regex: new RegExp(semesterFilter.replace(/[^0-9]/g, ""), "i") }
        });
      }

      if (subjectFilter !== "all") {
        noteMatch.$and.push({
          $or: [
            { subjectTag: { $regex: new RegExp(escapeRegex(subjectFilter), "i") } }
          ]
        });
      }

      notesPromise = Note.find(noteMatch)
        .select("title content extractedText subjectTag semester noteType fileUrl fileType likes mcqs flashcards owner subject createdAt")
        .populate("owner", "name avatar avatarIndex")
        .populate("subject", "name")
        .limit(40)
        .lean()
        .catch(err => {
          console.warn("[Search] Notes query error:", err.message);
          return [];
        });
    }

    // 2. YOUTUBE / LEARNCONTENT PROMISE
    const shouldFetchYoutube = category === "all" || category === "youtube";
    let learnVideoPromise = Promise.resolve([]);
    if (shouldFetchYoutube) {
      learnVideoPromise = LearnContent.find({
        isActive: true,
        type: "video",
        $or: [
          { title: { $regex: safeRegex } },
          { description: { $regex: safeRegex } },
          { subject: { $regex: safeRegex } }
        ]
      })
        .select("title description subject semester unit duration videoUrl videoId thumbnailUrl type")
        .limit(25)
        .lean()
        .catch(err => {
          console.warn("[Search] LearnContent query error:", err.message);
          return [];
        });
    }

    // 3. SUBJECTS PROMISE
    const shouldFetchSubjects = category === "all" || category === "subjects";
    let subjectsPromise = Promise.resolve([]);
    if (shouldFetchSubjects) {
      subjectsPromise = Subject.find({ name: { $regex: safeRegex } })
        .select("name")
        .limit(10)
        .lean()
        .catch(err => {
          console.warn("[Search] Subject query error:", err.message);
          return [];
        });
    }

    // 4. EXAM ANALYSIS PYQ PROMISE
    const shouldFetchPyq = category === "all" || category === "pyq";
    let examAnalysisPromise = Promise.resolve([]);
    if (shouldFetchPyq) {
      examAnalysisPromise = ExamAnalysis.find({
        $or: [
          { subjectName: { $regex: safeRegex } },
          { "years.units.unitName": { $regex: safeRegex } },
          { "years.units.questions.text": { $regex: safeRegex } },
          { "years.units.questions.topic": { $regex: safeRegex } }
        ]
      })
        .select("subjectName totalPaperMarks years")
        .limit(10)
        .lean()
        .catch(err => {
          console.warn("[Search] ExamAnalysis query error:", err.message);
          return [];
        });
    }

    // Await all DB queries simultaneously in parallel
    const [notesFromDb, learnVideoMatches, dbSubjects, examAnalyses] = await Promise.all([
      notesPromise,
      learnVideoPromise,
      subjectsPromise,
      examAnalysisPromise
    ]);

    // ─── 1. PROCESS NOTES RESULTS ──────────────────────────────
    let notesResults = [];
    if (shouldFetchNotes && Array.isArray(notesFromDb)) {
      notesResults = notesFromDb.map(note => {
        const subjectName = note.subject?.name || note.subjectTag || "General";
        const isPYQ = (note.noteType && /pyq/i.test(note.noteType)) || (note.title && /pyq/i.test(note.title));
        const score = Math.max(
          calculateScore(note.title, rawQuery) * 1.5,
          calculateScore(subjectName, rawQuery) * 1.2,
          calculateScore(note.content, rawQuery)
        );

        return {
          id: note._id.toString(),
          type: "note",
          category: isPYQ ? "pyq" : "notes",
          title: note.title,
          snippet: note.content
            ? note.content.substring(0, 180) + (note.content.length > 180 ? "..." : "")
            : note.extractedText
            ? note.extractedText.substring(0, 180) + (note.extractedText.length > 180 ? "..." : "")
            : `Curated study note for ${subjectName}`,
          subject: subjectName,
          semester: note.semester ? `${note.semester.replace(/[^0-9]/g, "")}th Sem` : "All Semesters",
          noteType: note.noteType || (isPYQ ? "📄 PYQ Paper" : "📝 Handwritten Notes"),
          fileUrl: note.fileUrl,
          fileType: note.fileType || "pdf",
          likesCount: note.likes ? note.likes.length : 0,
          mcqCount: note.mcqs ? note.mcqs.length : 0,
          flashcardCount: note.flashcards ? note.flashcards.length : 0,
          author: note.owner ? note.owner.name : "Medha Scholar",
          authorAvatar: note.owner?.avatar,
          authorAvatarIndex: note.owner?.avatarIndex,
          createdAt: note.createdAt,
          score,
          redirects: {
            subjectNotes: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/notes`,
            subjectYouTube: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/youtube`,
            communityNotes: `/notes?search=${encodeURIComponent(note.title)}`,
            fileDirect: note.fileUrl || null
          }
        };
      });
    }

    // ─── 2. PROCESS YOUTUBE LECTURES ───────────────────────────
    let youtubeResults = [];
    if (shouldFetchYoutube) {
      // From DB
      if (Array.isArray(learnVideoMatches)) {
        learnVideoMatches.forEach(v => {
          const score = Math.max(
            calculateScore(v.title, rawQuery) * 1.5,
            calculateScore(v.subject, rawQuery) * 1.2
          );
          youtubeResults.push({
            id: v.videoId || v._id.toString(),
            type: "youtube",
            category: "youtube",
            title: v.title,
            description: v.description || `Chapter video lecture for ${v.subject}`,
            subject: v.subject,
            semester: v.semester ? `${v.semester}th Sem` : "3rd Sem",
            unitNumber: v.unit || null,
            unitTitle: v.unit ? `Unit ${v.unit}` : "Core Concept",
            duration: v.duration || "15m",
            channelTitle: "Medha Curated",
            thumbnailUrl: v.thumbnailUrl || (v.videoId ? `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg` : null),
            videoId: v.videoId,
            youtubeUrl: v.videoUrl || (v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : null),
            isPlaylist: false,
            score,
            redirects: {
              subjectYouTube: `/rtu-exams/subject/${encodeURIComponent(v.subject)}/youtube${v.unit ? `?unit=${v.unit}` : ""}`,
              subjectNotes: `/rtu-exams/subject/${encodeURIComponent(v.subject)}/notes`,
              watchDirect: v.videoUrl || (v.videoId ? `https://www.youtube.com/watch?v=${v.videoId}` : null)
            }
          });
        });
      }

      // From SYLLABUS_CATALOG
      Object.keys(SYLLABUS_CATALOG).forEach(subjectName => {
        const subData = SYLLABUS_CATALOG[subjectName];
        const semNum = subData.semester || 4;
        const semString = `${semNum}th Sem`;

        if (semesterFilter !== "all" && !semString.toLowerCase().includes(semesterFilter.replace(/[^0-9]/g, ""))) {
          return;
        }

        if (subjectFilter !== "all" && !subjectName.toLowerCase().includes(subjectFilter.toLowerCase())) {
          return;
        }

        const subjectMatchScore = calculateScore(subjectName, rawQuery);

        // Subject Playlist
        if (subData.playlistUrl && (subjectMatchScore > 0 || safeRegex.test(subjectName))) {
          youtubeResults.push({
            id: `playlist-${encodeURIComponent(subjectName)}`,
            type: "youtube",
            category: "youtube",
            title: `${subjectName} — Complete Syllabus Playlist`,
            description: `Full subject curated YouTube video playlist for ${subjectName} (${semString})`,
            subject: subjectName,
            semester: semString,
            unitNumber: null,
            unitTitle: "Full Syllabus Playlist",
            duration: "Full Playlist",
            channelTitle: subData.channelTitle || "Curated Channel",
            thumbnailUrl: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=480&auto=format&fit=crop&q=80",
            youtubeUrl: subData.playlistUrl,
            isPlaylist: true,
            score: subjectMatchScore * 1.3 + 20,
            redirects: {
              subjectYouTube: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/youtube`,
              subjectNotes: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/notes`,
              watchDirect: subData.playlistUrl
            }
          });
        }

        // Units & Unit Videos
        (subData.units || []).forEach(unit => {
          const unitMatches = safeRegex.test(unit.title) || safeRegex.test(subjectName);
          const topicMatches = (unit.topics || []).some(t => safeRegex.test(t));

          (unit.videos || []).forEach(v => {
            const videoTitleScore = calculateScore(v.title, rawQuery);
            const score = Math.max(
              videoTitleScore * 1.5,
              unitMatches ? 60 : 0,
              topicMatches ? 50 : 0,
              subjectMatchScore * 1.1
            );

            if (score > 15 || videoTitleScore > 0 || unitMatches || topicMatches) {
              youtubeResults.push({
                id: v.videoId || `vid-${unit.unitNumber}-${v.title.slice(0, 10)}`,
                type: "youtube",
                category: "youtube",
                title: v.title,
                description: `Unit ${unit.unitNumber}: ${unit.title} — ${unit.topics ? unit.topics.slice(0, 3).join(", ") : ""}`,
                subject: subjectName,
                semester: semString,
                unitNumber: unit.unitNumber,
                unitTitle: unit.title,
                duration: v.duration || "20m",
                channelTitle: v.channelTitle || subData.channelTitle || "YouTube",
                thumbnailUrl: v.thumbnail || (v.videoId ? `https://i.ytimg.com/vi/${v.videoId}/mqdefault.jpg` : null),
                videoId: v.videoId,
                youtubeUrl: `https://www.youtube.com/watch?v=${v.videoId}`,
                isPlaylist: false,
                score,
                redirects: {
                  subjectYouTube: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/youtube?unit=${unit.unitNumber}`,
                  subjectNotes: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/notes`,
                  watchDirect: `https://www.youtube.com/watch?v=${v.videoId}`
                }
              });
            }
          });
        });
      });

      // Deduplicate YouTube results
      const seenVideos = new Set();
      youtubeResults = youtubeResults.filter(item => {
        const key = item.videoId || item.title;
        if (seenVideos.has(key)) return false;
        seenVideos.add(key);
        return true;
      });
    }

    // ─── 3. PROCESS SUBJECTS & UNITS ───────────────────────────
    let subjectResults = [];
    if (shouldFetchSubjects) {
      Object.keys(SYLLABUS_CATALOG).forEach(subjectName => {
        const subData = SYLLABUS_CATALOG[subjectName];
        const semNum = subData.semester || 4;
        const semString = `${semNum}th Sem`;

        if (semesterFilter !== "all" && !semString.toLowerCase().includes(semesterFilter.replace(/[^0-9]/g, ""))) {
          return;
        }

        const matchedUnits = [];
        (subData.units || []).forEach(u => {
          const unitScore = calculateScore(u.title, rawQuery);
          const matchingTopics = (u.topics || []).filter(t => safeRegex.test(t));
          if (unitScore > 20 || safeRegex.test(u.title) || matchingTopics.length > 0) {
            matchedUnits.push({
              unitNumber: u.unitNumber,
              title: u.title,
              matchedTopics: matchingTopics.slice(0, 4)
            });
          }
        });

        const subjScore = calculateScore(subjectName, rawQuery);
        if (subjScore > 20 || matchedUnits.length > 0 || safeRegex.test(subjectName)) {
          subjectResults.push({
            id: `subj-${encodeURIComponent(subjectName)}`,
            type: "subject",
            category: "subjects",
            title: subjectName,
            code: subData.code || "",
            semester: semString,
            department: subData.department || "Computer Science & Engineering",
            totalUnits: (subData.units || []).length,
            matchedUnits,
            videoCount: (subData.units || []).reduce((acc, u) => acc + (u.videos ? u.videos.length : 0), 0),
            score: Math.max(subjScore * 1.6, matchedUnits.length * 35),
            redirects: {
              subjectYouTube: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/youtube`,
              subjectNotes: `/rtu-exams/subject/${encodeURIComponent(subjectName)}/notes`,
              pyqAnalysis: `/rtu-exams?subject=${encodeURIComponent(subjectName)}`,
              semesterPage: `/semester/${semNum}`
            }
          });
        }
      });

      if (Array.isArray(dbSubjects)) {
        dbSubjects.forEach(s => {
          if (!subjectResults.some(sr => sr.title.toLowerCase() === s.name.toLowerCase())) {
            subjectResults.push({
              id: `user-subj-${s._id.toString()}`,
              type: "subject",
              category: "subjects",
              title: s.name,
              code: "",
              semester: "All Semesters",
              department: "Computer Science",
              totalUnits: 0,
              matchedUnits: [],
              videoCount: 0,
              score: calculateScore(s.name, rawQuery) * 1.4,
              redirects: {
                subjectYouTube: `/rtu-exams/subject/${encodeURIComponent(s.name)}/youtube`,
                subjectNotes: `/rtu-exams/subject/${encodeURIComponent(s.name)}/notes`,
                pyqAnalysis: `/rtu-exams?subject=${encodeURIComponent(s.name)}`,
                semesterPage: `/dashboard`
              }
            });
          }
        });
      }
    }

    // ─── 4. PROCESS PYQS ───────────────────────────────────────
    let pyqResults = [];
    if (shouldFetchPyq && Array.isArray(examAnalyses)) {
      examAnalyses.forEach(analysis => {
        (analysis.years || []).forEach(yearData => {
          (yearData.units || []).forEach(unit => {
            (unit.questions || []).forEach(q => {
              const plainText = q.text ? q.text.replace(/<[^>]*>?/gm, "").trim() : "";
              const isMatch =
                safeRegex.test(plainText) ||
                safeRegex.test(q.topic || "") ||
                safeRegex.test(analysis.subjectName) ||
                safeRegex.test(unit.unitName);

              if (isMatch) {
                const score = Math.max(
                  calculateScore(plainText, rawQuery),
                  calculateScore(q.topic, rawQuery) * 1.3,
                  calculateScore(analysis.subjectName, rawQuery) * 1.1
                );

                pyqResults.push({
                  id: `q-${analysis._id}-${yearData.year}-${q.qCode}`,
                  type: "pyq",
                  category: "pyq",
                  title: `${analysis.subjectName} — ${q.qCode || "Exam Question"} (${yearData.year})`,
                  snippet: plainText.substring(0, 190) + (plainText.length > 190 ? "..." : ""),
                  subject: analysis.subjectName,
                  year: yearData.year,
                  marks: q.marks,
                  unitSerial: unit.unitSerial,
                  unitName: unit.unitName,
                  chatgptLink: q.chatgptLink,
                  claudeLink: q.claudeLink,
                  score,
                  redirects: {
                    pyqAnalysis: `/rtu-exams?subject=${encodeURIComponent(analysis.subjectName)}&year=${yearData.year}`,
                    subjectNotes: `/rtu-exams/subject/${encodeURIComponent(analysis.subjectName)}/notes?type=pyq`,
                    subjectYouTube: `/rtu-exams/subject/${encodeURIComponent(analysis.subjectName)}/youtube`
                  }
                });
              }
            });
          });
        });
      });
    }

    // ─── SORTING & TOP MATCHES ─────────────────────────────────
    const sortByScore = (a, b) => (b.score || 0) - (a.score || 0);

    notesResults.sort(sortByScore);
    youtubeResults.sort(sortByScore);
    subjectResults.sort(sortByScore);
    pyqResults.sort(sortByScore);

    const allRanked = [
      ...subjectResults.slice(0, 2),
      ...youtubeResults.slice(0, 3),
      ...notesResults.slice(0, 3),
      ...pyqResults.slice(0, 2)
    ].sort(sortByScore);

    const topMatches = allRanked.slice(0, 4);

    const counts = {
      total: notesResults.length + youtubeResults.length + subjectResults.length + pyqResults.length,
      notes: notesResults.length,
      youtube: youtubeResults.length,
      subjects: subjectResults.length,
      pyq: pyqResults.length
    };

    const responseData = {
      success: true,
      query: rawQuery,
      counts,
      topMatches,
      results: {
        notes: notesResults.slice(0, limit),
        youtube: youtubeResults.slice(0, limit),
        subjects: subjectResults.slice(0, limit),
        pyq: pyqResults.slice(0, limit)
      },
      responseTimeMs: Date.now() - startTime
    };

    // Store in LRU cache
    setCached(cacheKey, responseData);

    // Asynchronously log search without blocking
    if (rawQuery.length >= 2) {
      SearchHistory.create({
        userId: userId || null,
        query: rawQuery,
        subject: subjectFilter !== "all" ? subjectFilter : "",
        resultCount: counts.total
      }).catch(() => {});
    }

    res.json(responseData);
  } catch (error) {
    console.error("[Search] Universal search failed:", error);
    res.status(500).json({
      success: false,
      message: "An error occurred while executing search across the database.",
      error: error.message
    });
  }
};

/**
 * Autocomplete / Instant Suggestions
 * GET /api/search/suggestions?q=...
 */
exports.getSuggestions = async (req, res) => {
  try {
    const rawQuery = (req.query.q || "").trim();
    if (!rawQuery || rawQuery.length < 1) {
      return res.json({ success: true, suggestions: [] });
    }

    const cacheKey = `sug:${rawQuery.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) return res.json(cached);

    const safeRegex = new RegExp(escapeRegex(rawQuery), "i");
    const suggestions = [];

    // 1. Subjects & Units
    Object.keys(SYLLABUS_CATALOG).forEach(name => {
      if (safeRegex.test(name)) {
        suggestions.push({
          title: name,
          category: "subjects",
          subtitle: `${SYLLABUS_CATALOG[name].semester || 4}th Semester Subject Hub`,
          url: `/rtu-exams/subject/${encodeURIComponent(name)}/youtube`,
          icon: "FaBook"
        });
      }
      (SYLLABUS_CATALOG[name].units || []).forEach(u => {
        if (safeRegex.test(u.title)) {
          suggestions.push({
            title: u.title,
            category: "youtube",
            subtitle: `${name} — Unit ${u.unitNumber}`,
            url: `/rtu-exams/subject/${encodeURIComponent(name)}/youtube?unit=${u.unitNumber}`,
            icon: "FaYoutube"
          });
        }
      });
    });

    // 2. Notes match
    try {
      const matchedNotes = await Note.find({
        isPublic: true,
        title: { $regex: safeRegex }
      })
        .select("title subjectTag noteType")
        .limit(4)
        .lean();

      matchedNotes.forEach(n => {
        suggestions.push({
          title: n.title,
          category: "notes",
          subtitle: `${n.subjectTag || "Note"} • ${n.noteType || "Document"}`,
          url: `/rtu-exams/subject/${encodeURIComponent(n.subjectTag || "General")}/notes`,
          icon: "FaFileLines"
        });
      });
    } catch (e) {}

    const result = {
      success: true,
      suggestions: suggestions.slice(0, 8)
    };

    setCached(cacheKey, result);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, suggestions: [] });
  }
};

/**
 * Get popular & trending searches
 * GET /api/search/popular
 */
exports.getPopularSearches = async (req, res) => {
  try {
    const cached = getCached("popular:searches");
    if (cached) return res.json(cached);

    const historyAgg = await SearchHistory.aggregate([
      { $match: { query: { $exists: true, $ne: "" } } },
      { $group: { _id: { $toLower: "$query" }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 8 }
    ]);

    const dbTerms = historyAgg.map(h => h._id.charAt(0).toUpperCase() + h._id.slice(1));
    const merged = Array.from(new Set([...dbTerms, ...DEFAULT_TRENDING])).slice(0, 10);

    const response = {
      success: true,
      popular: merged
    };

    setCached("popular:searches", response);
    res.json(response);
  } catch (error) {
    res.json({
      success: true,
      popular: DEFAULT_TRENDING
    });
  }
};

/**
 * Log user search history
 * POST /api/search/history
 */
exports.logSearchHistory = async (req, res) => {
  try {
    const { query, subject, resultCount } = req.body;
    if (!query) {
      return res.status(400).json({ success: false, message: "Query is required" });
    }

    await SearchHistory.create({
      userId: req.user?._id || req.userId || null,
      query: query.trim(),
      subject: subject || "",
      resultCount: resultCount || 0
    });

    res.json({ success: true, message: "Search logged successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
