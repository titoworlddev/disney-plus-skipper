export const sendMessageToContentScript = (type: string) => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs.length === 0) {
      console.error('No active tabs found');
      return;
    }

    chrome.tabs.sendMessage(tabs[0].id!, { type }, response => {
      if (chrome.runtime.lastError) {
        console.error('Error sending message:', chrome.runtime.lastError);
      } else {
        console.log(response.status);
      }
    });
  });
};
