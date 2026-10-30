# MEDHA Backend 🎓

**Canonical production API.** The copy at `medha-next/backend` is frozen and must not be patched. Contract: [docs/API_CONTRACT.md](../docs/API_CONTRACT.md). Owners and migration: [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md).

> A comprehensive backend API service for the MEDHA learning platform, providing intelligent study tools, note management, flashcard generation, quiz functionality, and AI-powered chatbot assistance.

## 📖 Overview

MEDHA Backend is a robust Node.js/Express API that powers the MEDHA educational platform. It provides a complete suite of features for modern digital learning, including:

- **Smart Note Management**: Create, organize, and manage study notes with subject categorization
- **AI-Powered Flashcard Generation**: Automatically generate flashcards from notes using Google's Gemini AI
- **Interactive Quiz System**: Create and take quizzes with instant scoring and feedback
- **OCR Text Extraction**: Extract text from images using Google Cloud Vision API
- **AI Chatbot**: Get instant study assistance with context-aware responses
- **User Authentication**: Secure JWT-based authentication system
- **Subject Organization**: Organize learning materials by subject

## ✨ Features

### 🔐 Authentication & User Management
- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Token-based session management
- User profile management

### 📝 Note Management
- Create, read, update, and delete notes
- Subject-based organization
- Rich text content support
- Search and filter capabilities
- User-specific note isolation

### 🃏 Flashcard System
- Manual flashcard creation
- AI-powered automatic flashcard generation from notes
- Subject and note association
- CRUD operations on flashcards
- Study mode support

### 📋 Quiz Functionality
- Create custom quizzes with multiple-choice questions
- Subject-based quiz organization
- Automatic scoring system
- Quiz submission and results tracking
- Performance analytics

### 🤖 AI-Powered Features
- **Gemini AI Integration**: Generate flashcards automatically from note content
- **Chatbot Assistant**: Interactive study assistant powered by Gemini AI
- **Context-Aware Responses**: Get relevant answers to study questions

### 📷 OCR (Optical Character Recognition)
- Extract text from images using Google Cloud Vision API
- Support for various image formats
- Batch processing capability

### 🎯 Subject Organization
- Create and manage subjects
- Associate notes, flashcards, and quizzes with subjects
- Subject-based content filtering

## 🛠 Tech Stack

### Core Technologies
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Security**: bcrypt

### AI & Cloud Services
- **AI Model**: Google Gemini AI (generative-ai)
- **OCR**: Google Cloud Vision API
- **File Storage**: Cloudinary

### Middleware & Utilities
- **File Upload**: Multer
- **Environment Variables**: dotenv
- **CORS**: cors
- **Request Parsing**: body-parser, cookie-parser
- **Security**: express-validator

## 📦 Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- Google Cloud Platform account (for Vision API)
- Google AI Studio API key (for Gemini AI)
- Cloudinary account (for file storage)

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/ayushrathore1/medha-backend.git
   cd medha-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory with the following variables:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development

   # Database
   MONGODB_URI=your_mongodb_connection_string

   # Authentication
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d

   # Google Gemini AI
   GEMINI_API_KEY=your_gemini_api_key

   # Google Cloud Vision (OCR)
   GOOGLE_CLOUD_PROJECT_ID=your_project_id
   GOOGLE_CLOUD_KEY_FILE=path_to_service_account_json

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **For production**
   ```bash
   npm start
   ```

## 🗂 Project Structure

```
medha-backend/
├── config/              # Configuration files
│   ├── db.js           # Database connection
│   ├── cloudinary.js   # Cloudinary configuration
│   └── env.js          # Environment variables
├── controllers/         # Request handlers
│   ├── authController.js
│   ├── chatbotController.js
│   ├── flashcardController.js
│   ├── noteController.js
│   ├── ocrController.js
│   ├── quizController.js
│   ├── subjectController.js
│   └── userController.js
├── middleware/          # Custom middleware
│   ├── auth.js         # JWT authentication
│   ├── errorHandler.js # Global error handler
│   └── upload.js       # File upload handling
├── models/              # Database models
│   ├── User.js         # User schema
│   ├── Subject.js      # Subject schema
│   ├── Note.js         # Note schema
│   ├── Flashcard.js    # Flashcard schema
│   └── Quiz.js         # Quiz schema
├── routes/              # API routes
│   ├── authRoutes.js
│   ├── chatbotRoutes.js
│   ├── flashcardRoutes.js
│   ├── noteRoutes.js
│   ├── ocrRoutes.js
│   ├── quizRoutes.js
│   ├── subjectRoutes.js
│   └── userRoutes.js
├── utils/               # Utility functions
├── seed/                # Database seeding scripts
├── app.js               # Canonical Express app (middleware + routes). Tests import this.
├── server.js            # Process entry: HTTP listen + MongoDB (`npm start`)
└── package.json         # Dependencies
```

**Entry points:** `app.js` is the one middleware/route stack. It does not bind a port or open MongoDB. `server.js` loads that app, listens on `0.0.0.0`, then connects to MongoDB. `npm start` / `npm run dev` run `server.js`. Jest imports `app.js` so tests hit the same stack as production.

