# VibeCheck | Frontend for the Sentiment Analysis Tool

> Wanna check the vibe? VibeCheck is a lightweight sentiment analysis frontend built to analyze text and social media content with a sleek UI and real-time insights. It's designed to work with the FastAPI-powered backend for delivering fast, interactive emotional analytics.

Click here to view the demo video:
➡️ https://youtu.be/bue433dk7iA

---

## 📄 Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Pre-requisites](#pre-requisites)
- [Installation](#installation)
- [Folder Structure](#folder-structure)
---

## ✨ Features
- Text Sentiment Classification
- Text Generation
- Social Media Post & Comment Sentiment Analysis
- Platform Previews for YouTube, Twitter, Reddit
- Visualizations: Pie Charts, Word Clouds, Radar Charts

---

## 🚀 Tech Stack

<span><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" width="24"/> React</span> &nbsp; 
<span><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vite/vite-original.svg" width="24"/> Vite</span> &nbsp; 
<span><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-plain.svg" width="24"/> Tailwind CSS v4</span> &nbsp; 
<img src="https://api.iconify.design/simple-icons:shadcnui.svg" width="24"/> Shadcn UI  

- **Charts:** Recharts, `@isoterik/react-word-cloud`
- **Routing:** `react-router-dom`
- **State/UI:** Radix UI, Lucide React Icons, React Icons
- **HTTP Requests:** Axios
- **UX Enhancements:** tippy.js (tooltips), sonner (notifications)

---

## 📦 Models & Back Integration
- Text Classification: `cardiffnlp/twitter-roberta-base-sentiment-latest`
- Text Generation: `google/flan-t5-small`
- Emotion Detection: `j-hartmann/emotion-english-distilroberta-base`

---

## ⚙️ Pre-requisites
- Node.js 18+
- npm or yarn
- Git

---

## 💻 Installation
```bash
git clone https://github.com/your-user/sentiment-front.git
cd sentiment-front
npm install
npm run dev
```

---

## 📁 Folder Structure
```
sentiment-front/
├── src/
│   ├── components/
│   │   ├── ui/           # Base UI components
│   │   └── ...           
│   ├── pages/            # Main page components
│   ├── context/          # Context providers
│   ├── lib/              # Utility functions
│   ├── assets/           # Static assets
│   └── App.jsx           # Main app
├── public/               # Public assets
├── index.html            # Entry HTML
├── package.json          # Project dependencies
└── ...
```
> Crafted with care. For questions or contributions, feel free to open an issue or PR!
