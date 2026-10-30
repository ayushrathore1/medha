const LearnContent = require("../models/LearnContent");

exports.listSubjects = async (req, res) => {
  try {
    const subjects = await LearnContent.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: "$subject",
          videoCount: {
            $sum: { $cond: [{ $eq: ["$type", "video"] }, 1, 0] },
          },
          pdfCount: {
            $sum: { $cond: [{ $eq: ["$type", "pdf"] }, 1, 0] },
          },
          animationCount: {
            $sum: { $cond: [{ $eq: ["$type", "animation"] }, 1, 0] },
          },
          totalViews: { $sum: "$views" },
          totalLikes: { $sum: "$likeCount" },
        },
      },
      {
        $project: {
          _id: 0,
          subject: "$_id",
          videoCount: 1,
          pdfCount: 1,
          animationCount: 1,
          totalViews: 1,
          totalLikes: 1,
          totalContent: {
            $add: ["$videoCount", "$pdfCount", "$animationCount"],
          },
        },
      },
      { $sort: { subject: 1 } },
    ]);

    res.json({
      success: true,
      subjects,
    });
  } catch (error) {
    console.error("Error fetching learn subjects:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch subjects",
    });
  }
};

// GET /api/learn/subjects/:subject/content - Get all content for a subject
exports.listSubjectContent = async (req, res) => {
  try {
    const { subject } = req.params;
    const { type } = req.query; // Optional filter by type (video/pdf)

    const query = {
      subject: decodeURIComponent(subject),
      isActive: true,
    };

    if (type && ["video", "pdf", "animation"].includes(type)) {
      query.type = type;
    }

    const content = await LearnContent.find(query)
      .select("-__v")
      .sort({ order: 1, createdAt: -1 });

    // Check if current user has liked each content
    const userId = req.userId;
    const contentWithLikeStatus = content.map((item) => ({
      ...item.toObject(),
      isLiked: item.likes.some((id) => id.toString() === userId),
    }));

    res.json({
      success: true,
      subject: decodeURIComponent(subject),
      content: contentWithLikeStatus,
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content",
    });
  }
};

// POST /api/learn/:contentId/like - Toggle like on content
exports.toggleLike = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.userId;

    const content = await LearnContent.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    const likeIndex = content.likes.findIndex((id) => id.toString() === userId);

    let isLiked;
    if (likeIndex > -1) {
      // Remove like
      content.likes.splice(likeIndex, 1);
      isLiked = false;
    } else {
      // Add like
      content.likes.push(userId);
      isLiked = true;
    }

    await content.save();

    res.json({
      success: true,
      isLiked,
      likeCount: content.likeCount,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update like",
    });
  }
};

// POST /api/learn/:contentId/view - Increment view count
exports.recordAuthenticatedView = async (req, res) => {
  try {
    const { contentId } = req.params;

    const content = await LearnContent.findByIdAndUpdate(
      contentId,
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.json({
      success: true,
      views: content.views,
    });
  } catch (error) {
    console.error("Error incrementing view:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update view count",
    });
  }
};

// GET /api/learn/:contentId - Get single content item
exports.getContent = async (req, res) => {
  try {
    const { contentId } = req.params;
    const userId = req.userId;

    const content = await LearnContent.findById(contentId);

    if (!content) {
      return res.status(404).json({
        success: false,
        message: "Content not found",
      });
    }

    res.json({
      success: true,
      content: {
        ...content.toObject(),
        isLiked: content.likes.some((id) => id.toString() === userId),
      },
    });
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch content",
    });
  }
};


