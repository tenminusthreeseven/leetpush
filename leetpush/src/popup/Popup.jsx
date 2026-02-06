import { useEffect, useState } from "react";

const API_URL = "https://leetpush-backend.onrender.com";

// Cross-browser extension API
const ext = typeof browser !== "undefined" ? browser : chrome;

export default function Popup() {
  const [status, setStatus] = useState("");
  const [token, setToken] = useState("");
  const [repo, setRepo] = useState("");
  const [isConfigured, setIsConfigured] = useState(false);

  // 🔁 Load saved config
  useEffect(() => {
    if (!ext?.storage?.local) return;

    ext.storage.local.get(["githubToken", "githubRepo"], (res) => {
      if (res.githubToken && res.githubRepo) {
        setToken(res.githubToken);
        setRepo(res.githubRepo);
        setIsConfigured(true);
      }
    });
  }, []);

  // 💾 Save config
  const saveConfig = () => {
    if (!token || !repo) {
      setStatus("❌ Please enter both GitHub token and repo");
      return;
    }

    if (!repo.includes("/")) {
      setStatus("❌ Repo format must be username/repo");
      return;
    }

    ext.storage.local.set(
      {
        githubToken: token,
        githubRepo: repo,
      },
      () => {
        setIsConfigured(true);
        setStatus("✅ Configuration saved");
      }
    );
  };

  // 🔄 Reset config
  const resetConfig = () => {
    ext.storage.local.remove(["githubToken", "githubRepo"], () => {
      setToken("");
      setRepo("");
      setIsConfigured(false);
      setStatus("🔁 Configuration reset");
    });
  };

  // 🚀 Push solution
  const pushSolution = async () => {
    setStatus("🔍 Extracting code from LeetCode...");

    try {
      const tabs = await ext.tabs.query({
        active: true,
        currentWindow: true,
      });

      const tab = tabs[0];
      if (!tab?.id) {
        setStatus("❌ No active tab found");
        return;
      }

      ext.tabs.sendMessage(tab.id, { type: "GET_CODE" }, async (data) => {
        if (chrome.runtime.lastError) {
          setStatus("❌ Reload LeetCode page and try again");
          return;
        }

        if (!data || !data.code) {
          setStatus("❌ No code found in editor");
          return;
        }

        try {
          setStatus("📤 Pushing to GitHub...");

          const res = await fetch(`${API_URL}/push`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...data,
              token,
              repo,
            }),
          });

          if (res.ok) {
            setStatus("✅ Pushed successfully 🚀");
          } else {
            const text = await res.text();
            setStatus("❌ Push failed: " + text);
          }
        } catch (err) {
          console.error(err);
          setStatus("❌ Backend unreachable");
        }
      });
    } catch (err) {
      console.error(err);
      setStatus("❌ Cannot access tab");
    }
  };

  return (
    <div
      style={{
        padding: 16,
        width: 300,
        borderRadius: 14,
        fontFamily: "system-ui, sans-serif",
        background:
          "radial-gradient(circle at 1px 1px, #a5b4fc 1px, transparent 0)",
        backgroundSize: "18px 18px",
        backgroundColor: "#eef2ff",
      }}
    >
      {/* Header */}
      <div
        style={{
          background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
          color: "white",
          padding: 14,
          borderRadius: 12,
          marginBottom: 12,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
        }}
      >
        <h3 style={{ margin: 0 }}>🚀 LeetPush</h3>
        <p style={{ margin: "6px 0 0", fontSize: 13 }}>
          Push LeetCode solutions directly to GitHub
        </p>
      </div>

      {!isConfigured ? (
        <>
          <input
            placeholder="GitHub Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 8,
              padding: 9,
              borderRadius: 8,
              border: "1px solid #c7d2fe",
            }}
          />

          <input
            placeholder="username/repo"
            value={repo}
            onChange={(e) => setRepo(e.target.value)}
            style={{
              width: "100%",
              marginBottom: 10,
              padding: 9,
              borderRadius: 8,
              border: "1px solid #c7d2fe",
            }}
          />

          <button
            onClick={saveConfig}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#4f46e5",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Configuration
          </button>
        </>
      ) : (
        <>
          <button
            onClick={pushSolution}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#22c55e",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Push solution
          </button>

          <button
            onClick={resetConfig}
            style={{
              width: "100%",
              marginTop: 8,
              padding: 10,
              borderRadius: 8,
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Reset Configuration
          </button>
        </>
      )}

      <p style={{ fontSize: 12, marginTop: 12 }}>{status}</p>

      <div
        style={{
          marginTop: 14,
          textAlign: "center",
          fontSize: 11,
          opacity: 0.9,
        }}
      >
        Built with ❤️ by <strong>Adarsh Kumar</strong>
        <br />
        <a
          href="https://github.com/tenminusthreeseven"
          target="_blank"
          rel="noreferrer"
          style={{
            color: "#4338ca",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Follow me on GitHub 🚀
        </a>
      </div>
    </div>
  );
}
