chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "GET_CODE") {
    const script = document.createElement("script");
    script.src = chrome.runtime.getURL("src/content/inject.js");
    document.documentElement.appendChild(script);

    window.addEventListener("message", (event) => {
      if (event.data.type === "LEETPUSH_DATA") {
        sendResponse(event.data.payload);
      }
    });

    return true;
  }
});
