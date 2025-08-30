# DopeX - AI-Powered SaaS Platform

<p align="center">
  <img src="./frontend/src/assets/main-logo.svg" alt="DopeX Logo" width="150"/>
</p>

<p align="center">
  A comprehensive, full-stack AI SaaS platform offering a suite of powerful tools for content creation, image manipulation, and intelligent assistance. Built with a modern stack including React, Node.js, and PostgreSQL, and integrated with leading AI APIs.
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#license">License</a>
</p>

---

## Features

DopeX provides a rich set of AI-driven tools designed to enhance creativity and productivity:

- DopeX Chat: An intelligent, conversational AI assistant for interactive queries and support.
- Article Generation: Instantly create high-quality articles and blog posts on any topic.
- AI Image Generation: Transform text prompts into stunning, unique images.
- Background & Object Removal: Effortlessly edit images by removing backgrounds or specific objects.
- Book Information: Get comprehensive details and summaries for any book.
- Resume Reviewer: Receive AI-powered feedback to analyze and improve your resume.
- Lyrics Finder: Instantly find the lyrics for your favorite songs.
- Workout & Gita Quotes: Generate motivational quotes for fitness and wisdom from the Bhagavad Gita.
- Secure User Authentication: Robust and secure user management powered by Clerk.

## Tech Stack

The project leverages a modern, powerful tech stack for optimal performance and scalability.

| Category      | Technologies                                                                 |
| :------------ | :--------------------------------------------------------------------------- |
| **Frontend**  | `React.js`, `Vite`, `Tailwind CSS`, `React Router`, `Axios`, `Framer Motion` |
| **Backend**   | `Node.js`, `Express.js`, `CORS`, `Multer`                                    |
| **Database**  | `PostgreSQL` (interfaced with `@neondatabase/serverless`)                    |
| **AI & APIs** | `OpenAI API`, `NVIDIA API`, `Google Books API`, `RapidAPI`                   |
| **Auth**      | `Clerk` (for secure frontend and backend authentication)                     |
| **Storage**   | `Cloudinary` (for cloud-based image and media management)                    |
| **DevOps**    | `Git`, `Render` (for deployment), `ESLint`                                   |

## Getting Started

Follow these instructions to set up and run the project on your local machine.

### Prerequisites

- Node.js (v18 or higher)
- NPM (Node Package Manager)
- A PostgreSQL database (e.g., a free tier from [Neon](https://neon.tech/))
- API keys for:
  - Clerk
  - OpenAI / Gemini
  - NVIDIA
  - Cloudinary
  - RapidAPI (for Bhagavad Gita)
  - Google Books API

### 1. Clone the Repository

```sh
git clone https://github.com/Nitish-ku/dopex.git
cd dopex
```

### 2. Backend Setup

Navigate to the server directory and create a `.env` file.

```sh
cd server
npm install
touch .env
```

Populate `server/.env` with your credentials:

```env
# Server Configuration
PORT=3001

# Database Connection (Neon)
PGHOST='your_neon_db_host'
PGDATABASE='your_neon_db_name'
PGUSER='your_neon_db_user'
PGPASSWORD='your_neon_db_password'

# Clerk Authentication
CLERK_PUBLISHABLE_KEY='your_clerk_publishable_key'
CLERK_SECRET_KEY='your_clerk_secret_key'

# AI & Service APIs
GEMINI_API_KEY='your_gemini_api_key'
CLIPDROP_API_KEY='your_clipdrop_api_key'
NVIDIA_API_KEY='your_nvidia_api_key'
X_RAPID_API='your_x_rapid_api_key'
GOOGLE_BOOKS_API='your_google_books_api_key'

# Cloudinary
CLOUDINARY_CLOUD_NAME='your_cloudinary_cloud_name'
CLOUDINARY_API_KEY='your_cloudinary_api_key'
CLOUDINARY_API_SECRET='your_cloudinary_api_secret'
```

### 3. Frontend Setup

Navigate to the frontend directory and create a `.env` file.

```sh
cd ../frontend
npm install
touch .env
```

Populate `frontend/.env` with your Clerk publishable key:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

### 4. Run the Application

You can run both the frontend and backend servers concurrently in separate terminals.

1.  **Start the backend server (from `/server`):**
    ```sh
    npm run server
    ```
2.  **Start the frontend server (from `/frontend`):**
    ```sh
    npm run dev
    ```

The frontend will be available at `http://localhost:5173`.

## 🚀 Deployment

This application is configured for easy deployment on platforms like Render. The `vercel.json` files in the `frontend` and `server` directories are pre-configured for vercel as well. Simply connect your repository to Vercel or Render and configure the environment variables in the project settings.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---
