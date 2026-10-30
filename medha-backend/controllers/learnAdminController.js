const LearnContent = require("../models/LearnContent");
const { requireAdminOrTeam } = require("../services/learnAccess");

exports.createContent = async (req, res) => {
  try {
    // Check if user is admin or team member
    const user = await requireAdminOrTeam(req, res);
    if (!user) return;

    const {
      subject,
      semester,
      unit,
      title,
      description,
      type,
      videoUrl,
      videoId,
      videoFileId, // ImageKit file ID for deletion
      thumbnailUrl,
      thumbnailFileId,
      duration,
      pdfUrl,
      pdfFileId, // ImageKit file ID for deletion
      pdfThumbnailUrl,
      pageCount,
      // Animation fields
      animationId,
      animationSteps,
      animationCategory,
      animationThumbnailUrl,
      // Audio fields
      audioHindiUrl,
      audioHindiFileId,
      audioEnglishUrl,
      audioEnglishFileId,
      order,
    } = req.body;

    const content = await LearnContent.create({
      subject,
      semester: semester || 3,
      unit,
      title,
      description,
      type,
      videoUrl,
      videoId,
      videoFileId,
      thumbnailUrl,
      thumbnailFileId,
      duration,
      pdfUrl,
      pdfFileId,
      pdfThumbnailUrl,
      pageCount,
      // Animation fields
      animationId,
      animationSteps: animationSteps || 1,
      animationCategory,
      animationThumbnailUrl,
      // Audio fields
      audioHindiUrl,
      audioHindiFileId,
      audioEnglishUrl,
      audioEnglishFileId,
      order: order || 0,
    });

    res.status(201).json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Error creating content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create content",
    });
  }
};

// GET /api/learn/admin/imagekit-auth - Get ImageKit authentication for uploads
exports.getImagekitAuth = async (req, res) => {
  try {
    // Check if user is admin or team member
    const user = await requireAdminOrTeam(req, res);
    if (!user) return;

    const imagekit = require("../config/imagekit");

    // Check if ImageKit is configured
    if (!imagekit.isConfigured()) {
      console.error("ImageKit not configured - missing credentials");
      return res.status(500).json({
        success: false,
        message: "ImageKit is not configured on the server",
      });
    }

    const crypto = require("crypto");
    const token = crypto.randomUUID();
    const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes from now
    const authenticationParameters = imagekit.getAuthenticationParameters(
      token,
      expire
    );
    res.json({
      success: true,
      ...authenticationParameters,
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      urlEndpoint:
        process.env.IMAGEKIT_URL_ENDPOINT ||
        "https://ik.imagekit.io/ayushrathore1",
    });
  } catch (error) {
    console.error("Error generating ImageKit auth:", error);
    res.status(500).json({
      success: false,
    });
  }
};

// PATCH /api/learn/admin/content/:contentId - Update content (admin/team)
exports.updateContent = async (req, res) => {
  try {
    const user = await requireAdminOrTeam(req, res);
    if (!user) return;

    const { contentId } = req.params;
    const imagekit = require("../config/imagekit");

    const content = await LearnContent.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const {
      title,
      description,
      unit,
      // Animation fields
      animationId,
      animationSteps,
      animationCategory,
      animationThumbnailUrl,
      // Audio fields
      audioHindiUrl,
      audioHindiFileId,
      audioEnglishUrl,
      audioEnglishFileId,
      pageCount,
    } = req.body;

    // Delete old audio files if being replaced
    if (
      audioHindiFileId &&
      content.audioHindiFileId &&
      content.audioHindiFileId !== audioHindiFileId
    ) {
      try {
        await imagekit.deleteFile(content.audioHindiFileId);
      } catch (deleteErr) {
        console.error("Failed to delete old Hindi audio:", deleteErr);
      }
    }

    if (
      audioEnglishFileId &&
      content.audioEnglishFileId &&
      content.audioEnglishFileId !== audioEnglishFileId
    ) {
      try {
        await imagekit.deleteFile(content.audioEnglishFileId);
      } catch (deleteErr) {
        console.error("Failed to delete old English audio:", deleteErr);
      }
    }

    // Update fields
    if (title) content.title = title;
    if (description !== undefined) content.description = description;
    if (unit !== undefined) content.unit = unit;
    if (pageCount) content.pageCount = pageCount;

    // Update animation fields
    if (animationId !== undefined) content.animationId = animationId;
    if (animationSteps !== undefined) content.animationSteps = animationSteps;
    if (animationCategory !== undefined)
      content.animationCategory = animationCategory;
    if (animationThumbnailUrl !== undefined)
      content.animationThumbnailUrl = animationThumbnailUrl;

    // Update audio URLs
    if (audioHindiUrl !== undefined) {
      content.audioHindiUrl = audioHindiUrl || null;
      content.audioHindiFileId = audioHindiFileId || null;
    }
    if (audioEnglishUrl !== undefined) {
      content.audioEnglishUrl = audioEnglishUrl || null;
      content.audioEnglishFileId = audioEnglishFileId || null;
    }

    await content.save();

    res.json({
      success: true,
      content,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update content",
    });
  }
};

// DELETE /api/learn/admin/content/:contentId - Delete content (admin/team)
exports.deleteContent = async (req, res) => {
  try {
    const user = await requireAdminOrTeam(req, res);
    if (!user) return;

    const { contentId } = req.params;
    const imagekit = require("../config/imagekit");

    const content = await LearnContent.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    // Delete files from ImageKit
    const filesToDelete = [
      content.videoFileId,
      content.pdfFileId,
      content.thumbnailFileId,
    ].filter(Boolean);

    for (const fileId of filesToDelete) {
      try {
        await imagekit.deleteFile(fileId);
      } catch (deleteError) {
        console.warn(`Could not delete file ${fileId}:`, deleteError.message);
      }
    }

    // Delete from database
    await LearnContent.findByIdAndDelete(contentId);

    res.json({
      success: true,
      message: "Content deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete content",
    });
  }
};

// GET /api/learn/admin/subjects - Get list of available subjects for admin/team
exports.listAdminSubjects = async (req, res) => {
  try {
    const user = await requireAdminOrTeam(req, res);
    if (!user) return;

    // Return predefined subjects for 3rd semester CSE
    const subjects = [
      "Advanced Engineering Mathematics",
      "Data Structures and Algorithms",
      "Object Oriented Programming",
      "Digital Electronics",
      "Software Engineering",
      "Technical Communication",
      "Managerial Economics and Financial Accounting",
    ];

    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("Error fetching admin subjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
};


