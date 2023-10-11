//---------------------------------------------------------------
//                  Notify Users of New Feature                --
//---------------------------------------------------------------

// Listen for the onInstalled event
chrome.runtime.onInstalled.addListener((details) => {

  // Get the current version of the extension
  const currentVersion = chrome.runtime.getManifest().version;
  
  // Check if the reason for the installation is an update and the current version is 1.6
  if (details.reason === 'update' && currentVersion === '1.6') {
    
    // Open a new tab with the desired URL
    chrome.tabs.create({ url: 'update/update.html'});
  }
});


//---------------------------------------------------------------
//                    Respond to Button Click                  --
//---------------------------------------------------------------

chrome.runtime.onMessage.addListener(function(message) {
  
  if (message[0] == "Open this image link") {

    chrome.storage.local.get(['openTabs'], function(result) {  // Retrieve preference from local storage
      // Open a new chrome tab
      chrome.tabs.create({
        url:message[1],
        active: !result.openTabs
      })
    })
  }
})




//---------------------------------------------------------------
//                Establish Header Rules on Install            --
//---------------------------------------------------------------

// Set up headerRules if the headerRules variable is not yet saved in chrome.storage
chrome.storage.local.get('headerRules', function(result) {
  if(result.headerRules == undefined) {
      
    // Create list of rules
    const headerRules = [
      {
        "id" : 1,
        "priority": 1,
        "action" : {
          "type" : "modifyHeaders",
          "requestHeaders": [{
            "header": "Accept",
            "operation": "remove"
          }]
        },
        "condition" : {
          "urlFilter" : "i.redd.it",
          "resourceTypes": ["main_frame", "sub_frame"]
        }
      },
      {
        "id" : 2,
        "priority": 1,
        "action" : {
          "type" : "modifyHeaders",
          "requestHeaders": [{
            "header": "Accept",
            "operation": "remove"
          }]
        },
        "condition" : {
          "urlFilter" : "preview.redd.it",
          "resourceTypes": ["main_frame", "sub_frame"]
        }
      },
      {
        "id" : 3,
        "priority": 1,
        "action" : {
          "type" : "modifyHeaders",
          "requestHeaders": [{
            "header": "Accept",
            "operation": "remove"
          }]
        },
        "condition" : {
          "urlFilter" : "external-preview.redd.it",
          "resourceTypes": ["main_frame", "sub_frame"]
        }
      }
    ]

    // Disable any existing rules (to prevent errors during debugging)
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3]
    });

    // Enable the rules
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: headerRules
    });

    // Set the checkbox
    chrome.storage.local.set({'previewPage': [true]});

    // Save list of rules to chrome.storage to reference when checkbox is toggled. Saved as key:value pair.
    chrome.storage.local.set({headerRules: headerRules});
  }
});