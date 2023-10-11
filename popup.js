// Function to save the state of a checkbox to chrome.storage
function save_options(id) {
  let obj = {};  // Create an empty object
  obj[id] = document.getElementById(id).checked;  // Set a property on the object with the name of the checkbox id, and value of its checked state
  chrome.storage.local.set(obj);  // Save this object to chrome.storage
}

// Function to restore the state of checkboxes from chrome.storage
function restore_options(ids) {
  let defaults = {};  // Create an empty object for default values
  ids.forEach(id => {
    defaults[id] = false;  // Set a default value of false for each checkbox id
  });
  // Get the stored values of the checkboxes from chrome.storage, or use the default values if not found
  chrome.storage.local.get(defaults, function(result) {
    ids.forEach(id => {
      // Set the checked state of each checkbox to the value retrieved from chrome.storage
      document.getElementById(id).checked = result[id];
    });
  });
}




// When the document has finished loading, restore the state of the checkboxes
document.addEventListener('DOMContentLoaded', function() {
  restore_options(['openTabs', 'previewPage']);
});

// When the openTabs checkbox is clicked, save its state to chrome.storage
document.getElementById('openTabs').addEventListener('click', function() {
  save_options('openTabs');
});

// When the previewPage checkbox is clicked...
document.getElementById('previewPage').addEventListener('click', function() {

  // Save checkbox state to chrome.storage
  save_options('previewPage');

  // Enable/disable header rules
  if (document.getElementById('previewPage').checked) {  //checkbox is checked; enable the rules

    // Retrieve rules from chrome.storage
    chrome.storage.local.get('headerRules', function(result) {
      const headerRules = result.headerRules;

      // Enable the rules
      chrome.declarativeNetRequest.updateDynamicRules({
        addRules: headerRules
      });
    });

  } else {  // Checkbox is unchecked; disable the rules
    
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3]
    });
  }
});