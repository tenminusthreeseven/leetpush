import { useEffect, useState } from "react";

const API_URL = "http://localhost:3000";

export default function Popup() {
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);

  // Load saved config
  useEffect(() => {
  if (!chrome?.storage?.local) return;

  chrome.storage.local.get(["githubToken", "githubRepo"], (res) => {
    if (res.githubToken && res.githubRepo) {
      setToken(res.githubToken);
      setRepo(res.githubRepo);
      setIsConfigured(true);
    }
  });
}, []);


  const saveConfig = () => {
    if (!token || !repo) {
      setStatus("Please fill all fields");
      return;
    }

    chrome.storage.local.set(
      {
        githubToken: token,
        githubRepo: repo,
      },
      () => {
        setIsConfigured(true);
        setStatus("Configuration saved ✅");
      }
    );
  };

  const pushSolution = async () => {
    setStatus("Extracting code...");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.sendMessage(tab.id, { type: "GET_CODE" }, async (data) => {
      if (!data || !data.code) {
        setStatus("No code found. Please write code first.");
        return;
      }

      try {
        setStatus("Pushing to GitHub...");

        const res = await fetch(`${API_URL}/push`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            token,
            repo,
          }),
        });

        setStatus(res.ok ? "Pushed successfully 🚀" : "Push failed ❌");
      } catch (err) {
        console.error(err);
        setStatus("Backend not running ❌");
      }
    });
  };

  return (
    <div style={{ padding: 16, width: 260 }}>
      <h2>🚀 LeetPush</h2>
      <p style={{ fontSize: 12 }}>Leetcode → GitHub</p>

      {!isConfigured ? (
        <>
          <input
            placeholder="GitHub Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />

          <input
            placeholder="username/repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            style={{ width: "100%", marginBottom: 8 }}
          />

          <button onClick={saveConfig} style={{ width: "100%" }}>
            Save Configuration
          </button>
        </>
      ) : (
        <button onClick={pushSolution} style={{ width: "100%" }}>
          Push solution
        </button>
      )}

      <p style={{ fontSize: 12 }}>{status}</p>
    </div>
  );
}
