// popup.js
document.addEventListener("DOMContentLoaded", function () {
  const toggleSwitch = document.getElementById("toggleSwitch");

  // Load the saved state and set the switch
  chrome.storage.sync.get({ isEnabled: true }, function (data) {
    toggleSwitch.checked = data.isEnabled;
  });

  // When the switch is clicked, save the new state
  toggleSwitch.addEventListener("change", function () {
    const isEnabled = this.checked;
    chrome.storage.sync.set({ isEnabled: isEnabled }, function () {
      // Notify the active tab to update its state
      chrome.tabs.query(
        { active: true, currentWindow: true, url: "*://*.youtube.com/*" },
        function (tabs) {
          if (tabs.length > 0) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "toggleState" });
          }
        }
      );
    });
  });
});
