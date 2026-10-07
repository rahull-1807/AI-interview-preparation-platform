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
- **Tectonic** for compiling LaTeX resume PDFs

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (Node 22.16 or newer on the Node 22 release line; the deployment image uses Node 22)
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

## Deploy on Render's Free plan

The root `Dockerfile` builds React and runs Express with Linux Tectonic. The frontend and API share one URL. The image precompiles a synthetic resume during its build to cache the template's TeX packages; no Gemini key or database connection is needed during the build. `.dockerignore` excludes credentials, local dependencies, generated documents, and the Windows compiler. Docker is not required on your computer to deploy through Render.

### 1. Push the deployment files

From the project root, run:

```powershell
npm --prefix frontend run build
npm --prefix frontend run lint
npm --prefix backend test
git diff --check
git add Dockerfile .dockerignore README.md backend/server.js backend/src/app.js backend/src/config/database.js backend/src/controllers/auth.controller.js
git commit -m "Prepare app for free Render deployment"
git push origin main
```

### 2. Create the web service

Sign in at [Render](https://dashboard.render.com/) with GitHub, choose **New > Web Service**, and connect `rahull-1807/AI-interview-preparation-platform`.

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Language/runtime | Docker |
| Root directory | Leave empty |
| Dockerfile path | `./Dockerfile` |
| Docker build context | `.` (if shown) |
| Docker command | Leave empty; use the Dockerfile's command |
| Instance type | **Free ($0)** |
| Health check path | `/api/health` |

Choose a region near your MongoDB cluster. Keep automatic deployment enabled if you want future pushes to `main` to redeploy the site.

### 3. Set secrets in Render

Add these under the service's **Environment** settings before deploying:

| Variable | Value |
| --- | --- |
| `MONGO_URI` | Your Atlas connection string, retaining your existing database selection |
| `JWT_SECRET` | A long random secret |
| `GOOGLE_GENAI_API_KEY` | Your Gemini API key |
| `NODE_ENV` | `production` |

Generate a JWT secret locally with:

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Enter environment values without surrounding quotation marks. Never put credentials in the Dockerfile, frontend, or Git repository. Rotate any database password previously shared publicly before using it here. Keep Atlas on the **Free/M0** cluster tier and use a Gemini project with free-tier quota for the configured model. Do not enable paid billing to increase quota if you want to stay on free plans.

Render supplies `PORT`; the server listens on `0.0.0.0` and waits for MongoDB before accepting requests. The image already sets the Linux `TECTONIC_PATH`; do not copy your local Windows path into Render.

### 4. Allow the service in Atlas

Click **Deploy Web Service**. Once the service exists, open **Connect > Outbound** on its Render page. Add every listed IP range in MongoDB Atlas under **Network Access > Add IP Address**, and wait for the entries to become active. If the initial deployment fails before the IP ranges are allowed, use **Manual Deploy > Deploy latest commit** afterward.

### 5. Verify the public site

Wait for **Live**, then open the assigned HTTPS `onrender.com` address. Check:

- `/api/health` returns HTTP 200 and `{"status":"ok"}`. It returns 503 if MongoDB disconnects.
- Registration, login, logout, and saved reports work.
- Evaluation produces a score, questions, and a preparation plan.
- Both resume downloads work, with only new suggestions highlighted in the review PDF.
- Refreshing a report's URL directly still opens the React page.

For failures, inspect Render's logs: database errors usually require checking the URI and Atlas access list; AI quota errors require checking AI Studio; PDF errors require checking Tectonic logs and available server memory. The free server's PDF performance must be verified after deployment.

### Free-plan limits

Render's Free web service sleeps after 15 minutes without traffic and typically takes about a minute to wake. Free instance hours, bandwidth, build usage, and Gemini quotas are limited. Without a payment method, Render suspends services or builds when billable allowances are exhausted instead of charging for overages. Use the included `onrender.com` address; buying a domain is optional.

Render's runtime filesystem is temporary. User accounts, reports, and cached resume drafts live in MongoDB; PDFs are compiled in temporary directories and returned as downloads. TeX packages warmed during the Docker build remain part of the image.

References: [Render Docker deployment](https://render.com/docs/docker), [free-plan limits](https://render.com/docs/free), [outbound IP ranges](https://render.com/docs/outbound-ip-addresses), and [Atlas network access](https://www.mongodb.com/docs/atlas/security/add-ip-address-to-list/).
