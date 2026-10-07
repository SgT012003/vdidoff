<div align="center">
  <img src="./public/assets/img/favicon.png" alt="Logo" width="80" height="80">
  <h1 align="center">Victor Didoff - Portfolio</h1>
  <p align="center">
    A premium, highly dynamic, and data-driven developer portfolio built with Vanilla JS, TailwindCSS, and the GitHub API.
    <br />
    <a href="https://github.com/SgT012003/vdidoff"><strong>Explore the docs »</strong></a>
  </p>
</div>

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#features">Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li><a href="#getting-started">Getting Started</a></li>
    <li><a href="#customization--data">Customization & Data</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About The Project

This is a modern, modular, and performant personal portfolio designed to showcase projects, academic history, certifications, and professional experience. Instead of hardcoding HTML pages, this architecture separates data from presentation: all content is fetched from local JSON files or external APIs, and rendered dynamically via JavaScript templates.

## Features

- ⚡ **Data-Driven Architecture:** All data (Skills, Experience, Certifications, Academic history) is managed in individual JSON files (`/public/data/`).
- 🐙 **GitHub Integration:** Dynamically fetches your repositories using the GitHub API. Renders repository READMEs directly inside the site natively.
- 🎨 **Premium UI/UX:** Dark-mode native, glassmorphism effects, floating animations, and rich gradient styling using TailwindCSS.
- 📈 **Academic Dashboard:** Automatically calculates your cumulative grade averages and generates a custom CSS performance bar chart based on your semesters' grades.
- 📜 **Smart Certifications:** For specific issuers (like FIAP), the platform embeds a native PDF validation viewer directly on the page and provides quick copy-to-clipboard validation key tools.
- 📱 **Mobile-First & Responsive:** Fully responsive layouts for phones, tablets, and desktops.

## Tech Stack

- **HTML5** (Semantic structuring)
- **Vanilla JavaScript (ES6+)** (Dynamic rendering, module loading, GitHub API fetching)
- **TailwindCSS v3** (Utility-first styling, custom plugins like Typography)
- **Marked.js & DOMPurify** (Secure Markdown to HTML parsing for READMEs)

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

* Node.js (v14+ recommended for the Tailwind compiler)
* npm

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/SgT012003/vdidoff.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Run the development build watcher (compiles TailwindCSS as you code)
   ```sh
   npm run dev
   ```
4. Start a local server to view the site (e.g., using `serve`)
   ```sh
   npx serve public
   ```

## Customization & Data

All dynamic content is controlled via JSON files located in `public/data/`:

- `academic.json`: Add your courses, semesters, and grades. The engine automatically calculates progress and charts.
- `certs.json`: Manage your certificates. Include keys and issuers to unlock special viewers (e.g., FIAP PDF iframe).
- `projects.json`: Customize how GitHub repositories appear (aliases) and add external projects that are hosted elsewhere.
- `blacklist.json`: Exclude specific repositories from being displayed on the Projects page.
- `skills.json` / `experience.json`: Define your technical stack and career timeline.

### Editing Styles

The project uses a custom Tailwind configuration (`tailwind.config.js`) heavily reliant on a specific color palette (primary, secondary, tertiary). To modify the base style, edit `./src/css/input.css` and re-run the build command (`npm run build`).

## License

Distributed under the MIT License. See `LICENSE` for more information.