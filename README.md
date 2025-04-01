# 🧠 Workspace Orchestrator

A dynamic productivity tool that lets users create, manage, and launch smart workspaces consisting of apps, URLs, and custom layouts. It features AI-powered profile generation using LLMs (via Nebius AI Studio) and automates app opening via Screenpipe.

---

## 📦 Features

- 🧠 **AI Profile Generator**: Just type natural language like:
  > "Create a workspace for design: Figma, YouTube, and Spotify"
  And it will auto-create a profile.

- 🗂️ **Profile Management**
  - Save profiles with name and optional description
  - Schedule launch time (once or daily)
  - Delete or apply profiles instantly

- 📦 **App + URL Launcher**
  - Opens installed applications via Screenpipe
  - Opens websites in the default browser if not an app

- 🪟 **Layout Editor**
  - Drag and position app windows with x/y/width/height

- 🔔 **Notification (Optional)**
  - Desktop notification when workspace is applied

---

## 🛠️ Tech Stack

- **Frontend**: Next.js App Router, React, TailwindCSS
- **Automation**: [@screenpipe/browser](https://www.npmjs.com/package/@screenpipe/browser)
- **AI**: [Nebius AI Studio](https://studio.nebius.com) (OpenAI-compatible API)
- **Package Manager**: Bun

---

## 🚀 Getting Started

### 1. Clone the Repo
```bash
git clone https://github.com/your-username/workspace-orchestrator.git
cd workspace-orchestrator
```

### 2. Install Dependencies
```bash
bun install
```

### 3. Configure `.env.local`
```env
NEBIUS_API_KEY=your-real-api-key-here
```
> You can create an API key at https://studio.nebius.com

---

## 💡 Using the App

### ✅ Save a Profile
- Select apps from the list (fetched from macOS Spotlight)
- Optionally enter one or more URLs
- Provide a name + (optional) schedule time + repeat daily checkbox

### 🚀 Apply a Profile
- Instantly launches saved apps and opens URLs
- Optionally shows a desktop notification

### 🧠 Use AI to Create a Profile
- In the AI section, type something like:
  > "Create workspace with YouTube and Facebook"
- The LLM will:
  - Parse the sentence
  - Match installed apps (e.g., YouTube app)
  - Convert unmatched entries into URLs (e.g., https://facebook.com)

---

## 📁 Folder Structure

```bash
app/
  api/
    ai/
      generate-profile/route.ts    # AI API route using Nebius
    getInstalledApps/route.ts     # macOS Spotlight app fetch
  components/
    AppSelector.tsx
    LayoutEditor.tsx
    ProfileManager.tsx
    ProfilePreviewModal.tsx
  page.tsx                         # Main UI

.env.local                         # Add NEBIUS_API_KEY here
```

---

## 🔧 Integrations

### 🖥️ Screenpipe
- Used for opening apps, launching URLs, arranging windows
- Must have [Screenpipe CLI](https://screenpipe.ai) or app running

### 🤖 Nebius AI Studio
- Uses LLaMA 3.1 70B-Instruct model for prompt-to-profile parsing
- Output is clean JSON parsed into apps + URLs

---

## 📈 Future Ideas
- ✅ Add toast for feedback on saving/applying
- 🧠 AI suggestion from daily screen activity
- 🌐 Web app import/export profiles
- 🔒 Authentication and cloud sync

---

## 🧠 Credits
- Built by Pratik 👨‍💻
- Powered by Nebius, Screenpipe, Next.js, and Bun

---

## 📃 License
MIT License

