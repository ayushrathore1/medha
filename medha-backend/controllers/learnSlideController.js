const LearnContent = require("../models/LearnContent");
const { formatSeconds } = require("../utils/learnFormat");

// PATCH /api/learn/:id/slide/:step - Update slide data (notes, visibility, custom overrides)
exports.updateSlide = async (req, res) => {
  try {
    // Fetch user to check admin/team status
    const User = require("../models/User");
    const user = await User.findById(req.userId);

    // Allow access for admins (isAdmin=true OR role='admin') or team members
    const hasAccess =
      user && (user.isAdmin || user.role === "admin" || user.role === "team");
    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Admin/Team access required" });
    }

    const { id, step } = req.params;
    const stepNumber = parseInt(step);
    const { notes, customOverrides, isHidden } = req.body;

    const content = await LearnContent.findById(id);
    if (!content || content.type !== "animation") {
      return res
        .status(404)
        .json({ success: false, message: "Animation not found" });
    }

    // Find or create slide data entry
    let slideIndex = content.slideData.findIndex(
      (s) => s.stepNumber === stepNumber
    );
    if (slideIndex === -1) {
      content.slideData.push({ stepNumber });
      slideIndex = content.slideData.length - 1;
    }

    // Update fields
    if (notes) {
      content.slideData[slideIndex].notes = {
        ...content.slideData[slideIndex].notes,
        ...notes,
      };
    }
    if (customOverrides !== undefined) {
      content.slideData[slideIndex].customOverrides = customOverrides;
    }
    if (isHidden !== undefined) {
      content.slideData[slideIndex].isHidden = isHidden;
    }

    await content.save();

    res.json({
      success: true,
      message: "Slide data updated",
      slideData: content.slideData[slideIndex],
    });
  } catch (error) {
    console.error("Error updating slide data:", error);
    res.status(500).json({ success: false, message: "Failed to update slide data" });
  }
};

// POST /api/learn/:id/view - Increment view count
exports.incrementView = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Atomically increment views
    const content = await LearnContent.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } },
      { new: true, select: 'views' }
    );
    
    if (!content) {
      return res.status(404).json({ success: false, message: "Content not found" });
    }

    res.json({
      success: true,
      views: content.views
    });
  } catch (error) {
    console.error("Error incrementing view count:", error);
    res.status(500).json({ success: false, message: "Failed to increment views" });
  }
};

