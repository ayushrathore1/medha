# MEDHA - Intelligent Study Companion Features

MEDHA is a comprehensive educational platform designed to enhance learning through AI-powered tools, efficient organization, and interactive study methods. Below is a detailed list of the application's features.

## 🔐 Authentication & User Management
- **Secure Login & Registration**: Users can create accounts and log in securely using JWT-based authentication.
- **Password Recovery**: "Forgot Password" functionality allows users to reset their credentials via email verification.
- **Profile Management**: Users can view and manage their profile details, including avatars.
- **Protected Routes**: Ensures that sensitive data and features are only accessible to authenticated users.

## 🏠 Dashboard
The central hub of the application, providing a snapshot of the user's learning progress.
- **Personalized Greeting**: Welcomes the user based on the time of day.
- **Real-time Statistics**: Displays key metrics such as:
  - **Day Streak**: Tracks consistent study habits.
  - **Cards Learned**: Total number of flashcards mastered.
  - **Average Accuracy**: Performance metric from quizzes and reviews.
- **AI Daily Coach**: Generates a personalized daily study plan based on the user's current tasks and goals using AI.
- **To-Do List**: A built-in task manager to add, check off, and delete study tasks.
- **Subject Manager**: Allows users to organize their study materials by creating and managing specific subjects.
- **Review Reminders**: Highlights topics that need revision based on spaced repetition principles.
- **Productivity Tools**:
  - **Live Clock**: Displays current time.
  - **Calendar**: Visual reference for dates.
  - **Study Timer**: A stopwatch/timer to track study sessions.

## 🗂️ Flashcards
An interactive way to memorize and review concepts.
- **Topic-Based Organization**: Flashcards are grouped by specific topics for focused study.
- **AI Generation**: Users can generate flashcards automatically for a topic using AI.
- **Manual Creation**: Users can manually create custom flashcards with questions and answers.
- **Review Mode**: Interactive interface to flip cards and mark them as "Known" or "Unknown" to track learning progress.

## 📝 Notes
A dedicated space for comprehensive study notes.
- **Rich Text/Markdown Support**: Create detailed notes for different subjects.
- **Organization**: Notes are categorized by subject and topic for easy retrieval.
- **CRUD Operations**: Full capability to Create, Read, Update, and Delete notes.

## 🧠 Quiz
Test knowledge and assess understanding.
- **Topic Selection**: Users can choose specific topics to take quizzes on.
- **AI-Generated Questions**: Quizzes are dynamically generated to ensure variety and relevance.
- **Score Tracking**: Immediate feedback on performance with scores and accuracy percentages.

## 🤖 AI Chatbot
An intelligent study assistant available 24/7.
- **Contextual Help**: Ask questions related to study materials or general knowledge.
- **Instant Explanations**: Get clarifications on complex topics instantly.
- **Interactive Learning**: Engage in a dialogue to deepen understanding of subjects.

## 💬 Feedback
- **User Feedback Form**: A dedicated channel for users to send suggestions, report bugs, or provide general feedback to the developers.

## 🎨 UI/UX Design
- **Responsive Layout**: Fully optimized for different screen sizes (desktop, tablet, mobile).
- **Modern Aesthetics**: Features a clean, glassmorphism-inspired design with smooth gradients and animations.
- **Interactive Elements**: Utilizes `framer-motion` for smooth page transitions and component animations.
- **Theme Consistency**: A unified color palette and design language across all pages.
