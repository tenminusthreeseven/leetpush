import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/push", async (req, res) => {
  const { title, code, language } = req.body;

  if (!code) return res.status(400).send("No code");

  const safeTitle = title.replace(/[^\w\s]/g, "").replace(/\s+/g, "_");
  const fileExt =
    language.toLowerCase().includes("cpp") ? "cpp" :
    language.toLowerCase().includes("python") ? "py" :
    "js";

  const path = `${language}/${safeTitle}.${fileExt}`;

  const content = Buffer.from(code).toString("base64");

  try {
    await axios.put(
      `https://api.github.com/repos/${process.env.GITHUB_REPO}/contents/${path}`,
      {
        message: `Add ${title} solution`,
        content
      },
      {
        headers: {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      }
    );

    res.send("Pushed");
  } catch (err) {
    console.error(err.response?.data);
    res.status(500).send("GitHub push failed");
  }
});

app.listen(3000, () => {
  console.log("LeetPush backend running on port 3000");
});
