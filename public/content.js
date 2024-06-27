/* eslint-disable no-undef */
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

// Leer el localStorage y actuar en consecuencia
const disneySkipperIsActive = localStorage.getItem('disneySkipperIsActive');
if (disneySkipperIsActive === null) {
  console.log('Era null');
  localStorage.setItem('disneySkipperIsActive', 'true');
  startSearch(['SALTAR INTRO', 'SALTAR RESUMEN', 'SIGUIENTE EPISODIO']);
} else if (disneySkipperIsActive === 'true') {
  console.log('Era true');
  startSearch(['SALTAR INTRO', 'SALTAR RESUMEN', 'SIGUIENTE EPISODIO']);
}

// Escuchar mensajes desde el popup
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.type) {
    case 'start':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(['SALTAR INTRO', 'SALTAR RESUMEN', 'SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search started' });
      break;
    case 'startRJ':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(['SALTAR RESUMEN', 'SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search RJ started' });
      break;
    case 'startIJ':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(['SALTAR INTRO', 'SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search IJ started' });
      break;
    case 'startIR':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(['SALTAR INTRO', 'SALTAR RESUMEN']);
      sendResponse({ status: 'Search IR started' });
      break;
    case 'startI':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(['SALTAR INTRO']);
      sendResponse({ status: 'Search I started' });
      break;
    case 'startR':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(['SALTAR RESUMEN']);
      sendResponse({ status: 'Search R started' });
      break;
    case 'startJ':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(['SIGUIENTE EPISODIO']);
      sendResponse({ status: 'Search J started' });
      break;
    case 'stop':
      stopSearch();
      sendResponse({ status: 'Search stopped' });
      break;
    default:
      break;
  }
});
