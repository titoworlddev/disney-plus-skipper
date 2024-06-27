export const sendMessageToContentScript = (type: string) => {
  if (!chrome.tabs) {
    console.error('Chrome tabs API is not available');
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (chrome.runtime.lastError) {
      console.error('Error querying tabs:', chrome.runtime.lastError);
      return;
    }

    if (tabs.length === 0) {
      console.error('No active tabs found');
      return;
    }

    const tabId = tabs[0].id;
    if (tabId === undefined) {
      console.error('Tab ID is undefined');
      return;
    }

    chrome.tabs.sendMessage(tabId, { type }, response => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
      } else {
        console.log(response.status);
      }
    });
  });
};
