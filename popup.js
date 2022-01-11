// Saves options to chrome.storage
function save_options() {
  chrome.storage.local.set({
    openPreference: document.getElementById('openPreference').checked
  })
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  chrome.storage.local.get({
    //use default value = false
    openPreference: false
  }, function(result) {
    document.getElementById('openPreference').checked = result.openPreference
  })
}

document.addEventListener('DOMContentLoaded', restore_options)
document.getElementById('openPreference').addEventListener('click', save_options)