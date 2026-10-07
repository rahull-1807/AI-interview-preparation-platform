# AI-Powered Interview Preparation Platform

An intelligent platform designed to help users prepare for interviews using Artificial Intelligence. This application leverages Google's Gemini AI to provide dynamic interview questions and feedback, complete with resume parsing and personalized insights.

## 🚀 Features

- **User Authentication**: Secure login and registration using JWT and bcrypt.
- **AI-Driven Interviews**: Generates tailored interview questions based on user profiles or job descriptions using Google Gemini AI.
- **Resume Parsing**: Upload your resume (PDF) and the system will extract key information to customize the interview experience.
- **Modern UI**: Clean and responsive user interface built with React and Vite.

## 🛠️ Tech Stack

### Frontend
- **React 19**
- **Vite**
- **React Router** for navigation
- **Sass** for styling

### Backend
- **Node.js & Express.js**
- **MongoDB & Mongoose**
- **Google Gemini AI SDK** (`@google/genai`)
- **JWT** for secure authentication
- **Multer & PDF-Parse** for handling resume uploads and text extraction
- **Puppeteer** for web scraping capabilities

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas instance)

## 📦 Installation & Setup

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd "genai project"
   ```

2. **Setup the Backend**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the `backend` directory with the following variables:
     ```env
     MONGO_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret_key
     GOOGLE_GENAI_API_KEY=your_google_gemini_api_key
     ```
   - Start the backend development server:
     ```bash
     npm start
     ```

3. **Setup the Frontend**
   - Open a new terminal and navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Start the Vite development server:
     ```bash
     npm run dev
     ```
   - Open the application in your browser at the URL provided by Vite (usually `http://localhost:5173`).

## 📁 Project Structure

```text
genai project/
├── backend/                # Node.js Express Server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # Route controllers
│   │   ├── middlewares/    # Custom middlewares (e.g., auth)
│   │   ├── models/         # Mongoose schemas
│   │   ├── routes/         # Express routes (auth, interview)
│   │   └── services/       # Business logic and AI integrations
│   ├── .env                # Environment variables
│   ├── package.json        
│   └── server.js           # Server entry point
└── frontend/               # React Vite Application
    ├── src/
    │   ├── assets/         # Static assets
    │   ├── features/       # Feature-based modules (auth, interview)
    │   ├── style/          # Global styles
    │   ├── App.jsx         # Main App component
    │   ├── app.routes.jsx  # React Router configuration
    │   └── main.jsx        # React DOM rendering
    ├── package.json        
    └── vite.config.js      # Vite configuration
```

## PDF resumes generated with LaTeX

The **Download Resume PDF** button generates candidate content, inserts it into the supplied LaTeX template, compiles it locally with Tectonic, and downloads a PDF. No Overleaf step is needed.

The template lives in `backend/src/templates/resume.tex`. Unknown details are omitted, and candidate text is escaped before insertion. The authenticated endpoint is `POST /api/interview/resume/pdf/:interviewReportId`.

### Compiler setup on another machine

Install Tectonic from https://tectonic-typesetting.github.io/book/latest/installation/ and either put it on PATH or set `TECTONIC_PATH` in `backend/.env` to its executable's absolute path. On this Windows workspace it is already installed in `backend/tools/tectonic/tectonic.exe` (ignored by Git).

Tectonic downloads required TeX packages on the first run and caches them locally. Compilation uses a private temporary directory, disables unsafe TeX features, and removes temporary files afterward. A sample compiled PDF is in `output/pdf/sample-resume.pdf`.

Before starting the app on a fresh machine, warm the compiler cache from the project root with `tectonic -X compile --untrusted artifacts/sample-resume.tex`. This first run may take several minutes; subsequent downloads use the cache. Run `npm --prefix backend run test:resume` to verify real PDF compilation and download handling (AI and database are mocked in these tests).

### Evaluation validation and review PDF

Interview evaluation requires a score, a short title, a score explanation, complete technical and behavioral questions, and a preparation plan. Invalid AI responses are retried once and are never saved as successful reports. Existing incomplete reports can be repaired with **Retry evaluation** (`POST /api/interview/report/:interviewId/regenerate`). The score is an AI estimate based on the supplied profile, with its reasoning displayed in the report.

**Download highlighted PDF** uses the same saved resume draft as the clean PDF and appends a clearly labeled suggestions section. Only new suggested skills receive yellow highlighting; existing skills and factual resume content stay unmarked. Known skills and common aliases are filtered against the original profile and the generated factual resume. Suggestions describe skills to develop, not qualifications already held. This download uses `POST /api/interview/resume/pdf/:interviewReportId?highlighted=true`. Reevaluating a report invalidates the cached resume draft so subsequent downloads reflect the new evaluation.

Run `npm --prefix backend test` for report validation, suggestion filtering, real LaTeX compilation, and clean/highlighted PDF controller checks.
