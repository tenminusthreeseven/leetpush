(function () {
  let code = "";

  if (window.monaco) {
    const models = window.monaco.editor.getModels();
    if (models.length > 0) {
      code = models[0].getValue();
    }
  }

  const title =
    document.querySelector('[data-cy="question-title"]')?.innerText ||
    "unknown";

  const lang =
    document.querySelector(".ant-select-selection-item")?.innerText ||
    "unknown";

  window.postMessage({
    type: "LEETPUSH_DATA",
    payload: { title, code, language: lang }
  });
})();
