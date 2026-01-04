# LeetPush – Push LeetCode Solutions to GitHub

LeetPush – Push LeetCode Solutions to GitHub

LeetPush is a browser extension that allows users to push their LeetCode solutions directly to a GitHub repository with one click.
It eliminates manual copy-paste and helps developers maintain a clean, organized record of their coding practice.
How to use doc- https://docs.google.com/document/d/1bTzQTQwOpa2NHxcyEU_z9--T550twgz1J3XTiZmIWL8/edit?tab=t.0#heading=h.u7xb7mf59gtp

✨ Features

📤 Push LeetCode solutions directly to GitHub

🧠 Automatically extracts:

Problem title

Source code

Programming language

📁 Creates folders using LeetCode problem names

🔐 Secure GitHub authentication using Personal Access Tokens

💾 Stores configuration safely using browser storage

🌐 Works on LeetCode problem pages

🦊 Compatible with Chrome, Brave, and Firefox

🛠 Tech Stack

Frontend

React

Vite

JavaScript (ES Modules)

Backend

Node.js

Express

Axios

Browser APIs

chrome.tabs

chrome.storage

content_scripts

📂 Project Structure
leetpush/
├─ src/                    # Extension source code
│  ├─ popup/               # React popup UI
│  ├─ content/             # Content script for LeetCode pages
│  └─ main.jsx             # Entry point
├─ public/
├─ manifest.firefox.json   # Firefox-specific manifest
├─ vite.config.js
├─ package.json
├─ package-lock.json
└─ README.md

🧪 Build Environment Requirements

Operating System: Linux / macOS / Windows

Node.js: v18 or later

npm: v9 or later

📦 Installation (Source Code)
1️⃣ Clone the repository
git clone https://github.com/tenminusthreeseven/leetpush.git
cd leetpush

2️⃣ Install dependencies
npm install

🏗 Build Instructions
Generate production build
npm run build


This command:

Bundles React code using Vite

Outputs production files to the dist/ directory

🦊 Firefox Build Notes

After building, replace the generated manifest with the Firefox-specific manifest:

rm dist/manifest.json
cp manifest.firefox.json dist/manifest.json


The contents of the dist/ directory exactly match the submitted Firefox add-on package.

🔌 Backend Service

LeetPush communicates with a backend service that handles GitHub API requests.

Backend URL:
https://leetpush-backend.onrender.com

The backend is responsible for:

Authenticating GitHub requests

Creating folders and files in the user’s repository

Pushing solution code using the GitHub REST API

🔐 Data Collection & Privacy

LeetPush:

Uses a GitHub Personal Access Token provided by the user

Reads website content from LeetCode problem pages

Does not collect analytics, advertising, or tracking data

Does not store data outside the user’s browser and GitHub account

All data usage is disclosed using Firefox’s built-in data collection consent system.

📜 Third-Party Libraries

All third-party dependencies are installed via npm and are unmodified open-source libraries.

👨‍💻 Author

Adarsh Kumar

GitHub: https://github.com/tenminusthreeseven

📄 License

MIT License
