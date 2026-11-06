// controllers/noteController.js
const Note = require("../models/Note");
const User = require("../models/User");
const mongoose = require("mongoose");
const notifications = require("./notificationController");
const fs = require("fs");
const path = require("path");
const { uploadToCloudinary, CLOUDINARY_MAX_BYTES } = require("../utils/cloudinaryUpload");
const { compressPdfIfNeeded } = require("../utils/pdfCompressor");
const { enqueueNoteScan } = require("../utils/noteScanWorker");
const { sendNotePipelineEmail } = require("../utils/noteEmails");
const {
  parseNoteListQuery,
  keysetFilter,
  previewContent,
  paginationMeta,
  escapeRegex,
} = require("../utils/notePagination");

const NOTE_LIST_SELECT = [
  "title",
  "subjectTag",
  "fileUrl",
  "fileType",
  "originalName",
  "likes",
  "isPublic",
  "createdAt",
  "downloadCount",
  "verificationStatus",
  "semester",
  "noteType",
  "owner",
  "subject",
  "content",
].join(" ");

function removeLocalFile(filePath) {
  if (!filePath) return;
  fs.unlink(filePath, (err) => {
    if (err && err.code !== "ENOENT") {
      console.warn("[Upload] Failed to remove temp file:", err.message);
    }
  });
}

const AURA_PER_DOWNLOAD = 3;

