import express from "express";
import axios from "axios";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.post("/push", async (req, res) => {
  const {
    title = "leetcode",
    code,
    language = "javascript",
    token,
    repo,
  } = req.body;

  // 🔐 Basic validation
  if (!code) {
    return res.status(400).send("No code provided");
  }

  if (!token || !repo) {
    return res.status(400).send("Missing GitHub token or repo");
  }

  // 🧼 Sanitize inputs
  const safeTitle = title.replace(/[^\w\s]/g, "").replace(/\s+/g, "_");
  const safeLang = language.replace(/\s+/g, "_").toLowerCase();

  // 📄 File extension mapping
  const fileExt =
    safeLang.includes("cpp") ? "cpp" :
    safeLang.includes("python") ? "py" :
    safeLang.includes("java") ? "java" :
    "js";

  const path = `${safeLang}/${safeTitle}.${fileExt}`;
  const content = Buffer.from(code).toString("base64");

  const url = `https://api.github.com/repos/${repo}/contents/${path}`;

  try {
    let sha = null;

    // 🔁 Check if file already exists (for overwrite support)
    try {
     const existing = await axios.get(url, {
  headers: {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github.v3+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "LeetPush"
  },
});

      sha = existing.data.sha;
    } catch {
      // File does not exist — safe to create
    }

    // 🚀 Push file to GitHub
    const response = await axios.put(
  url,
  {
    message: `Add ${title} solution`,
    content,
    sha,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "LeetPush"
    },
  }
);


    console.log("✅ GitHub push success:", response.status);
    res.send("Pushed successfully");
  } catch (err) {
  console.error("❌ GitHub API ERROR");
  console.error("STATUS:", err.response?.status);
  console.error("HEADERS:", err.response?.headers);
  console.error("DATA:", err.response?.data);
  console.error("MESSAGE:", err.message);

  res.status(500).send("GitHub push failed");
}

});

app.listen(3000, () => {
  console.log("🚀 LeetPush backend running on port 3000");
});
