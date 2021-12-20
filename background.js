//refer to content.js for context menu action
chrome.runtime.onMessage.addListener(function(message) {
  
  if (message[0] == "Open this image link") {
    chrome.tabs.create({
      url: message[1],
      active: false
    })
  }
})