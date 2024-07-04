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

// Enable the rules
chrome.runtime.onInstalled.addListener(() => {
  // First, remove any existing rules with the same IDs
  chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [1, 2, 3]
  }, () => {
    // Then add the new rules
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: headerRules
    });
  });
});