Middleware order in `app.js`: Helmet → compression → CORS → static `/uploads/notes` → body size validator → JSON/urlencoded → mongo-sanitize → HPP → security logger → suspicious-activity detector → request timeout → general rate limiter → routes → 404 → upload error handler → error handler.

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user (protected)
- `GET /api/auth/google` - Start Google OAuth (sets HttpOnly `oauth_state` cookie)
- `GET /api/auth/google/callback` - Google callback; redirects with a one-time `code` only
- `POST /api/auth/google/exchange` - Exchange that `code` for `{ token, user }`

### User Management
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)

### Subjects
- `GET /api/subjects` - Get all subjects (protected)
- `POST /api/subjects` - Create new subject (protected)
- `GET /api/subjects/:id` - Get subject by ID (protected)
- `PUT /api/subjects/:id` - Update subject (protected)
- `DELETE /api/subjects/:id` - Delete subject (protected)

### Notes
- `GET /api/notes` - Get all notes (protected)
- `POST /api/notes` - Create new note (protected)
- `GET /api/notes/:id` - Get note by ID (protected)
- `PUT /api/notes/:id` - Update note (protected)
- `DELETE /api/notes/:id` - Delete note (protected)
- `GET /api/notes/subject/:subjectId` - Get notes by subject (protected)

### Flashcards
- `GET /api/flashcards` - Get all flashcards (protected)
- `POST /api/flashcards` - Create flashcard (protected)
- `POST /api/flashcards/generate` - Generate flashcards from note using AI (protected)
- `GET /api/flashcards/:id` - Get flashcard by ID (protected)
- `PUT /api/flashcards/:id` - Update flashcard (protected)
- `DELETE /api/flashcards/:id` - Delete flashcard (protected)
- `GET /api/flashcards/subject/:subjectId` - Get flashcards by subject (protected)

### Quizzes
- `GET /api/quizzes` - Get all quizzes (protected)
- `POST /api/quizzes` - Create quiz (protected)
- `GET /api/quizzes/:id` - Get quiz by ID (protected)
- `PUT /api/quizzes/:id` - Update quiz (protected)
- `DELETE /api/quizzes/:id` - Delete quiz (protected)
- `POST /api/quizzes/:id/submit` - Submit quiz answers (protected)
- `GET /api/quizzes/subject/:subjectId` - Get quizzes by subject (protected)

### Chatbot
- `POST /api/chatbot/chat` - Send message to AI chatbot (protected)

### OCR
- `POST /api/ocr/extract` - Extract text from image (protected)

## 📊 Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  createdAt: Date
}
```

### Subject
```javascript
{
  name: String,
  description: String,
  user: ObjectId (ref: User),
  createdAt: Date
}
```

### Note
```javascript
{
  title: String,
  content: String,
  subject: ObjectId (ref: Subject),
  user: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Flashcard
```javascript
{
  question: String,
  answer: String,
  subject: ObjectId (ref: Subject),
  note: ObjectId (ref: Note),
  user: ObjectId (ref: User),
  createdAt: Date
}
```

### Quiz
```javascript
{
  title: String,
  description: String,
  subject: ObjectId (ref: Subject),
  questions: [{
    question: String,
    options: [String],
    correctAnswer: Number
  }],
  user: ObjectId (ref: User),
  createdAt: Date
}
```

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Protected routes require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

To authenticate:
1. Register, login, or complete Google OAuth to receive a JWT token
2. Include the token in the Authorization header for protected routes
3. Session JWTs expire after **7 days**. There is no refresh-token rotation; after expiry the user signs in again.
4. Logout is client-side: the SPA clears `localStorage` (`token` and `user`). JWTs are not revoked on the server before they expire.

Google OAuth never puts access tokens or JWTs in redirect URLs. `GET /api/auth/google` stores CSRF `state` in an HttpOnly `SameSite=Lax` cookie on the API host. The callback validates that cookie against Google's `state`, then redirects to the allowlisted frontend with a single-use `code` (60s TTL). `POST /api/auth/google/exchange` returns the JWT in the JSON body and invalidates the code. `FRONTEND_URL` must be on the origin allowlist (add extras via `OAUTH_ALLOWED_ORIGINS`).

## 🧪 Development

### Running in Development Mode
```bash
npm run dev
```

### Environment Setup
Ensure all environment variables are properly configured in the `.env` file before running the application.

### Database Seeding
Use the scripts in the `seed/` directory to populate the database with sample data for testing.

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message"
}
```

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Code Style
- Follow existing code conventions
- Use meaningful variable and function names
- Add comments for complex logic
- Update documentation as needed

### Commit Messages
- Use clear, descriptive commit messages
- Follow conventional commits format (e.g., `feat:`, `fix:`, `docs:`)

## 📄 License

This project is private and proprietary.

## 👤 Author

**Ayush Rathore**
- GitHub: [@ayushrathore1](https://github.com/ayushrathore1)

## 🙏 Acknowledgments

- Groq AI for intelligent content generation
- Google Cloud Vision API for OCR capabilities
- Cloudinary for reliable file storage
- MongoDB for flexible data storage
- Express.js community for excellent documentation

## 📞 Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Happy Learning with MEDHA! 📚✨**
