import { useEffect, useState } from 'react';
import { enLanguage, languages } from '../languages';

const supportedLanguages = [
  'cs',
  'da',
  'de',
  'en-GB',
  'en',
  'es-ES',
  'es-419',
  'fr-FR',
  'fr-CA',
  'it',
  'hu',
  'nl',
  'no',
  'pl',
  'pt-PT',
  'pt-BR',
  'ro',
  'sk',
  'fi',
  'sv',
  'tr',
  'el',
  'ko',
  'zh-Hans',
  'zh-Hant',
  'zh-HK',
  'ja'
];

export const useLanguage = () => {
  const [language, setLanguage] = useState(enLanguage);

  useEffect(() => {
    // Enviar mensaje al content script para obtener el idioma
    if (chrome.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const tabId = tabs[0].id;

        if (tabs[0].url?.includes('www.disneyplus.com')) {
          chrome.tabs.sendMessage(
            tabId ?? 0,
            { type: 'getLanguage' },
            response => {
              if (response && response.language) {
                setLanguage(languages[response.language]);
              }
            }
          );
        } else {
          let lang = navigator.language;
          if (!supportedLanguages.includes(lang)) {
            lang = 'en';
            for (const l of navigator.languages) {
              if (supportedLanguages.includes(l)) {
                lang = l;
                break;
              }
            }
          }
          setLanguage(languages[lang]);
        }
      });
    }
  }, []);

  return { language, setLanguage };
};
