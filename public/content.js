/* eslint-disable no-undef */
// public/content.js
let intervalId = null;

const findElementFromTexts = texts => {
  let xpathExpression = `//*[contains(text(), '${texts}')]`;

  if (Array.isArray(texts)) {
    xpathExpression = '//*[contains(text(), ';
    texts.forEach((text, index) => {
      xpathExpression += `'${text}')${
        index === texts.length - 1 ? ']' : ' or contains(text(), '
      }`;
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
    chrome.storage.local.set({ skipperIsActive: true }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting search state:', chrome.runtime.lastError);
      } else {
        console.log('Search state saved as active');
      }
    });
    console.log('Search started');
  }
};

const stopSearch = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    chrome.storage.local.set({ skipperIsActive: false }, () => {
      if (chrome.runtime.lastError) {
        console.error('Error setting search state:', chrome.runtime.lastError);
      } else {
        console.log('Search state saved as inactive');
      }
    });
    console.log('Search stopped');
  }
};

// Restablecer el estado al cargar
chrome.storage.local.get('skipperIsActive', result => {
  if (chrome.runtime.lastError) {
    console.error('Error getting search state:', chrome.runtime.lastError);
  } else {
    if (result.skipperIsActive) {
      startSearch();
    }
  }
});

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
