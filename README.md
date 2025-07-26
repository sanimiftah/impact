# 🌱 IMPACT – Planting Seeds of Change

**IMPACT** is a digital platform designed to unify and amplify Cognizant Outreach efforts across the Asia-Pacific region. Developed during **Vibe Coding Week**, this prototype reflects Cognizant’s commitment to **care**, **innovation**, and **community engagement**.

By centralizing volunteer opportunities, facilitating collaboration, and tracking meaningful contributions, IMPACT transforms scattered efforts into a cohesive ecosystem of change.

---

## 🌟 Why It Matters

In a world of fragmented initiatives, IMPACT offers a unified space where every act of care becomes part of a larger story.  
It’s not just a tool — it’s a movement toward **intentional, values-driven impact**.

---

## 🧩 Core Modules

- **Seedboard** – Submit and explore early-stage ideas with emotional tone, tags, and location  
- **Saved Seeds** – Revisit ideas that resonate deeply and support them later  
- **Impact Dashboard** – Visualize total ideas, emotional tone breakdown, common tags, and reflection logs  
- **ImpactLog** – Reflect on contributions and track outcomes by cause and timeline  
- **OpenCall** – Respond to urgent volunteer needs and track engagement  
- **Impact Card** – Capture individual contributions in a symbolic format  

---

## 🌿 Features We’ve Built

- 🌱 LocalStorage-powered idea submission and filtering  
- 🎨 Emotional tone mapping with styled labels  
- 🏷️ Tag chips for clarity and resonance  
- 🌼 Save for Later functionality  
- 📊 Dashboard insights: total ideas, saved seeds, tone breakdown, tag analytics  
- 📝 Reflection logs with cause-based grouping and timeline stats  
- 🔗 Modular navigation between pages  
- 📣 OpenCall sync between Lead and Volunteer views  
- ✅ Respond button with local response tracking  
- 🔔 Notification badge for new OpenCalls  

---

## 🔗 OpenCall Sync Overview

### 👩‍💼 Lead View

Leads can create OpenCalls with:
- Title, description, and deadline  
- Stored in `localStorage` under `openCalls`  

### 🙋 Volunteer View

Volunteers can:
- View synced OpenCalls  
- Respond with one click  
- See a badge when new calls appear  

### 📄 HTML Snippet

```html
<h2 class="text-2xl font-semibold text-red-600 mb-4 flex items-center">
  🔗 Open Calls
  <span id="openCallBadge" class="ml-2 bg-red-600 text-white text-xs px-2 py-1 rounded-full hidden">0</span>
</h2>
<div id="openCallList" class="bg-red-50 p-4 rounded shadow-inner space-y-4"></div>

---

## 🧠 Data Flow

| Action            | Source        | Target         | Storage Key           |
|-------------------|---------------|----------------|------------------------|
| Create Call       | Lead View     | Volunteer View | `openCalls`           |
| Respond to Call   | Volunteer     | Local Log      | `responses`           |
| Badge Update      | Volunteer     | UI Element     | `lastOpenCallCount`   |

---

## 🛠️ Tech Stack

- **HTML + Tailwind CSS**  
- **Vanilla JavaScript** (localStorage, DOM rendering)  
- **GitHub Copilot + VS Code**  
- **Lovable** (for prototyping)

---

## 🤝 Contribution

This project began during Cognizant’s Vibe Coding Week.  
Future collaborators are welcome to help refine modules, improve accessibility, and expand regional impact.  
Whether you're a designer, developer, or storyteller — your voice matters.

> “Every idea is a seed. Let it grow.”

---

## 📌 Status

**Prototype phase – MVP modules completed**  
**Next steps:**
- Modularization and reusable components  
- Accessibility and multilingual support  
- Ethical AI integration  
- Response analytics and reflection syncing


