# Letsettle - Public Debate Voting Platform

<div align="center">

**Settle debates with public voting. Create polls, vote on options, and see live rankings.**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-green?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://letsettle.com) · [Report Bug](https://github.com/yourusername/letsettle/issues) · [Request Feature](https://github.com/yourusername/letsettle/issues)

</div>

---

## 📋 Table of Contents

-   [Features](#-features)
-   [Tech Stack](#-tech-stack)
-   [Getting Started](#-getting-started)
-   [Environment Variables](#-environment-variables)
-   [Database Schema](#-database-schema)
-   [API Routes](#-api-routes)
-   [Project Structure](#-project-structure)
-   [Deployment](#-deployment)
-   [Contributing](#-contributing)

---

## ✨ Features

### Core Functionality

-   🗳️ **Create Debates** - Start debates with multiple voting options
-   📊 **Live Voting** - Real-time vote counting and ranking
-   🔄 **Vote Changing** - Users can change their vote anytime
-   📈 **Live Rankings** - Options ranked by votes
-   ➕ **Add Options** - Suggest new options to existing debates

### User Experience

-   🎯 **No Registration Required** - Vote anonymously
-   🔒 **Fraud Prevention** - IP + fingerprint vote tracking
-   📱 **Fully Responsive** - Mobile-first design
-   🌙 **Clean Minimal UI** - No distractions, pure content
-   🔍 **Search & Filter** - Find debates by category or keyword
-   📄 **Pagination** - Browse large debate collections efficiently
-   📊 **Sorting Options** - Sort by trending, newest, or most voted
-   ✨ **AI Auto-fill** - Generate debate topics and options with Gemini AI
-   🪄 **Magic UI** - Skeleton loaders and smooth animations

### Social Features

-   🔗 **Share Debates** - Copy link or share to social media
-   📱 **Social Sharing** - Twitter, Facebook, LinkedIn, WhatsApp integration
-   🏆 **Trending Debates** - Discover popular discussions

### Technical Features

-   ⚡ **Server-Side Rendering** - Fast initial page loads
-   🎨 **Design System** - Consistent CSS variables
-   🔄 **Optimistic Updates** - Instant UI feedback
-   📊 **SEO Optimized** - Meta tags, OpenGraph, JSON-LD schema
-   🗄️ **Database Indexes** - Optimized query performance
-   🔐 **Input Validation** - Server and client-side validation
-   🧠 **AI Integration** - Google Gemini for content generation

---

## 🛡️ Content Moderation System

Letsettle includes a comprehensive moderation system to ensure high-quality debates.

### Input Validation

**Automatic checks prevent spam and low-quality content:**

-   Title: 10-150 characters
-   Description: Max 500 characters
-   Options: 2-50 characters each
-   Blocks excessive caps (max 50% uppercase)
-   Prevents emoji-only submissions
-   Detects spam patterns

### Pre-Moderation Queue

**All new debates require admin approval:**

-   Debates created with `pending` status
-   Only `approved` debates visible to public
-   Options remain unmoderated for smooth UX

### Admin Panel

Access at `/admin` with full management capabilities:

| Route            | Purpose                          |
| ---------------- | -------------------------------- |
| `/admin`         | Dashboard with statistics        |
| `/admin/login`   | Secure admin authentication      |
| `/admin/pending` | Review & approve/reject debates  |
| `/admin/debates` | Manage all debates (edit/delete) |
| `/admin/options` | View & delete user options       |

**Admin Features:**

-   ✅ Approve debates with one click
-   ✏️ Edit debate details (title, category, status, settings)
-   🗑️ Delete debates (cascade deletes all options)
-   🔍 Search & filter by status/category
-   📄 Pagination for large datasets

### Admin Setup

1. **Add credentials to `.env.local`:**

    ```env
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=YourSecurePassword123
    ADMIN_SECRET_TOKEN=GenerateRandomToken456
    ```

2. **Login at `/admin/login`**

3. **Start moderating at `/admin/pending`**

> ⚠️ **Security Note**: Current implementation uses simple token auth for MVP. For production, implement JWT, bcrypt password hashing, and proper session management.

---

## 🛠️ Tech Stack

### Frontend

-   **Framework**: [Next.js 14.2](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) + CSS Variables
-   **UI Components**: Custom components with Lucide icons
-   **Animation**: [Framer Motion](https://www.framer.com/motion/)
-   **Notifications**: [Sonner](https://sonner.emilkowal.ski/)

### Backend

-   **Runtime**: Node.js (via Next.js API Routes)
-   **Database**: [MongoDB](https://www.mongodb.com/) with Mongoose ODM
-   **AI Model**: [Google Gemini](https://ai.google.dev/)
-   **Fingerprinting**: Browser fingerprinting for vote tracking

### DevOps & Tools

-   **Version Control**: Git
-   **Package Manager**: npm
-   **Linting**: ESLint
-   **Type Checking**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

-   **Node.js** 18.0 or higher
-   **npm** or **yarn**
-   **MongoDB** database (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

1. **Clone the repository**

    ```bash
    git clone https://github.com/yourusername/letsettle.git
    cd letsettle
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Set up environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Edit `.env.local` with your MongoDB connection string.

4. **Run the development server**

    ```bash
    npm run dev
    ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Seed the Database (Optional)

To populate your database with sample debates:

```bash
# Visit this URL in your browser
http://localhost:3000/api/seed
```

This will create sample debates across various categories.

---

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/letsettle?retryWrites=true&w=majority
GEMINI_API_KEY=your_gemini_api_key

# Admin Authentication (Required for admin panel)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=YourSecurePassword123
ADMIN_SECRET_TOKEN=GenerateARandomSecureToken456

# Optional (for production)
NEXT_PUBLIC_APP_URL=https://yoursite.com
```

### Variable Descriptions

| Variable              | Description                 | Required           |
| --------------------- | --------------------------- | ------------------ |
| `MONGODB_URI`         | MongoDB connection string   | ✅ Yes             |
| `GEMINI_API_KEY`      | Google Gemini API Key       | ✅ Yes             |
| `ADMIN_USERNAME`      | Admin panel username        | ✅ Yes (for admin) |
| `ADMIN_PASSWORD`      | Admin panel password        | ✅ Yes (for admin) |
| `ADMIN_SECRET_TOKEN`  | Secret token for admin auth | ✅ Yes (for admin) |
| `NEXT_PUBLIC_APP_URL` | Public URL for share links  | No                 |

---

## 📊 Database Schema

### Collections

#### **Debates**

```typescript
{
  _id: ObjectId,
  slug: string,              // URL-friendly identifier
  title: string,             // Debate question
  description?: string,      // Optional context
  category: string,          // e.g., "Sports", "Technology"
  subCategory?: string,      // Optional subcategory
  totalVotes: number,        // Total vote count
  isActive: boolean,         // Can accept votes
  isMoreOptionAllowed: boolean, // Allow option suggestions
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

-   `slug` (unique)
-   `{ category: 1, totalVotes: -1 }`
-   `{ isActive: 1, totalVotes: -1 }`
-   `{ isActive: 1, createdAt: -1 }`

#### **Options**

```typescript
{
  _id: ObjectId,
  debateId: ObjectId,        // References Debate
  name: string,              // Option text
  votes: number,             // Vote count for this option
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

-   `debateId`

#### **Votes**

```typescript
{
  _id: ObjectId,
  debateId: ObjectId,        // References Debate
  optionId: ObjectId,        // References Option
  ip: string,                // User IP address
  fingerprintId: string,     // Browser fingerprint
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes**:

-   `{ debateId: 1, ip: 1 }` (unique)
-   `{ debateId: 1, fingerprintId: 1 }` (unique)

---

## 🔌 API Routes

### Debates

#### `GET /api/debate?category={category}`

Get debates by category.

**Query Params**:

-   `category` (optional): Filter by category

**Response**:

```json
{
    "debates": [
        {
            "_id": "...",
            "title": "Best Programming Language?",
            "category": "Technology",
            "totalVotes": 150
        }
    ]
}
```

#### `GET /api/debate/[slug]`

Get single debate with all options.

#### `POST /api/debate`

Create a new debate.

**Body**:

```json
{
    "title": "Debate question",
    "description": "Optional context",
    "category": "Technology",
    "subCategory": "Programming",
    "options": ["Option 1", "Option 2"],
    "isMoreOptionAllowed": true
}
```

**Status**: Creates debate with "pending" status

### Voting

#### `POST /api/vote`

Cast or change a vote.

**Body**:

```json
{
    "debateId": "...",
    "optionId": "...",
    "fingerprintId": "..."
}
```

**Response**:

```json
{
    "success": true,
    "isChange": false
}
```

### Options

#### `POST /api/option`

Add a new option to a debate.

**Body**:

```json
{
    "debateId": "...",
    "name": "New Option"
}
```

### Admin Endpoints

All admin routes require `x-admin-token` header.

#### Authentication

```
POST /api/admin/auth
Body: { username, password }
Returns: { token }
```

#### Debate Management

```
GET    /api/admin/debates                    # List all debates
GET    /api/admin/debates/:id                # Get single debate
PATCH  /api/admin/debates/:id                # Edit debate
DELETE /api/admin/debates/:id                # Delete debate + options
POST   /api/admin/debates/:id/approve        # Approve pending debate
POST   /api/admin/debates/:id/reject         # Reject debate
```

#### Options Management

```
GET    /api/admin/options                    # List all options
DELETE /api/admin/options/:id                # Delete option
```

---

## 📁 Project Structure

```
letsettle/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── debate/           # Public debate endpoints
│   │   ├── option/           # Option endpoints
│   │   ├── vote/             # Voting endpoints
│   │   └── admin/            # Admin endpoints
│   │       ├── auth/         # Admin login
│   │       ├── debates/      # Debate management
│   │       └── options/      # Option management
│   ├── admin/                # Admin panel pages
│   │   ├── login/            # Login page
│   │   ├── pending/          # Pending queue
│   │   ├── debates/          # All debates
│   │   └── options/          # Options management
│   ├── debate/[slug]/        # Debate detail pages
│   ├── all-debates/          # Browse all debates
│   ├── categories/           # Category browser
│   ├── create/               # Create debate form
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Homepage
│   └── globals.css           # Design system
├── components/               # React components
│   ├── admin/                # Admin components
│   │   ├── AdminNav.tsx      # Admin sidebar
│   │   ├── StatusBadge.tsx   # Status indicator
│   │   └── EditDebateModal.tsx # Edit modal
│   ├── AddOptionForm.tsx     # Add option UI
│   ├── DebateCard.tsx        # Debate preview card
│   ├── Navbar.tsx            # Navigation
│   ├── ShareButton.tsx       # Social sharing
│   ├── SortSelector.tsx      # Sort dropdown
│   └── VoteButton.tsx        # Voting interface
├── lib/                      # Utilities
│   ├── db.ts                 # MongoDB connection
│   ├── utils.ts              # Helper functions
│   ├── types.ts              # TypeScript types
│   ├── constants.ts          # App constants
│   ├── validators.ts         # Input validation
│   └── adminAuth.ts          # Admin authentication
├── models/                   # Mongoose models
│   ├── Debate.ts
│   ├── Option.ts
│   └── Vote.ts
├── public/                   # Static assets
├── .env.local                # Environment variables
├── next.config.mjs           # Next.js config
├── tailwind.config.ts        # Tailwind config
└── tsconfig.json             # TypeScript config
```

---

## 🌐 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

    ```bash
    git add .
    git commit -m "Initial commit"
    git push origin main
    ```

2. **Import to Vercel**
    - Go to [vercel.com](https://vercel.com)
    - Click "New Project"
    - Import your GitHub repository
    - Add environment variable: `MONGODB_URI`
    - Deploy!

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

-   Follow TypeScript best practices
-   Use meaningful variable and function names
-   Add comments for complex logic
-   Test changes locally before submitting
-   Keep the minimal design aesthetic

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

-   Design inspiration from minimal editorial platforms
-   Icons from [Lucide](https://lucide.dev/)
-   Built with [Next.js](https://nextjs.org/)
-   Database powered by [MongoDB](https://www.mongodb.com/)

---

## 📧 Contact

**Project Link**: [https://github.com/mohdrafey1/letsettle](https://github.com/mohdrafey1/letsettle)

---

<div align="center">

Made with ❤️ by the Mohd Rafey

</div>
