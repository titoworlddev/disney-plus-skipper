/* eslint-disable no-undef */
let intervalId = null;
const disneySkipperIsActive = () =>
  JSON.parse(localStorage.getItem('disneySkipperIsActive'));

/**
 * Guardar en el localStorage
 * @param {{active: boolean, introCheckbox: boolean, resumeCheckbox: boolean, jumpCheckbox: boolean}} newStorageData
 */
const saveToLocalStorage = (newStorageData = {}) => {
  localStorage.setItem(
    'disneySkipperIsActive',
    JSON.stringify({
      ...(disneySkipperIsActive() ?? {}),
      ...newStorageData
    })
  );
};

// Buscar elementos por texto
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

// Detectar el idioma del usuario
const getAppLanguage = () => {
  const lang = document.querySelector('html').lang;
  return lang.includes('-') ? lang.split('-')[0] : lang;
};

const textElementsMap = {
  cs: ['PŘESKOČIT ÚVOD', 'PŘESKOČIT REKAPITULACI', 'DALŠÍ DÍL'],
  da: ['SPRING INTRO OVER', 'SPRING OVER RESUMÉ', 'NÆSTE EPISODE'],
  de: ['INTRO ÜBERSPRINGEN', 'ZUSAMMENFASSUNG ÜBERSPRINGEN', 'NÄCHSTE FOLGE'],
  en: ['SKIP INTRO', 'SKIP RECAP', 'NEXT EPISODE'],
  es: ['SALTAR INTRO', 'SALTAR RESUMEN', 'SIGUIENTE EPISODIO'],
  fr: ["IGNORER L'INTRO", 'IGNORER LE RÉCAP', 'ÉPISODE SUIVANT'],
  it: ['SALTA INTRO', 'SALTA RIEPILOGO', 'PROSSIMO EPISODIO'],
  hu: ['FŐCÍM KIHAGYÁSA', 'ELŐZMÉNYEK KIHAGYÁSA', 'KÖVETKEZŐ RÉSZ'],
  nl: ['INTRO OVERSLAAN', 'SAMENVATTING OVERSLAAN', 'VOLGENDE AFLEVERING'],
  no: ['HOPP OVER INTRO', 'HOPP OVER SAMMENDRAG', 'NESTE EPISODE'],
  pl: ['POMIŃ CZOŁÓWKĘ', 'POMIŃ PODSUMOWANIE', 'NASTĘPNY ODCINEK'],
  pt: ['SALTAR INTRODUÇÃO', 'SALTAR RESUMO', 'PRÓXIMO EPISÓDIO'],

  ro: ['SARI PESTE INTRODUCERE', 'SARI PESTE RECAPITULARE', 'URMĂTORUL EPISOD'],
  sk: ['PRESKOČIŤ ÚVOD', 'PRESKOČIŤ REKAPITULÁCIU', 'ĎALŠIA EPIZÓDA'],
  fi: ['OHITA INTRO', 'OHITA YHTEENVETO', 'SEURAAVA JAKSO'],
  sv: ['HOPPA ÖVER INTRO', 'HOPPA ÖVER SAMMANFATTNING', 'NÄSTA AVSNITT'],
  tr: ['GİRİŞİ ATLA', 'ÖZETİ ATLA', 'SONRAKİ BÖLÜM'],
  el: ['ΠΑΡΑΛΕΙΨΗ ΕΙΣΑΓΩΓΗΣ', 'ΠΑΡΑΛΕΙΨΗ ΑΝΑΚΕΦΑΛΑΙΩΣΗΣ', 'ΕΠΟΜΕΝΟ ΕΠΕΙΣΟΔΙΟ'],
  ko: ['인트로 건너뛰기', '요약 건너뛰기', '다음 에피소드'],
  zh: ['跳过介绍', '跳过回顾', '下一集'],
  ja: ['イントロをスキップ', 'リキャップをスキップ', '次のエピソード']
};

// Obtener el texto de los botones segun el typo de mensaje y el idioma actual
const getSearchButtonsTextsByMessageType = (message = 'start') => {
  const textElements = textElementsMap[getAppLanguage()];
  if (message === 'start') {
    return textElements;
  } else if (message === 'startRJ') {
    return [textElements[1], textElements[2]];
  } else if (message === 'startIJ') {
    return [textElements[0], textElements.at(-1)];
  } else if (message === 'startIR') {
    return [textElements[0], textElements[1]];
  } else if (message === 'startI') {
    return textElements[0];
  } else if (message === 'startR') {
    return textElements[1];
  } else if (message === 'startJ') {
    return textElements.at(-1);
  }

  return textElements;
};

// Obtener el tipo de mensaje
const getMessageType = ({ introCheckbox, resumeCheckbox, jumpCheckbox }) => {
  if (!introCheckbox && !resumeCheckbox && !jumpCheckbox) {
    return 'stopIRJ';
  } else if (!introCheckbox && resumeCheckbox && jumpCheckbox) {
    return 'startRJ';
  } else if (introCheckbox && !resumeCheckbox && jumpCheckbox) {
    return 'startIJ';
  } else if (introCheckbox && resumeCheckbox && !jumpCheckbox) {
    return 'startIR';
  } else if (introCheckbox && !resumeCheckbox && !jumpCheckbox) {
    return 'startI';
  } else if (!introCheckbox && resumeCheckbox && !jumpCheckbox) {
    return 'startR';
  } else if (!introCheckbox && !resumeCheckbox && jumpCheckbox) {
    return 'startJ';
  } else {
    return 'start';
  }
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

// Leer el localStorage y actuar en consecuencia para el inicio de la extension
if (disneySkipperIsActive() === null) {
  saveToLocalStorage({
    active: true,
    introCheckbox: true,
    resumeCheckbox: true,
    jumpCheckbox: true
  });
  startSearch();
} else if (disneySkipperIsActive().active === true) {
  const messageType = getMessageType(disneySkipperIsActive());
  if (messageType.includes('stop')) {
    stopSearch();
  } else {
    startSearch(getSearchButtonsTextsByMessageType(messageType));
  }
} else {
  stopSearch();
}

// Escuchar mensajes desde el popup
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  switch (message.type) {
    case 'start':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(getSearchButtonsTextsByMessageType(message.type));
      sendResponse({ status: 'Search started' });
      break;
    case 'startRJ':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(getSearchButtonsTextsByMessageType(message.type));
      sendResponse({ status: 'Search RJ started' });
      break;
    case 'startIJ':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(getSearchButtonsTextsByMessageType(message.type));
      sendResponse({ status: 'Search IJ started' });
      break;
    case 'startIR':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(getSearchButtonsTextsByMessageType(message.type));
      sendResponse({ status: 'Search IR started' });
      break;
    case 'startI':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(getSearchButtonsTextsByMessageType(message.type));
      sendResponse({ status: 'Search I started' });
      break;
    case 'startR':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(getSearchButtonsTextsByMessageType(message.type));
      sendResponse({ status: 'Search R started' });
      break;
    case 'startJ':
      if (intervalId !== null) clearInterval(intervalId);
      intervalId = null;
      startSearch(getSearchButtonsTextsByMessageType(message.type));
      sendResponse({ status: 'Search J started' });
      break;
    case 'stopIRJ':
      stopSearch();
      sendResponse({ status: 'Search stopped' });
      break;
    case 'stop':
      stopSearch();
      sendResponse({ status: 'Search stopped' });
      break;
    default:
      break;
  }
});

// Escuchar mensajes del popup para cambiar el idioma
chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
  if (message.type === 'getLanguage') {
    const language = getAppLanguage();
    sendResponse({ language });
  }
});
