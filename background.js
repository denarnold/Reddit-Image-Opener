chrome.runtime.onMessage.addListener(function(message) {
  
  if (message[0] == "Open this image link") {

    chrome.storage.local.get(['openPreference'], function(result) {  //retrieve preference from local storage
      //open a new chrome tab
      chrome.tabs.create({
        url:message[1],
        active: !result.openPreference
      })
    })
  }
})