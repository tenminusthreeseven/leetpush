function extractCodeFromMonaco() {
  const lines = document.querySelectorAll(
    ".monaco-editor .view-lines .view-line"
  );

  if (!lines || lines.length === 0) return null;

  const code = Array.from(lines)
    .map(line => line.innerText)
    .join("\n");

  return code.trim() ? code : null;
}

function waitForCode(timeout = 8000) {
  return new Promise((resolve) => {
    const start = Date.now();

    const check = () => {
      const code = extractCodeFromMonaco();
      if (code) return resolve(code);

      if (Date.now() - start > timeout) return resolve(null);

      setTimeout(check, 250);
    };

    check();
  });
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type !== "GET_CODE") return;

  (async () => {
    const code = await waitForCode();

    if (!code) {
      sendResponse(null);
      return;
    }

    const title =
      document.querySelector('[data-cy="question-title"]')?.innerText ||
      document.title;

    const language =
      document.querySelector("button[data-cy='lang-select']")?.innerText ||
      "javascript";

    sendResponse({ title, code, language });
  })();

  return true;
});
