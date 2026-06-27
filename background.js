// Create list of rules
const headerRules = [
  // Redirect preview.redd.it to i.redd.it
  {
    id: 1,
    priority: 2,
    action: {
      type: "redirect",
      redirect: {
        transform: {
          host: "i.redd.it"
        }
      }
    },
    condition: {
      urlFilter: "preview.redd.it",
      resourceTypes: ["main_frame"]
    }
  },

  // Remove the Accept header for i.redd.it
  {
    id: 2,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "Accept",
          operation: "remove"
        }
      ]
    },
    condition: {
      urlFilter: "i.redd.it",
      resourceTypes: ["main_frame"]
    }
  },

  // Remove the Accept header for preview.redd.it
  {
    id: 3,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "Accept",
          operation: "remove"
        }
      ]
    },
    condition: {
      urlFilter: "preview.redd.it",
      resourceTypes: ["main_frame"]
    }
  },

  // Remove the Accept header for external-preview.redd.it
  {
    id: 4,
    priority: 1,
    action: {
      type: "modifyHeaders",
      requestHeaders: [
        {
          header: "Accept",
          operation: "remove"
        }
      ]
    },
    condition: {
      urlFilter: "external-preview.redd.it",
      resourceTypes: ["main_frame"]
    }
  }
];

// Enable the rules
chrome.runtime.onInstalled.addListener(() => {
  // First, remove any existing rules with the same IDs
  chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4]
    }, () => {
      // Then add the new rules
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: headerRules
      });
    });
});