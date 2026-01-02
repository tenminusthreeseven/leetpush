import { useState } from "react";

export default function Popup() {
  const [status, setStatus] = useState("");

  const pushSolution = async () => {
    setStatus("Extracting code... thank you for using LeetPush");

    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    chrome.tabs.sendMessage(
      tab.id,
      { type: "GET_CODE" },
      async (data) => {
        if (!data || !data.code) {
          setStatus("No code found. Please write code first.");
          return;
        }

        setStatus("Pushing to GitHub...");

        const res = await fetch("http://localhost:3000/push", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        setStatus(res.ok ? "Pushed successfully 🚀" : "Push failed ❌");
      }
    );
  };

  return (
    <div style={{ padding: 16, width: 260 }}>
      <h2>🚀 LeetPush</h2>
      <p style={{ fontSize: 12 }}>Leetcode → GitHub</p>

      <button onClick={pushSolution} style={{ width: "100%" }}>
        Push solution
      </button>

      <p style={{ fontSize: 12 }}>{status}</p>
    </div>
  );
}
