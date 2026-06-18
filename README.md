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
