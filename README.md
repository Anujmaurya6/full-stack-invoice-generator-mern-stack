# ⚡ Genesis AI: The Ultimate Invoice Generator

Genesis AI is a premium, full-stack invoice management system powered by Google Gemini AI. It transforms simple text prompts into professional, multi-themed invoices in seconds.

## ✨ Features

- **🤖 AI-Driven Generation**: Powered by `gemini-1.5-flash` to architect invoices from natural language.
- **💎 Premium UI/UX**: State-of-the-art Glassmorphic design with active background blobs and smooth React transitions.
- **📈 Dashboard Analytics**: Track your total, paid, and unpaid invoices at a glance.
- **🎨 Dynamic Themes**: Automatically switches between "Modern Color" and "Minimalist Noir" based on your plan.
- **💳 Razorpay Integration**: Ready for seamless payment processing.
- **📄 PDF Export**: Professional invoice PDFs generated on the fly.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Tailwind CSS, Lucide Icons.
- **Backend**: Node.js, Express, Mongoose.
- **Database**: MongoDB Atlas.
- **AI**: Google Generative AI (Gemini).

## 🚀 Getting Started

### Prerequisites

- Node.js installed.
- MongoDB Atlas account.
- Gemini API Key.

### Installation

1. **Clone the Repo**:
   ```bash
   git clone https://github.com/Anujmaurya6/full-stack-invoice-generator-mern-stack.git
   ```

2. **Backend Setup**:
   ```bash
   cd backend
   npm install
   # Configure your .env with MONGO_URI, GEMINI_API_KEY, JWT_SECRET
   npm start
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   # Configure .env with VITE_API_URL
   npm run dev
   ```

## ☁️ Deployment

- **Frontend**: Optimized for Vercel.
- **Backend**: Optimized for Render (see `render.yaml`).