// POST /api/learn/:id/slide/:step/voice - Upload voice note to Cloudinary
exports.uploadSlideVoice = async (req, res) => {
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      // Allow access for admins (isAdmin=true OR role='admin') or team members
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { id, step } = req.params;
      const stepNumber = parseInt(step);

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No audio file provided" });
      }

      const content = await LearnContent.findById(id);
      if (!content || content.type !== "animation") {
        return res
          .status(404)
          .json({ success: false, message: "Animation not found" });
      }

      // Upload to Cloudinary as audio
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video", // Cloudinary uses 'video' for audio
              folder: "medha/animation-voice-notes",
              public_id: `${content.animationId}_step_${stepNumber}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // Find or create slide data entry
      let slideIndex = content.slideData.findIndex(
        (s) => s.stepNumber === stepNumber
      );
      if (slideIndex === -1) {
        content.slideData.push({ stepNumber });
        slideIndex = content.slideData.length - 1;
      }

      // Delete old voice note if exists
      if (content.slideData[slideIndex].voiceNotePublicId) {
        await cloudinary.uploader.destroy(
          content.slideData[slideIndex].voiceNotePublicId,
          { resource_type: "video" }
        );
      }

      content.slideData[slideIndex].voiceNoteUrl = result.secure_url;
      content.slideData[slideIndex].voiceNotePublicId = result.public_id;
      await content.save();

      res.json({ success: true, voiceNoteUrl: result.secure_url });
    } catch (error) {
      console.error("Error uploading voice note:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload voice note" });
    }
  };

// POST /api/learn/:id/slide/:step/note-image - Upload note image to Cloudinary
exports.uploadSlideNoteImage = async (req, res) => {
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { id, step } = req.params;
      const stepNumber = parseInt(step);

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image file provided" });
      }

      const content = await LearnContent.findById(id);
      if (!content || content.type !== "animation") {
        return res
          .status(404)
          .json({ success: false, message: "Animation not found" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "medha/animation-note-images",
              public_id: `${content.animationId}_step_${stepNumber}_note`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // Find or create slide data entry
      let slideIndex = content.slideData.findIndex(
        (s) => s.stepNumber === stepNumber
      );
      if (slideIndex === -1) {
        content.slideData.push({ stepNumber });
        slideIndex = content.slideData.length - 1;
      }

      // Delete old image if exists
      if (content.slideData[slideIndex].notes?.imagePublicId) {
        await cloudinary.uploader.destroy(
          content.slideData[slideIndex].notes.imagePublicId
        );
      }

      if (!content.slideData[slideIndex].notes) {
        content.slideData[slideIndex].notes = {};
      }
      content.slideData[slideIndex].notes.imageUrl = result.secure_url;
      content.slideData[slideIndex].notes.imagePublicId = result.public_id;
      await content.save();

      res.json({ success: true, imageUrl: result.secure_url });
    } catch (error) {
      console.error("Error uploading note image:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload image" });
    }
  };

// DELETE /api/learn/:id/slide/:step/voice - Delete voice note
exports.deleteSlideVoice = async (req, res) => {
  try {
    // Fetch user to check admin/team status
    const User = require("../models/User");
    const user = await User.findById(req.userId);
    const hasAccess =
      user && (user.isAdmin || user.role === "admin" || user.role === "team");
    if (!hasAccess) {
      return res
        .status(403)
        .json({ success: false, message: "Admin/Team access required" });
    }

    const { id, step } = req.params;
    const stepNumber = parseInt(step);

    const content = await LearnContent.findById(id);
    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    const slideIndex = content.slideData.findIndex(
      (s) => s.stepNumber === stepNumber
    );
    if (slideIndex !== -1 && content.slideData[slideIndex].voiceNotePublicId) {
      await cloudinary.uploader.destroy(
        content.slideData[slideIndex].voiceNotePublicId,
        { resource_type: "video" }
      );
      content.slideData[slideIndex].voiceNoteUrl = null;
      content.slideData[slideIndex].voiceNotePublicId = null;
      await content.save();
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting voice note:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete voice note" });
  }
};

// GET /api/learn/animation/:animationId/audio - Get audio URLs for an animation by animationId
// NOTE: This route MUST be defined BEFORE /:id/slides to prevent route conflict
exports.getAnimationAudio = async (req, res) => {
  try {
    const { animationId } = req.params;

    const content = await LearnContent.findOne({
      animationId: animationId,
    }).select(
      "audioHindiUrl audioEnglishUrl audioTranscript manualSlideTimings animationSteps partAudios"
    );

    if (!content) {
      return res.json({
        success: false,
        message: "No audio found for this animation",
      });
    }

    res.json({
      success: true,
      audioHindiUrl: content.audioHindiUrl || null,
      audioEnglishUrl: content.audioEnglishUrl || null,
      audioTranscript: content.audioTranscript || null,
      manualSlideTimings: content.manualSlideTimings || {},
      totalSteps: content.animationSteps || 0,
      partAudios: content.partAudios || [],
    });
  } catch (error) {
    console.error("Error fetching animation audio:", error);
    res.status(500).json({ success: false, message: "Failed to fetch audio" });
  }
};

// PUT /api/learn/animation/:animationId/part-audio/:partNumber - Upload/update audio for a specific part
exports.upsertPartAudio = async (req, res) => {
    try {
      // Check admin/team access
      const User = require("../models/User");
      const user = await User.findById(req.userId);
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { animationId } = req.params;
      const partNumber = parseInt(req.params.partNumber);
      const { 
        partName, 
        startScene, 
        endScene, 
        audioHindiUrl, 
        audioHindiFileId,
        audioEnglishUrl,
        audioEnglishFileId,
        audioDuration 
      } = req.body;

      // Find or create animation document
      let content = await LearnContent.findOne({ animationId });
      if (!content) {
        // Auto-create animation document if it doesn't exist
        content = new LearnContent({
          title: animationId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
          type: 'animation',
          animationId: animationId,
          subject: 'Object Oriented Programming',
          university: 'RTU',
          partAudios: [],
          slideData: [],
        });
        console.log(`Created new animation document for: ${animationId}`);
      }

      // Initialize partAudios if doesn't exist
      if (!content.partAudios) {
        content.partAudios = [];
      }

      // Find existing part or create new
      let partIndex = content.partAudios.findIndex(p => p.partNumber === partNumber);
      
      if (partIndex === -1) {
        // Add new part
        content.partAudios.push({
          partNumber,
          partName: partName || `Part ${partNumber}`,
          startScene: startScene || 1,
          endScene: endScene || 1,
          audioHindiUrl,
          audioHindiFileId,
          audioEnglishUrl,
          audioEnglishFileId,
          audioDuration,
        });
      } else {
        // Update existing part
        const part = content.partAudios[partIndex];
        if (partName) part.partName = partName;
        if (startScene !== undefined) part.startScene = startScene;
        if (endScene !== undefined) part.endScene = endScene;
        if (audioHindiUrl !== undefined) part.audioHindiUrl = audioHindiUrl;
        if (audioHindiFileId) part.audioHindiFileId = audioHindiFileId;
        if (audioEnglishUrl !== undefined) part.audioEnglishUrl = audioEnglishUrl;
        if (audioEnglishFileId) part.audioEnglishFileId = audioEnglishFileId;
        if (audioDuration !== undefined) part.audioDuration = audioDuration;
      }

      // Sort by partNumber
      content.partAudios.sort((a, b) => a.partNumber - b.partNumber);
      
      await content.save();

      res.json({
        success: true,
        message: `Part ${partNumber} audio saved successfully`,
        partAudios: content.partAudios,
      });
    } catch (error) {
      console.error("Error saving part audio:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to save part audio" });
    }
  };


// POST /api/learn/animation/:animationId/timings - Save manual slide timings
exports.saveTimings = async (req, res) => {
    try {
      // Check admin/team access
      const User = require("../models/User");
      const user = await User.findById(req.userId);
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { animationId } = req.params;
      const { timings } = req.body; // Object: { "1": 0, "2": 3.5, ... }

      const content = await LearnContent.findOne({ animationId });
      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Animation not found" });
      }

      content.manualSlideTimings = timings;
      await content.save();

      res.json({
        success: true,
        message: "Timings saved successfully",
        manualSlideTimings: content.manualSlideTimings,
      });
    } catch (error) {
      console.error("Error saving timings:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to save timings" });
    }
  };

// POST /api/learn/animation/:animationId/transcribe - Auto-transcribe audio and map to slides
exports.transcribeAnimation = async (req, res) => {
    try {
      // Check admin/team access
      const User = require("../models/User");
      const user = await User.findById(req.userId);
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { animationId } = req.params;
      const { audioUrl, language = "hi" } = req.body;

      // Find content
      const content = await LearnContent.findOne({ animationId });
      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Animation not found" });
      }

      // Get audio URL (use provided or fallback to stored)
      const audioToTranscribe =
        audioUrl || content.audioHindiUrl || content.audioEnglishUrl;
      if (!audioToTranscribe) {
        return res.status(400).json({
          success: false,
          message: "No audio URL available for transcription",
        });
      }

      console.log(`🎤 Starting transcription for ${animationId}...`);
      console.log(`   Audio URL: ${audioToTranscribe.substring(0, 50)}...`);

      // Download audio file
      const axios = require("axios");
      const audioResponse = await axios.get(audioToTranscribe, {
        responseType: "arraybuffer",
        timeout: 120000,
      });

      console.log(
        `   Downloaded: ${(audioResponse.data.length / 1024 / 1024).toFixed(2)} MB`
      );

      // Transcribe using Groq Whisper API
      const GROQ_API_KEY = process.env.GROQ_API_KEY;
      if (!GROQ_API_KEY) {
        return res
          .status(500)
          .json({ success: false, message: "Groq API key not configured" });
      }

      const { FormData, Blob } = await import("formdata-node");
      const formData = new FormData();
      const blob = new Blob([audioResponse.data], { type: "audio/mpeg" });
      formData.set("file", blob, "audio.mp3");
      formData.set("model", "whisper-large-v3-turbo");
      formData.set("language", language);
      formData.set("response_format", "verbose_json");

      console.log(`   Sending to Whisper API...`);

      const whisperResponse = await fetch(
        "https://api.groq.com/openai/v1/audio/transcriptions",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
          body: formData,
        }
      );

      if (!whisperResponse.ok) {
        const errorText = await whisperResponse.text();
        console.error(
          `   Whisper API error: ${whisperResponse.status} - ${errorText}`
        );
        throw new Error(`Transcription failed: ${whisperResponse.status}`);
      }

      const transcriptData = await whisperResponse.json();
      console.log(
        `   Transcription complete: ${transcriptData.segments?.length || 0} segments`
      );
      console.log(
        `   Duration: ${transcriptData.duration?.toFixed(2) || 0} seconds`
      );

      const totalSteps = content.animationSteps || 104;
      const audioDuration = transcriptData.duration || 551;

      // ========================================
      // AI-POWERED SLIDE MAPPING
      // Uses Groq LLM to match transcript segments to slide content
      // ========================================
      console.log(`   🤖 Starting AI-powered slide mapping...`);

      // ACTUAL SLIDE CONTENT extracted from animation components
      // Each entry has the slide number and the visible text content
      const slideContent = [
        // INTRO (Slide 1)
        {
          slide: 1,
          content:
            "Unit 5 Welcome, C++ OOP, exception handling templates stream classes file handling, four pillars",
        },

        // EXCEPTION HANDLING (Slides 2-26)
        {
          slide: 2,
          content:
            "Exception Handling title, RTU OOP UNIT 5, Handling Runtime Errors Safely",
        },
        {
          slide: 3,
          content:
            "THINGS THAT GO WRONG, Divide by zero, File not found, Invalid input, Out of memory",
        },
        {
          slide: 4,
          content:
            "CRASH EXAMPLE, int a = 10, int b = 0, cout << a / b, PROGRAM CRASHED",
        },
        {
          slide: 5,
          content:
            "THE TRADITIONAL PROBLEM, Running program, Processing user data, Connected to database, Program terminated unexpectedly",
        },
        {
          slide: 6,
          content:
            "THE SOLUTION PROTECTION, Risky code, a / b, file.open(), new int[size], Protect risky code with exception handling",
        },
        {
          slide: 7,
          content:
            "THREE MAGIC KEYWORDS, try Attempt risky code, throw Signal an error, catch Handle the error",
        },
        {
          slide: 8,
          content:
            "FIRST TRY-CATCH EXAMPLE, TRY BLOCK, if(b==0) throw Error, CATCH BLOCK, catch(const char* msg)",
        },
        {
          slide: 9,
          content:
            "TWO POSSIBLE PATHS, Normal: try no error continue, Error: try throw catch",
        },
        {
          slide: 10,
          content:
            "WHAT CAN BE THROWN, throw 10 int, throw File not found string, throw 3.14 double",
        },
        {
          slide: 11,
          content:
            "TYPE MATCHING, throw matches catch(int), throw string matches catch(const char*)",
        },
        {
          slide: 12,
          content:
            "MULTIPLE CATCH BLOCKS, catch int, catch const char*, catch double, Different types different handlers",
        },
        {
          slide: 13,
          content:
            "DEFAULT CATCH, catch(...) catches anything, Safety net for unknown exceptions",
        },
        {
          slide: 14,
          content:
            "STACK UNWINDING, funcC throws, funcB calls funcC, funcA calls funcB, main calls funcA, Exception travels up",
        },
        {
          slide: 15,
          content:
            "Stack unwinding continued, Exception travels up functions clean up, destructors automatically call",
        },
        {
          slide: 16,
          content:
            "Custom exception class, class MyException, what() method, Error message",
        },
        {
          slide: 17,
          content:
            "Re-throw exception, catch partial handle, throw; re-throws same exception",
        },
        {
          slide: 18,
          content:
            "Exception specifications, noexcept keyword, Function promises no throws",
        },
        {
          slide: 19,
          content:
            "Best practices, Catch by reference, Use standard exceptions, RAII",
        },
        {
          slide: 20,
          content:
            "Exception handling summary, try catch throw, Stack unwinding, Custom exceptions",
        },
        {
          slide: 21,
          content:
            "Exception handling real world, Banking systems, Railway systems, File operations",
        },
        {
          slide: 22,
          content:
            "Memory management with exceptions, Resource cleanup, Smart pointers recommended",
        },
        {
          slide: 23,
          content:
            "Exception vs error codes, Exception advantages, Separates error handling from logic",
        },
        {
          slide: 24,
          content:
            "std::exception hierarchy, runtime_error, logic_error, bad_alloc, Standard exceptions",
        },
        {
          slide: 25,
          content: "Exception handling complete, Ready for Templates",
        },
        { slide: 26, content: "Transition to Templates, Next topic preview" },

        // TEMPLATES (Slides 27-52)
        {
          slide: 27,
          content: "Templates title, RTU OOP UNIT 5, Generic Programming",
        },
        {
          slide: 28,
          content:
            "THE PROBLEM, int add(int a, int b), float add(float a, float b), double add(double a, double b), Same logic repeated",
        },
        {
          slide: 29,
          content:
            "Code duplication problem, Writing same function multiple times, Bad practice",
        },
        {
          slide: 30,
          content:
            "GENERIC SOLUTION, template<typename T>, T add(T a, T b), return a + b",
        },
        {
          slide: 31,
          content:
            "Type parameter T, placeholder, Compiler substitutes actual type",
        },
        {
          slide: 32,
          content:
            "HOW IT WORKS, add(3, 4), T becomes int, add(2.5f, 3.5f), T becomes float",
        },
        {
          slide: 33,
          content:
            "Function template syntax, template<typename T>, Template keyword, Typename or class",
        },
        {
          slide: 34,
          content:
            "Multiple type parameters, template<typename T, typename U>, Different types in same template",
        },
        {
          slide: 35,
          content:
            "TEMPLATE INSTANTIATION, Compiler generates code, Happens at compile time",
        },
        {
          slide: 36,
          content:
            "Compile time, No runtime overhead, Type-safe, Fast as handwritten",
        },
        {
          slide: 37,
          content:
            "CLASS TEMPLATES, template<typename T>, class Box, T value, store(T val)",
        },
        {
          slide: 38,
          content:
            "Box<int> intBox, Box<string> strBox, Different types same template",
        },
        {
          slide: 39,
          content:
            "Class template usage, box.store(42), box.get(), Type-safe containers",
        },
        {
          slide: 40,
          content:
            "STL uses templates, vector<int>, map<string,int>, Standard containers",
        },
        {
          slide: 41,
          content:
            "TEMPLATE SPECIALIZATION, General template, Specialized version for specific type",
        },
        {
          slide: 42,
          content: "template<> class Box<bool>, Specialized behavior for bool",
        },
        {
          slide: 43,
          content:
            "Partial specialization, Specialize for pointers, template<typename T> class Box<T*>",
        },
        {
          slide: 44,
          content:
            "NON-TYPE PARAMETERS, template<typename T, int N>, Array size as parameter",
        },
        {
          slide: 45,
          content: "template<int N> class Array, Fixed size at compile time",
        },
        {
          slide: 46,
          content:
            "Array<10> arr, Size known at compile time, No runtime allocation",
        },
        {
          slide: 47,
          content:
            "Default template arguments, template<typename T = int>, Default type",
        },
        {
          slide: 48,
          content: "Template template parameters, Advanced template usage",
        },
        {
          slide: 49,
          content:
            "SFINAE, Substitution Failure Is Not An Error, Template metaprogramming",
        },
        {
          slide: 50,
          content:
            "Compile time polymorphism, No virtual functions, No vtable overhead",
        },
        {
          slide: 51,
          content: "Templates summary, Generic code, Type safety, Compile time",
        },
        {
          slide: 52,
          content: "Transition to Stream Classes, Next topic preview",
        },

        // STREAM CLASSES (Slides 53-78)
        {
          slide: 53,
          content: "Stream Classes title, RTU OOP UNIT 5, Input/Output in C++",
        },
        {
          slide: 54,
          content:
            "WHAT IS A STREAM, Data flow, Like a river, Input and output",
        },
        {
          slide: 55,
          content: "INPUT STREAM, Keyboard to program, cin, istream class",
        },
        {
          slide: 56,
          content: "OUTPUT STREAM, Program to screen, cout, ostream class",
        },
        {
          slide: 57,
          content:
            "STREAM OBJECTS, cin is istream object, cout is ostream object",
        },
        {
          slide: 58,
          content:
            "Stream operators, << insertion operator, >> extraction operator",
        },
        {
          slide: 59,
          content:
            "cout << Hello, Insertion into output stream, Screen display",
        },
        {
          slide: 60,
          content: "cin >> x, Extraction from input stream, Keyboard input",
        },
        {
          slide: 61,
          content:
            "STREAM HIERARCHY, ios base class, istream ostream, iostream",
        },
        {
          slide: 62,
          content:
            "Stream insertion overloading, operator<<, friend function, Return ostream&",
        },
        {
          slide: 63,
          content:
            "Stream extraction overloading, operator>>, friend function, Return istream&",
        },
        { slide: 64, content: "IOMANIP HEADER, Manipulators, Format output" },
        {
          slide: 65,
          content: "setw(10), Set field width, Right justify by default",
        },
        {
          slide: 66,
          content: "setprecision(2), Decimal places, Fixed notation",
        },
        { slide: 67, content: "fixed, scientific, Floating point format" },
        {
          slide: 68,
          content: "STREAM STATE FLAGS, goodbit, badbit, failbit, eofbit",
        },
        {
          slide: 69,
          content: "cin.fail(), Check if operation failed, Returns bool",
        },
        { slide: 70, content: "cin.clear(), Reset error state, Clear flags" },
        { slide: 71, content: "cin.ignore(), Skip characters, Clear buffer" },
        {
          slide: 72,
          content: "Error handling example, Check fail, Clear and retry",
        },
        {
          slide: 73,
          content: "getline(cin, str), Read entire line, Handles spaces",
        },
        {
          slide: 74,
          content:
            "Custom class stream operators, cout << student, cin >> student",
        },
        {
          slide: 75,
          content: "String streams, stringstream, Parse strings, Format output",
        },
        {
          slide: 76,
          content: "Stream summary, cin cout, Operators, Manipulators",
        },
        { slide: 77, content: "Transition to File Handling, Next topic" },
        { slide: 78, content: "File handling preview, Permanent data storage" },

        // FILE HANDLING (Slides 79-104)
        {
          slide: 79,
          content:
            "File Handling title, RTU OOP UNIT 5, Permanent Data Storage",
        },
        {
          slide: 80,
          content:
            "WHY FILES, Program ends data lost, Files persist data, Permanent storage",
        },
        {
          slide: 81,
          content: "FSTREAM HEADER, #include<fstream>, File stream classes",
        },
        {
          slide: 82,
          content:
            "THREE FILE CLASSES, ofstream output write, ifstream input read, fstream both",
        },
        {
          slide: 83,
          content: "ofstream fout, Output file stream, Write to file",
        },
        {
          slide: 84,
          content: "ifstream fin, Input file stream, Read from file",
        },
        {
          slide: 85,
          content:
            "OPENING A FILE, ofstream fout(myfile.txt), Opens for writing",
        },
        {
          slide: 86,
          content:
            "FILE MODES, ios::out, ios::in, ios::app, ios::trunc, ios::binary",
        },
        {
          slide: 87,
          content: "Writing to file, fout << Hello World, Same as cout",
        },
        {
          slide: 88,
          content:
            "CLOSING A FILE, fout.close(), Always close files, Resource cleanup",
        },
        {
          slide: 89,
          content:
            "Reading from file, fin >> word, Reads one word, Stops at whitespace",
        },
        {
          slide: 90,
          content: "getline(fin, line), Read entire line, Better for text",
        },
        {
          slide: 91,
          content: "CHECK IF OPEN, if(!fin), Check success, Handle errors",
        },
        { slide: 92, content: "if(fin.is_open()), Alternative check method" },
        { slide: 93, content: "fin.eof(), End of file, Loop until done" },
        {
          slide: 94,
          content:
            "While loop reading, while(getline(fin, line)), Process each line",
        },
        {
          slide: 95,
          content:
            "TEXT VS BINARY, Text files human readable, Binary raw memory",
        },
        {
          slide: 96,
          content: "Binary advantages, Faster, Smaller, Exact data",
        },
        { slide: 97, content: "Binary file mode, ios::binary, Open as binary" },
        {
          slide: 98,
          content: "write() and read(), Binary operations, Size in bytes",
        },
        {
          slide: 99,
          content:
            "Writing structure, fout.write((char*)&student, sizeof(student))",
        },
        {
          slide: 100,
          content:
            "Reading structure, fin.read((char*)&student, sizeof(student))",
        },
        { slide: 101, content: "RANDOM ACCESS, seekg seekp, Jump to position" },
        {
          slide: 102,
          content: "tellg tellp, Get current position, Returns streampos",
        },
        {
          slide: 103,
          content:
            "Random access example, 50th student, Jump directly, No scanning",
        },
        {
          slide: 104,
          content:
            "File handling summary, ofstream ifstream fstream, text binary, random access, Unit 5 complete",
        },
      ];

      // Ask AI to map transcript segments to slides
      const segmentTexts = (transcriptData.segments || [])
        .map(
          (seg, i) =>
            `[${i + 1}] "${seg.text?.trim()}" (${formatSeconds(seg.start)}-${formatSeconds(seg.end)})`
        )
        .join("\n");

      // Format slide content for AI
      const slideContentText = slideContent
        .map((s) => `Slide ${s.slide}: ${s.content}`)
        .join("\n");

      const mappingPrompt = `You are mapping Hindi/Hinglish audio transcript segments to animation slides.