// List user's own notes (optionally filtered by subject)
exports.getNotes = async (req, res) => {
  try {
    const paging = parseNoteListQuery(req.query);
    if (paging.error) {
      return res.status(400).json({ error: paging.error });
    }

    const { subject } = req.query;
    const filter = { owner: req.user._id };

    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({ error: "Invalid subject ID format." });
      }
      filter.subject = subject;
    }

    const cursorFilter = keysetFilter(paging.cursor);
    if (cursorFilter) {
      filter.$and = [cursorFilter];
    }

    let query = Note.find(filter)
      .select(NOTE_LIST_SELECT)
      .sort({ createdAt: -1, _id: -1 })
      .limit(paging.limit + 1);

    if (!paging.cursor) {
      query = query.skip((paging.page - 1) * paging.limit);
    }

    const rows = await query
      .populate("owner", "name email")
      .populate("subject", "name");

    const hasMore = rows.length > paging.limit;
    const notes = rows.slice(0, paging.limit).map((note) => {
      const obj = note.toObject();
      obj.content = previewContent(obj.content);
      return obj;
    });

    res.json({
      notes,
      pagination: paginationMeta({
        notes,
        limit: paging.limit,
        page: paging.page,
        hasMore,
      }),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all public notes (for explore/discover feature)
exports.getPublicNotes = async (req, res) => {
  try {
    const paging = parseNoteListQuery(req.query);
    if (paging.error) {
      return res.status(400).json({ error: paging.error });
    }

    const { search, subject, semester, noteType } = req.query;
    // Only fully approved public notes are discoverable
    const match = { isPublic: true, verificationStatus: "approved" };

    if (subject) {
      if (!mongoose.Types.ObjectId.isValid(subject)) {
        return res.status(400).json({ error: "Invalid subject ID format." });
      }
      match.subject = new mongoose.Types.ObjectId(subject);
    }
    if (semester) match.semester = semester;
    if (noteType) {
      match.noteType =
        noteType === "pyq"
          ? { $regex: /pyq/i }
          : { $regex: new RegExp(escapeRegex(noteType), "i") };
    }

    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      const owners = await User.find({
        $or: [{ name: regex }, { email: regex }],
      })
        .select("_id")
        .limit(50)
        .lean();

      match.$or = [
        { title: regex },
        { content: regex },
        { subjectTag: regex },
        { owner: { $in: owners.map((user) => user._id) } },
      ];
    }

    const cursorFilter = keysetFilter(paging.cursor);
    const filter = cursorFilter ? { $and: [match, cursorFilter] } : match;

    const pipeline = [
      { $match: filter },
      { $sort: { createdAt: -1, _id: -1 } },
    ];

    if (!paging.cursor) {
      pipeline.push({ $skip: (paging.page - 1) * paging.limit });
    }

    pipeline.push(
      { $limit: paging.limit + 1 },
      {
        $lookup: {
          from: "users",
          localField: "owner",
          foreignField: "_id",
          as: "ownerData",
        },
      },
      { $unwind: { path: "$ownerData", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "subjects",
          localField: "subject",
          foreignField: "_id",
          as: "subjectData",
        },
      },
      { $unwind: { path: "$subjectData", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          title: 1,
          content: { $substrCP: [{ $ifNull: ["$content", ""] }, 0, 240] },
          subjectTag: 1,
          fileUrl: 1,
          fileType: 1,
          originalName: 1,
          likes: 1,
          isPublic: 1,
          createdAt: 1,
          downloadCount: 1,
          verificationStatus: 1,
          semester: 1,
          noteType: 1,
          owner: {
            _id: "$ownerData._id",
            name: "$ownerData.name",
            email: "$ownerData.email",
            avatar: "$ownerData.avatar",
          },
          subject: {
            _id: "$subjectData._id",
            name: "$subjectData.name",
          },
        },
      }
    );

    const rows = await Note.aggregate(pipeline);
    const hasMore = rows.length > paging.limit;
    const notes = rows.slice(0, paging.limit);

    res.json({
      notes,
      pagination: paginationMeta({
        notes,
        limit: paging.limit,
        page: paging.page,
        hasMore,
      }),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle note visibility (public/private)
exports.toggleVisibility = async (req, res) => {
  try {
    const { noteId } = req.params;

    const note = await Note.findOne({ _id: noteId, owner: req.user._id });
    if (!note) {
      return res.status(404).json({ error: "Note not found or not owned by you." });
    }

    if (note.verificationStatus === "rejected" && !note.isPublic) {
      // Allow re-publishing attempt
    }

    const makingPublic = !note.isPublic;
    note.isPublic = makingPublic;

    if (makingPublic) {
      note.verificationStatus = "pending";
      note.pipelineStage = "queued";
      note.scanAttempts = 0;
      note.emailsSent = { live: false, rejected: false };
      note.verificationReason = "";
      await note.save();
      await enqueueNoteScan(note._id, { immediate: true });
      return res.json({
        message: "Note is now public. It will appear for everyone after review.",
        note,
      });
    }

    // Going private: stop public pipeline; owner-only access
    note.verificationStatus = "approved";
    note.pipelineStage = "none";
    note.scanLockUntil = null;
    await note.save();

    res.json({
      message: "Note is now private. Only you can see it.",
      note,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Instant upload: size/type only. No AI on the request path.
 * - Private → approved immediately (owner-only)
 * - Public → pending + background compress / Cloudinary / Groq / team
 */
exports.uploadNote = async (req, res) => {
  const localFilePath = req.file?.path;
  let persistLocalFile = false;
  let compressCleanup = null;

  try {
    const { title, subject, subjectTag, isPublic, semester, noteType } = req.body;
    const owner = req.user._id;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!subject && !subjectTag) {
      return res.status(400).json({ error: "Subject or subject tag is required." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded." });
    }

    const makePublic = isPublic === "true" || isPublic === true;

    // Compress PDF quickly when possible (non-blocking for AI — still sync but local CPU only)
    let workingPath = localFilePath;
    let workingBytes = file.size;
    try {
      const compressed = await compressPdfIfNeeded(localFilePath, file.originalname);
      workingPath = compressed.path;
      workingBytes = compressed.bytes;
      if (compressed.cleanup) compressCleanup = compressed.cleanup;
    } catch {
      // keep original
    }

    let fileUrl = `/uploads/notes/${file.filename}`;
    let cloudinaryPublicId = null;
    let storedLocally = true;

    // Best-effort Cloudinary now so CDN is ready; failures fall back to disk
    if (workingBytes <= CLOUDINARY_MAX_BYTES) {
      try {
        const result = await uploadToCloudinary(workingPath, file.originalname);
        fileUrl = result.url;
        cloudinaryPublicId = result.publicId;
        storedLocally = false;
      } catch (cloudErr) {
        console.warn("[Upload] Cloudinary deferred/failed:", cloudErr.message);
        fileUrl = `/uploads/notes/${file.filename}`;
        storedLocally = true;
      }
    }

    const noteData = {
      title: title.trim(),
      owner,
      fileUrl,
      fileType: file.mimetype,
      originalName: file.originalname,
      content: req.body.content || "",
      extractedText: "",
      isPublic: makePublic,
      cloudinaryPublicId,
      compressedBytes: workingBytes,
      localFilePath: storedLocally || makePublic ? localFilePath : null,
      downloadCount: 0,
      emailsSent: { live: false, rejected: false },
    };

    if (makePublic) {
      noteData.verificationStatus = "pending";
      noteData.pipelineStage = "queued";
      noteData.nextScanAt = new Date();
      noteData.scanAttempts = 0;
    } else {
      noteData.verificationStatus = "approved";
      noteData.pipelineStage = "none";
      noteData.verificationReason = "Private note — no public review.";
    }

    if (semester) noteData.semester = String(semester).trim();
    if (noteType) noteData.noteType = String(noteType).trim();
    if (subjectTag) noteData.subjectTag = subjectTag.trim();
    else if (subject) noteData.subject = subject;

    const note = new Note(noteData);
    await note.save();
    persistLocalFile = Boolean(note.localFilePath);

    await note.populate("owner", "name email avatar");

    if (makePublic) {
      await enqueueNoteScan(note._id, { immediate: true });
    }

    res.status(201).json({
      message: makePublic
        ? "Notes uploaded successfully. They will appear for everyone after a quick review."
        : "Private notes saved. Only you can see them.",
      note,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (compressCleanup && compressCleanup !== localFilePath) {
      removeLocalFile(compressCleanup);
    }
    if (localFilePath && !persistLocalFile) {
      removeLocalFile(localFilePath);
    }
  }
};


// Create a note from pasted text (no file)
exports.createTextNote = async (req, res) => {
  try {
    const { title, content, subject, subjectTag } = req.body;
    const owner = req.user._id;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required." });
    }

    // Support both old subject ObjectId and new subjectTag
    if (!subject && !subjectTag) {
      return res.status(400).json({ error: "Subject or subject tag is required." });
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      owner,
      fileUrl: null,
      fileType: null,
      originalName: null,
      extractedText: content.trim(),
      isPublic: false, // Private by default
    };

    // Set either subject ref or subjectTag
    if (subjectTag) {
      noteData.subjectTag = subjectTag.trim();
    } else if (subject) {
      noteData.subject = subject;
    }

    const note = new Note(noteData);
    await note.save();
    await note.populate("owner", "name email");
    
    res.status(201).json({ message: "Text note created successfully!", note });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update/Edit a note by ID
exports.updateNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const { title, content, subject, subjectTag, isPublic } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required." });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Content is required." });
    }

    // Support both old subject ObjectId and new subjectTag
    if (!subject && !subjectTag) {
      return res.status(400).json({ error: "Subject or subject tag is required." });
    }

    const updateData = {
      title: title.trim(),
      content: content.trim(),
      extractedText: content.trim(),
      updatedAt: new Date(),
    };

    // Set either subject ref or subjectTag
    if (subjectTag) {
      updateData.subjectTag = subjectTag.trim();
      updateData.subject = null; // Clear old subject ref if using tag
    } else if (subject) {
      updateData.subject = subject;
    }
    
    // Only update isPublic if explicitly provided
    if (typeof isPublic === 'boolean') {
      updateData.isPublic = isPublic;
    }

    const updatedNote = await Note.findOneAndUpdate(
      {
        _id: noteId,
        owner: req.user._id,
      },
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("owner", "name email");

    if (!updatedNote) {
      return res.status(404).json({
        error: "Note not found or you don't have permission to update it.",
      });
    }

    res.json({
      message: "Note updated successfully!",
      note: updatedNote,
    });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({
      error: "Server error updating note: " + err.message,
    });
  }
};

// Delete a note by ID
exports.deleteNote = async (req, res) => {
  try {
    const { noteId } = req.params;
    const note = await Note.findOneAndDelete({
      _id: noteId,
      owner: req.user._id,
    });
    if (!note) return res.status(404).json({ error: "Note not found." });
    res.json({ message: "Note deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single note by ID (owner or public)
exports.getNoteById = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user?._id;
    
    let note = null;
    if (userId) {
      note = await Note.findOne({ _id: noteId, owner: userId })
        .populate("owner", "name email")
        .populate("subject", "name");
    }

    if (!note) {
      note = await Note.findOne({
        _id: noteId,
        isPublic: true,
        verificationStatus: "approved",
      })
        .populate("owner", "name email")
        .populate("subject", "name");
    }

    if (!note) return res.status(404).json({ error: "Note not found." });
    const isOwner = userId && String(note.owner?._id || note.owner) === String(userId);
    if (!isOwner && note.verificationStatus !== "approved") {
      return res.status(404).json({ error: "Note not found." });
    }

    const payload = note.toObject();
    if (!userId) {
      payload.fileUrl = null;
    }
    res.json(payload);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Toggle Like on a Note
exports.toggleLike = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(noteId).populate("owner", "name");
    
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    // Check if user already liked this note (using efficient atomic logic check)
    // We check if userId exists in the likes array
    const isLiked = note.likes.some(id => id.toString() === userId.toString());

    if (isLiked) {
      // Unlike: Atomic pull from both Note and User
      await Note.findByIdAndUpdate(noteId, { $pull: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $pull: { likedNotes: noteId } });
      
      // Update local note object for response
      note.likes = note.likes.filter(id => id.toString() !== userId.toString());
      
      return res.json({ 
        success: true, 
        isLiked: false, 
        likesCount: note.likes.length 
      });

    } else {
      // Like: Atomic addToSet to avoid duplicates in both Note and User
      await Note.findByIdAndUpdate(noteId, { $addToSet: { likes: userId } });
      await User.findByIdAndUpdate(userId, { $addToSet: { likedNotes: noteId } });
      
      // Update local note object for response
      note.likes.push(userId);

      // Create notification for owner if not self-like
      if (note.owner && note.owner._id.toString() !== userId.toString()) {
        try {
          const liker = await User.findById(userId).select("name");
          const likerName = liker ? liker.name : "Someone";

          await notifications.createNotification({
             recipient: note.owner._id,
             type: "like",
             title: "New Like",
             message: `${likerName} liked your note "${note.title}"`,
             link: `/notes?view=${note._id}`,
             sender: userId
          });
        } catch (error) {
           console.error("Notification error:", error);
        }
      }

      return res.json({ 
        success: true, 
        isLiked: true, 
        likesCount: note.likes.length 
      });
    }

  } catch (err) {
    console.error("Toggle like error:", err);
    res.status(500).json({ error: err.message });
  }
};

// Record a download and award Aura to the owner (once per downloader)
exports.recordDownload = async (req, res) => {
  try {
    const { noteId } = req.params;
    const userId = req.user._id;

    const note = await Note.findById(noteId);
    if (!note) {
      return res.status(404).json({ error: "Note not found." });
    }

    const isOwner = String(note.owner) === String(userId);
    if (!isOwner) {
      if (!note.isPublic || note.verificationStatus !== "approved") {
        return res.status(404).json({ error: "Note not found." });
      }
    }

    const already = (note.downloadedBy || []).some((id) => String(id) === String(userId));
    let awarded = 0;

    if (!already) {
      note.downloadedBy = note.downloadedBy || [];
      note.downloadedBy.push(userId);
      note.downloadCount = (note.downloadCount || 0) + 1;
      await note.save();

      if (!isOwner) {
        awarded = AURA_PER_DOWNLOAD;
        await User.findByIdAndUpdate(note.owner, { $inc: { auraPoints: awarded } });
      }
    }

    res.json({
      fileUrl: note.fileUrl,
      downloadCount: note.downloadCount,
      awarded,
    });
  } catch (err) {
    console.error("Download record error:", err);
    res.status(500).json({ error: err.message });
  }
};
