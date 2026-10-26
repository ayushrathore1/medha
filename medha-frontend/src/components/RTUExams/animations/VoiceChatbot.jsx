/**
 * VoiceChatbot - Voice-based AI assistant for animations
 * Uses MediaRecorder API for audio capture + Groq Whisper for transcription
 * More reliable than Web Speech API
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import {
  FaMicrophone,
  FaTimes,
  FaVolumeUp,
  FaStop,
  FaRobot,
} from "react-icons/fa";

const APPLE_THEME = {
  bg: "#000000",
  surface: "#1c1c1e",
  surfaceHover: "#2c2c2e",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#0A84FF",
  text: "#F5F5F7",
  textSec: "#86868B",
  success: "#30D158",
  danger: "#FF453A",
  warning: "#FFD60A",
};

const VoiceChatbot = ({
  animationTitle,
  currentStep,
  totalSteps,
  isVisible = true,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [response, setResponse] = useState("");
  const [error, setError] = useState(null);
  const [conversationHistory, setConversationHistory] = useState([]);
  const [audioLevel, setAudioLevel] = useState(0);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const analyserRef = useRef(null);
  const animationFrameRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);
  const utteranceRef = useRef(null);
  const hasAudioRef = useRef(false);
  const maxAudioLevelRef = useRef(0);
  const recordingStartTimeRef = useRef(null);

  const baseUrl = import.meta.env.VITE_BACKEND_URL;

  // Speak text using Web Speech API
  const speakText = useCallback((text) => {
    if (!synthRef.current) return;

    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Clean text for speech
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "code block")
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/#{1,6}\s/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/`([^`]+)`/g, "$1");

    utteranceRef.current = new SpeechSynthesisUtterance(cleanText);
    utteranceRef.current.lang = "en-US";
    utteranceRef.current.rate = 1.0;
    utteranceRef.current.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const preferredVoice =
      voices.find(
        (v) => v.name.includes("Google") && v.lang.startsWith("en")
      ) ||
      voices.find((v) => v.lang === "en-US") ||
      voices[0];

    if (preferredVoice) {
      utteranceRef.current.voice = preferredVoice;
    }

    utteranceRef.current.onstart = () => setIsSpeaking(true);
    utteranceRef.current.onend = () => setIsSpeaking(false);
    utteranceRef.current.onerror = () => setIsSpeaking(false);

    synthRef.current.speak(utteranceRef.current);
  }, []);

  // Process audio and get AI response
  const processAudio = useCallback(
    async (audioBlob) => {
      setIsProcessing(true);
      setError(null);
      setTranscript("Processing audio...");

      try {
        const token = localStorage.getItem("token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // Create form data with audio
        const formData = new FormData();
        formData.append("audio", audioBlob, "recording.webm");
        formData.append("animationTitle", animationTitle || "");
        formData.append("currentStep", currentStep || "");
        formData.append("totalSteps", totalSteps || "");

        console.log("📤 Sending audio to backend for transcription...");
        console.log("   - Audio size:", audioBlob.size, "bytes");
        console.log("   - Audio type:", audioBlob.type);

        // Send to backend for transcription + AI response
        const res = await axios.post(`${baseUrl}/api/voice/ask`, formData, {
          headers: {
            ...headers,
            "Content-Type": "multipart/form-data",
          },
          timeout: 60000,
        });

        const {
          transcript: userQuestion,
          answer,
          isEmpty,
          isTooShort,
        } = res.data;

        console.log("📝 Transcription:", userQuestion || "(empty)");
        console.log("🤖 AI Response:", answer);

        // Handle empty or problematic transcriptions
        if (isEmpty || isTooShort) {
          setTranscript(userQuestion || "");
          setError(answer);
          return;
        }

        setTranscript(userQuestion || "Could not understand audio");
        setResponse(answer);

        // Update conversation history
        if (userQuestion && answer) {
          setConversationHistory((prev) => [
            ...prev,
            { role: "user", content: userQuestion },
            { role: "assistant", content: answer },
          ]);
        }

        // Speak the response
        if (answer) {
          speakText(answer);
        }
      } catch (err) {
        console.error("❌ Processing error:", err);
        console.error("   - Response:", err.response?.data);
        console.error("   - Status:", err.response?.status);

        let errorMsg =
          "Sorry, I couldn't process your audio. Please try again.";

        if (err.response?.data?.message) {
          errorMsg = err.response.data.message;
        } else if (err.code === "ECONNABORTED") {
          errorMsg =
            "Request timed out. Please try again with a shorter message.";
        } else if (err.response?.status === 429) {
          errorMsg = "Too many requests. Please wait a moment and try again.";
        } else if (err.response?.status >= 500) {
          errorMsg = "Server error. Please try again later.";
        }

        setError(errorMsg);
        setTranscript("");
      } finally {
        setIsProcessing(false);
      }
    },
    [baseUrl, animationTitle, currentStep, totalSteps, speakText]
  );

  // Monitor audio levels for visual feedback and detect actual speech
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average level
    const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
    const normalizedLevel = average / 255;
    setAudioLevel(normalizedLevel);

    // Track maximum audio level to detect if user actually spoke
    if (normalizedLevel > maxAudioLevelRef.current) {
      maxAudioLevelRef.current = normalizedLevel;
    }

    // Consider audio as "real speech" if level exceeds threshold (0.05 = 5%)
    if (normalizedLevel > 0.05) {
      hasAudioRef.current = true;
    }

    if (isListening) {
      animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
    }
  }, [isListening]);

  // Start recording
  const startListening = useCallback(async () => {
    try {
      console.log("🎤 Requesting microphone access...");

      // Reset audio detection flags
      hasAudioRef.current = false;
      maxAudioLevelRef.current = 0;
      recordingStartTimeRef.current = Date.now();

      // Request microphone with specific constraints for better quality
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 16000,
          channelCount: 1, // Mono for better speech recognition
        },
      });

      streamRef.current = stream;
      console.log("✅ Microphone access granted");

      // Set up audio analyser for level monitoring
      const audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
      const source = audioContext.createMediaStreamSource(stream);
      analyserRef.current = audioContext.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      // Determine supported MIME type
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";

      console.log("📼 Using MIME type:", mimeType);

      // Create MediaRecorder
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
          console.log("📦 Audio chunk received:", event.data.size, "bytes");
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        console.log("🛑 Recording stopped, processing...");
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        const recordingDuration = Date.now() - recordingStartTimeRef.current;

        console.log("🎵 Total audio size:", audioBlob.size, "bytes");
        console.log("⏱️ Recording duration:", recordingDuration, "ms");
        console.log(
          "📊 Max audio level detected:",
          maxAudioLevelRef.current.toFixed(3)
        );
        console.log("🗣️ Speech detected:", hasAudioRef.current);

        // Validate recording quality
        const MIN_DURATION = 500; // At least 500ms
        const MIN_SIZE = 1000; // At least 1KB
        const MIN_AUDIO_LEVEL = 0.03; // At least 3% peak audio level

        if (recordingDuration < MIN_DURATION) {
          setError(
            "Recording too short. Please hold and speak for at least 1 second."
          );
          return;
        }

        if (audioBlob.size < MIN_SIZE) {
          setError("Recording too short. Please speak longer.");
          return;
        }

        if (
          !hasAudioRef.current &&
          maxAudioLevelRef.current < MIN_AUDIO_LEVEL
        ) {
          setError(
            "No speech detected. Please speak louder or check your microphone."
          );
          return;
        }

        // All checks passed, process the audio
        await processAudio(audioBlob);
      };

      // Start recording
      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsListening(true);
      setError(null);
      setTranscript("");
      setIsExpanded(true);

      // Start monitoring audio levels
      monitorAudioLevel();

      console.log("🎙️ Recording started - SPEAK NOW!");
    } catch (err) {
      console.error("❌ Failed to start recording:", err);
      if (err.name === "NotAllowedError") {
        setError(
          "Microphone access denied. Please allow microphone access in browser settings."
        );
      } else if (err.name === "NotFoundError") {
        setError("No microphone found. Please connect a microphone.");
      } else {
        setError(`Failed to start recording: ${err.message}`);
      }
    }
  }, [processAudio, monitorAudioLevel]);

  // Stop recording
  const stopListening = useCallback(() => {
    console.log("🔇 Stopping recording...");

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== "inactive"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    setIsListening(false);
    setAudioLevel(0);
  }, []);

  // Stop speaking
  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setIsSpeaking(false);
  }, []);

  // Handle mic button click
  const handleMicClick = useCallback(() => {
    if (isListening) {
      stopListening();
    } else if (isSpeaking) {
      stopSpeaking();
    } else if (!isProcessing) {
      startListening();
    }
  }, [
    isListening,
    isSpeaking,
    isProcessing,
    startListening,
    stopListening,
    stopSpeaking,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Mic Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleMicClick}
        disabled={isProcessing}
        style={{
          position: "fixed",
          bottom: "100px",
          right: "24px",
          width: "56px",
          height: "56px",
          borderRadius: "50%",
          background: isProcessing
            ? `linear-gradient(135deg, ${APPLE_THEME.warning}, #ffa500)`
            : isListening
              ? `linear-gradient(135deg, ${APPLE_THEME.danger}, #ff6b6b)`
              : isSpeaking
                ? `linear-gradient(135deg, ${APPLE_THEME.success}, #52c41a)`
                : `linear-gradient(135deg, ${APPLE_THEME.accent}, #5e5ce6)`,
          border: "none",
          cursor: isProcessing ? "wait" : "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isListening
            ? `0 0 ${30 + audioLevel * 30}px ${APPLE_THEME.danger}${Math.floor(60 + audioLevel * 40).toString(16)}`
            : `0 8px 32px rgba(10, 132, 255, 0.4)`,
          zIndex: 10000,
          transform: isListening
            ? `scale(${1 + audioLevel * 0.2})`
            : "scale(1)",
          transition: "transform 0.1s ease-out",
        }}
      >
        {isListening ? (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <FaStop color="white" size={20} />
          </motion.div>
        ) : isSpeaking ? (
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 0.5 }}
          >
            <FaVolumeUp color="white" size={20} />
          </motion.div>
        ) : (
          <FaMicrophone color="white" size={20} />
        )}
      </motion.button>

      {/* Listening Indicator Pulse */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              position: "fixed",
              bottom: "100px",
              right: "24px",
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: APPLE_THEME.danger,
              zIndex: 9999,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Expanded Chat Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{
              position: "fixed",
              bottom: "170px",
              right: "24px",
              width: "340px",
              maxHeight: "400px",
              background: "rgba(28, 28, 30, 0.95)",
              backdropFilter: "blur(20px)",
              borderRadius: "20px",
              border: `1px solid ${APPLE_THEME.border}`,
              boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
              zIndex: 10000,
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "16px",
                borderBottom: `1px solid ${APPLE_THEME.border}`,
                background: "rgba(10, 132, 255, 0.1)",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <FaRobot color={APPLE_THEME.accent} size={18} />
                <span
                  style={{
                    color: APPLE_THEME.text,
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  Medha Voice Assistant
                </span>
              </div>
              <button
                onClick={() => {
                  setIsExpanded(false);
                  stopListening();
                  stopSpeaking();
                }}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  padding: "4px",
                }}
              >
                <FaTimes color={APPLE_THEME.textSec} size={16} />
              </button>
            </div>

            {/* Content */}
            <div
              style={{ padding: "16px", maxHeight: "300px", overflowY: "auto" }}
            >
              {/* Status Indicator */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  marginBottom: "16px",
                  padding: "10px",
                  background: isListening
                    ? "rgba(255, 69, 58, 0.1)"
                    : isSpeaking
                      ? "rgba(48, 209, 88, 0.1)"
                      : isProcessing
                        ? "rgba(255, 214, 10, 0.1)"
                        : "rgba(10, 132, 255, 0.1)",
                  borderRadius: "12px",
                }}
              >
                {isListening ? (
                  <>
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ repeat: Infinity, duration: 0.5 }}
                      style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        background: APPLE_THEME.danger,
                      }}
                    />
                    <span
                      style={{
                        color: APPLE_THEME.danger,
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      🎤 Recording... (tap to stop)
                    </span>
                  </>
                ) : isSpeaking ? (
                  <>
                    <FaVolumeUp color={APPLE_THEME.success} size={14} />
                    <span
                      style={{
                        color: APPLE_THEME.success,
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Speaking...
                    </span>
                  </>
                ) : isProcessing ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 1,
                        ease: "linear",
                      }}
                      style={{
                        width: "14px",
                        height: "14px",
                        border: `2px solid ${APPLE_THEME.warning}`,
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                      }}
                    />
                    <span
                      style={{
                        color: APPLE_THEME.warning,
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Thinking...
                    </span>
                  </>
                ) : (
                  <>
                    <FaMicrophone color={APPLE_THEME.accent} size={14} />
                    <span
                      style={{
                        color: APPLE_THEME.accent,
                        fontSize: "13px",
                        fontWeight: 500,
                      }}
                    >
                      Tap mic to ask a question
                    </span>
                  </>
                )}
              </div>

              {/* Transcript */}
              {transcript && (
                <div style={{ marginBottom: "12px" }}>
                  <div
                    style={{
                      color: APPLE_THEME.textSec,
                      fontSize: "11px",
                      marginBottom: "4px",
                    }}
                  >
                    You said:
                  </div>
                  <div
                    style={{
                      color: APPLE_THEME.text,
                      fontSize: "14px",
                      padding: "10px",
                      background: "rgba(255, 255, 255, 0.05)",
                      borderRadius: "10px",
                    }}
                  >
                    "{transcript}"
                  </div>
                </div>
              )}

              {/* Response */}
              {response && (
                <div>
                  <div
                    style={{
                      color: APPLE_THEME.textSec,
                      fontSize: "11px",
                      marginBottom: "4px",
                    }}
                  >
                    Medha:
                  </div>
                  <div
                    style={{
                      color: APPLE_THEME.text,
                      fontSize: "13px",
                      lineHeight: 1.6,
                      padding: "10px",
                      background: `linear-gradient(135deg, rgba(10, 132, 255, 0.1), rgba(94, 92, 230, 0.05))`,
                      borderRadius: "10px",
                      border: `1px solid ${APPLE_THEME.accent}20`,
                      maxHeight: "150px",
                      overflowY: "auto",
                    }}
                  >
                    {response}
                  </div>
                </div>
              )}

              {/* Error */}
              {error && (
                <div
                  style={{
                    color: APPLE_THEME.danger,
                    fontSize: "13px",
                    padding: "10px",
                    background: "rgba(255, 69, 58, 0.1)",
                    borderRadius: "10px",
                    marginTop: "8px",
                  }}
                >
                  {error}
                </div>
              )}
            </div>

            {/* Footer Tips */}
            <div
              style={{
                padding: "12px 16px",
                borderTop: `1px solid ${APPLE_THEME.border}`,
                background: "rgba(0, 0, 0, 0.3)",
              }}
            >
              <div
                style={{
                  color: APPLE_THEME.textSec,
                  fontSize: "11px",
                  textAlign: "center",
                }}
              >
                💡 Ask about: "{animationTitle}" concepts
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceChatbot;
