interface GetMessageTypeProps {
  active: boolean;
  introCheckbox: boolean;
  resumeCheckbox: boolean;
  jumpCheckbox: boolean;
}

export const saveToLocalStorage = (newStorageData: GetMessageTypeProps) => {
  // Guardar en el localStorage del popup
  const disneySkipperIsActive = JSON.parse(
    localStorage.getItem('disneySkipperIsActive') ?? '{}'
  );

  localStorage.setItem(
    'disneySkipperIsActive',
    JSON.stringify({
      ...disneySkipperIsActive,
      ...newStorageData
    })
  );

  // Inyectar y guardar en el localStorage de la página activa
  if (chrome.tabs) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      const activeTab = tabs[0];

      chrome.scripting.executeScript({
        target: { tabId: activeTab.id ?? 0 },
        func: data => {
          const disneySkipperIsActive = JSON.parse(
            localStorage.getItem('disneySkipperIsActive') ?? '{}'
          );

          localStorage.setItem(
            'disneySkipperIsActive',
            JSON.stringify({
              ...disneySkipperIsActive,
              ...data
            })
          );
        },
        args: [newStorageData]
      });
    });
  }
};
