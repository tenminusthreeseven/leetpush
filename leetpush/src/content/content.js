function extractCodeFromDOM() {
  // Monaco renders hidden textarea with code
  const textareas = document.querySelectorAll("textarea");

  for (const ta of textareas) {
    if (ta.value && ta.value.length > 20) {
      return ta.value;
    }
  }

  return null;
}

function waitForCode(timeout = 6000) {
  return new Promise((resolve) => {
    const start = Date.now();

    const check = () => {
      const code = extractCodeFromDOM();
      if (code) return resolve(code);

      if (Date.now() - start > timeout) return resolve(null);

      setTimeout(check, 300);
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
