/* eslint-disable no-undef */
let intervalId = null;

const findElementFromTexts = texts => {
  let xpathExpression = `//*[contains(text(), '${texts}')]`;

  if (Array.isArray(texts)) {
    xpathExpression = '//*[contains(text(), ';
    texts.map((text, index) => {
      index === texts.length - 1
        ? (xpathExpression += `'${text}')]`)
        : (xpathExpression += `'${text}') or contains(text(), `);
    });
  }

  const result = document.evaluate(
    xpathExpression,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  );

  return result.singleNodeValue;
};

const startSearch = () => {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      const skipIntroResumeBtn = findElementFromTexts([
        'SALTAR RESUMEN',
        'SALTAR INTRO',
        'SIGUIENTE EPISODIO'
      ]);
      if (skipIntroResumeBtn) skipIntroResumeBtn.click();
    }, 500);
    chrome.storage.local.set({ skipperIsActive: true });
    console.log('Search started');
  }
};

const stopSearch = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    chrome.storage.local.set({ skipperIsActive: false });
    console.log('Search stopped');
  }
};

// Escuchar mensajes desde el popup
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'start') {
    startSearch();
    sendResponse({ status: 'Search started' });
  } else if (message.type === 'stop') {
    stopSearch();
    sendResponse({ status: 'Search stopped' });
  }
});