SLIDE CONTENT (${totalSteps} total slides - actual visible text on each slide):
${slideContentText}

TRANSCRIPT SEGMENTS (spoken audio in Hindi/Hinglish):
${segmentTexts}

TASK: Map each transcript segment to the BEST matching slide based on content similarity.
Rules:
1. Match transcript text to slide content based on keywords and meaning
2. Consider Hindi/Hinglish words that match English slide content (e.g., "try catch throw" in audio matches slide about try-catch)
3. Keep temporal order - later segments should generally map to equal or higher slide numbers
4. Each segment maps to ONE slide number (1-${totalSteps})
5. Multiple segments can map to the same slide if they discuss the same content
6. Output ONLY a JSON array: [{"segment":1,"slide":1},{"segment":2,"slide":2},...] (no explanation)

OUTPUT:`;

      try {
        const aiResponse = await axios.post(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            model: require("../config/groqModels").GROQ_CAPABLE,
            messages: [
              {
                role: "system",
                content:
                  "You are a precise mapping assistant. Output only valid JSON.",
              },
              { role: "user", content: mappingPrompt },
            ],
            max_tokens: 4000,
            temperature: 0.1,
          },
          {
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              "Content-Type": "application/json",
            },
            timeout: 60000,
          }
        );

        const aiOutput = aiResponse.data.choices[0].message.content.trim();
        console.log(`   AI mapping response received`);

        // Parse AI mapping
        let aiMapping = [];
        try {
          // Extract JSON array from response
          const jsonMatch = aiOutput.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            aiMapping = JSON.parse(jsonMatch[0]);
          }
        } catch (parseErr) {
          console.error(
            `   Failed to parse AI mapping, using fallback:`,
            parseErr.message
          );
        }

        // Create segments with AI-mapped slide numbers
        const segments = (transcriptData.segments || []).map((seg, i) => {
          const aiMatch = aiMapping.find((m) => m.segment === i + 1);
          let slideNumber = aiMatch?.slide;

          // Fallback to position-based if AI didn't provide mapping
          if (!slideNumber || slideNumber < 1 || slideNumber > totalSteps) {
            const segmentMidpoint = (seg.start + seg.end) / 2;
            slideNumber = Math.max(
              1,
              Math.min(
                totalSteps,
                Math.ceil((segmentMidpoint / audioDuration) * totalSteps)
              )
            );
          }

          return {
            id: i + 1,
            start: seg.start,
            end: seg.end,
            text: seg.text?.trim(),
            slideNumber,
          };
        });

        console.log(`   ✅ AI mapped ${aiMapping.length} segments`);

        // Save transcript to database
        content.audioTranscript = {
          segments,
          language: transcriptData.language || language,
          duration: audioDuration,
          transcribedAt: new Date(),
          autoSyncEnabled: true,
        };

        await content.save();
        console.log(`   ✅ Saved AI-mapped transcript to database`);

        res.json({
          success: true,
          message: "Transcription complete with AI mapping",
          segmentCount: segments.length,
          duration: audioDuration,
          audioTranscript: content.audioTranscript,
        });
      } catch (aiError) {
        console.error(`   AI mapping failed, using fallback:`, aiError.message);

        // Fallback to position-based mapping
        const segments = (transcriptData.segments || []).map((seg, i) => {
          const segmentMidpoint = (seg.start + seg.end) / 2;
          const slideNumber = Math.max(
            1,
            Math.min(
              totalSteps,
              Math.ceil((segmentMidpoint / audioDuration) * totalSteps)
            )
          );
          return {
            id: i + 1,
            start: seg.start,
            end: seg.end,
            text: seg.text?.trim(),
            slideNumber,
          };
        });

        content.audioTranscript = {
          segments,
          language: transcriptData.language || language,
          duration: audioDuration,
          transcribedAt: new Date(),
          autoSyncEnabled: true,
        };

        await content.save();
        console.log(`   ✅ Saved position-based transcript (AI fallback)`);

        res.json({
          success: true,
          message: "Transcription complete (position-based fallback)",
          segmentCount: segments.length,
          duration: audioDuration,
          audioTranscript: content.audioTranscript,
        });
      }
    } catch (error) {
      console.error("Error transcribing audio:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to transcribe audio",
        error: error.message,
      });
    }
  };
// GET /api/learn/animation/:animationId/slides - Get slide data by animationId
exports.getAnimationSlides = async (req, res) => {
  try {
    const { animationId } = req.params;
    const content = await LearnContent.findOne({ animationId }).select(
      "slideData animationSteps"
    );

    if (!content) {
      return res.json({
        success: true,
        slideData: [],
        totalSteps: 0,
      });
    }

    res.json({
      success: true,
      slideData: content.slideData || [],
      totalSteps: content.animationSteps || 0,
      contentId: content._id,
    });
  } catch (error) {
    console.error("Error fetching slide data by animationId:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch slide data" });
  }
};

// PATCH /api/learn/animation/:animationId/slide/:step - Update slide data by animationId (auto-creates content if needed)
exports.updateAnimationSlide = async (req, res) => {
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      // Allow access for admins (isAdmin=true OR role='admin') or team members
      const hasAccess =
        user && (user.isAdmin || user.role === "admin" || user.role === "team");
      if (!hasAccess) {
        console.log("❌ Access denied - not admin/team");
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { animationId, step } = req.params;
      const stepNumber = parseInt(step);
      const { notes, customOverrides, isHidden, title, totalSteps } = req.body;

      // Find or create content
      let content = await LearnContent.findOne({ animationId });

      if (!content) {
        content = await LearnContent.create({
          subject: "C++",
          semester: 3,
          unit: 1,
          title: title || animationId,
          description: `Animation: ${title || animationId}`,
          type: "animation",
          animationId: animationId,
          animationSteps: parseInt(totalSteps) || 1,
          slideData: [],
          order: 0,
        });
      }

      // Find or create slide data entry
      if (!content.slideData) content.slideData = [];
      let slideIndex = content.slideData.findIndex(
        (s) => s.stepNumber === stepNumber
      );
      if (slideIndex === -1) {
        content.slideData.push({ stepNumber });
        slideIndex = content.slideData.length - 1;
      }

      // Update fields
      if (notes) {
        content.slideData[slideIndex].notes = {
          ...content.slideData[slideIndex].notes,
          ...notes,
        };
      }
      if (customOverrides !== undefined) {
        content.slideData[slideIndex].customOverrides = customOverrides;
      }
      if (isHidden !== undefined) {
        content.slideData[slideIndex].isHidden = isHidden;
      }

      await content.save();
      res.json({
        success: true,
        slideData: content.slideData[slideIndex],
        contentId: content._id,
      });
    } catch (error) {
      console.error("Error updating slide data by animationId:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to update slide" });
    }
  };

// GET /api/learn/:id/slides - Get all slide data for an animation
exports.getSlides = async (req, res) => {
  try {
    const { id } = req.params;
    const content = await LearnContent.findById(id).select(
      "slideData animationSteps"
    );

    if (!content) {
      return res
        .status(404)
        .json({ success: false, message: "Content not found" });
    }

    res.json({
      success: true,
      slideData: content.slideData,
      totalSteps: content.animationSteps,
    });
  } catch (error) {
    console.error("Error fetching slide data:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch slide data" });
  }
};

// POST /api/learn/animation/global-voice - Upload global voice for animation by animationId (auto-creates content if needed)
// NOTE: This route MUST be defined BEFORE /:id/global-voice to prevent route conflict
exports.uploadAnimationGlobalVoice = async (req, res) => {
    console.log("[GLOBAL-VOICE] Request received for animation upload");
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      if (!user || (!user.isAdmin && user.role !== "team")) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { language, animationId, title, totalSteps, subject, category } =
        req.body;

      console.log("[GLOBAL-VOICE] Request body:", {
        language,
        animationId,
        title,
        totalSteps,
      });
      console.log(
        "[GLOBAL-VOICE] File received:",
        req.file
          ? {
              fieldname: req.file.fieldname,
              mimetype: req.file.mimetype,
              size: req.file.size,
              originalname: req.file.originalname,
            }
          : "No file"
      );

      if (!req.file) {
        console.log("[GLOBAL-VOICE] Error: No audio file in request");
        return res
          .status(400)
          .json({ success: false, message: "No audio file provided" });
      }

      if (!animationId) {
        return res
          .status(400)
          .json({ success: false, message: "Animation ID is required" });
      }

      if (!["hindi", "english"].includes(language)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid language specified" });
      }

      // Find or create content for this animation
      let content = await LearnContent.findOne({ animationId: animationId });

      if (!content) {
        // Auto-create content entry for this animation
        content = await LearnContent.create({
          subject: subject || "C++",
          semester: 3,
          unit: 1,
          title: title || animationId,
          description: `Animation: ${title || animationId}`,
          type: "animation",
          animationId: animationId,
          animationSteps: parseInt(totalSteps) || 1,
          animationCategory: category || "general",
          order: 0,
        });
        console.log("[GLOBAL-VOICE] Created new content entry:", content._id);
      }

      // Upload to Cloudinary
      console.log("[GLOBAL-VOICE] Starting Cloudinary upload...");
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: "video",
            folder: "medha/animation-global-voice",
            public_id: `${animationId}_global_${language}`,
            timeout: 120000, // 2 minute timeout for Cloudinary
          },
          (error, result) => {
            if (error) {
              console.error("[GLOBAL-VOICE] Cloudinary upload error:", error);
              reject(error);
            } else {
              console.log(
                "[GLOBAL-VOICE] Cloudinary upload success:",
                result.secure_url
              );
              resolve(result);
            }
          }
        );

        // Handle stream errors
        uploadStream.on("error", (err) => {
          console.error("[GLOBAL-VOICE] Upload stream error:", err);
          reject(err);
        });

        uploadStream.end(req.file.buffer);
      });

      // Delete old file if exists
      const oldFileId =
        language === "hindi"
          ? content.audioHindiFileId
          : content.audioEnglishFileId;
      if (oldFileId) {
        try {
          await cloudinary.uploader.destroy(oldFileId, {
            resource_type: "video",
          });
        } catch (e) {
          console.warn("Failed to delete old audio:", e);
        }
      }

      // Update content
      if (language === "hindi") {
        content.audioHindiUrl = result.secure_url;
        content.audioHindiFileId = result.public_id;
      } else {
        content.audioEnglishUrl = result.secure_url;
        content.audioEnglishFileId = result.public_id;
      }

      await content.save();
      console.log("[GLOBAL-VOICE] Upload completed successfully");

      res.json({
        success: true,
        audioUrl: result.secure_url,
        language,
        contentId: content._id,
      });
    } catch (error) {
      console.error(
        "[GLOBAL-VOICE] Error uploading global voice for animation:",
        error
      );
      console.error("[GLOBAL-VOICE] Error stack:", error.stack);
      res.status(500).json({
        success: false,
        message: "Failed to upload global voice",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };

// POST /api/learn/:id/global-voice - Upload global voice note (Hindi/English)
exports.uploadContentGlobalVoice = async (req, res) => {
    try {
      // Fetch user to check admin/team status
      const User = require("../models/User");
      const user = await User.findById(req.userId);

      if (!user || (!user.isAdmin && user.role !== "team")) {
        return res
          .status(403)
          .json({ success: false, message: "Admin/Team access required" });
      }

      const { id } = req.params;
      const { language } = req.body; // 'hindi' or 'english'

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No audio file provided" });
      }

      if (!["hindi", "english"].includes(language)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid language specified" });
      }

      const content = await LearnContent.findById(id);
      if (!content) {
        return res
          .status(404)
          .json({ success: false, message: "Content not found" });
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "video",
              folder: "medha/animation-global-voice",
              public_id: `${content.animationId}_global_${language}`,
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          )
          .end(req.file.buffer);
      });

      // Delete old file if exists
      const oldFileId =
        language === "hindi"
          ? content.audioHindiFileId
          : content.audioEnglishFileId;
      if (oldFileId) {
        try {
          await cloudinary.uploader.destroy(oldFileId, {
            resource_type: "video",
          });
        } catch (e) {
          console.warn("Failed to delete old audio:", e);
        }
      }

      // Update content
      if (language === "hindi") {
        content.audioHindiUrl = result.secure_url;
        content.audioHindiFileId = result.public_id;
      } else {
        content.audioEnglishUrl = result.secure_url;
        content.audioEnglishFileId = result.public_id;
      }

      await content.save();

      res.json({
        success: true,
        audioUrl: result.secure_url,
        language,
      });
    } catch (error) {
      console.error("Error uploading global voice:", error);
      res
        .status(500)
        .json({ success: false, message: "Failed to upload global voice" });
    }
  };


