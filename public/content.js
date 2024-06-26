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

const startSearch = (textElements = []) => {
  if (intervalId === null) {
    intervalId = setInterval(() => {
      const skipIntroResumeBtn = findElementFromTexts(textElements);
      if (skipIntroResumeBtn) skipIntroResumeBtn.click();
    }, 500);
    console.log('Search started');
  }
};

const stopSearch = () => {
  if (intervalId !== null) {
    clearInterval(intervalId);
    intervalId = null;
    console.log('Search stopped');
  }
};

// Escuchar mensajes desde el popup
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.type) {
    case 'start':
      startSearch(['SALTAR INTRO', 'SALTAR RESUMEN', 'SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search started' });
      break;
    case 'startRJ':
      startSearch(['SALTAR RESUMEN', 'SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search started' });
      break;
    case 'startIJ':
      startSearch(['SALTAR INTRO', 'SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search started' });
      break;
    case 'startIR':
      startSearch(['SALTAR INTRO', 'SALTAR RESUMEN']);
      sendResponse({ status: 'Search started' });
      break;
    case 'startI':
      startSearch(['SALTAR INTRO']);
      sendResponse({ status: 'Search started' });
      break;
    case 'startR':
      startSearch(['SALTAR RESUMEN']);
      sendResponse({ status: 'Search started' });
      break;
    case 'startJ':
      startSearch(['SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search started' });
      break;
    case 'stop':
      stopSearch();
      sendResponse({ status: 'Search stopped' });
      break;
    default:
      break;
  }
});
