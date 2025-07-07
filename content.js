// content.js

// Function to hide Shorts elements
function hideShortsElements() {
  // Selectors for various Shorts-related elements
  const selectors = [
    "ytd-rich-section-renderer:has(ytd-rich-shelf-renderer[is-shorts])", // Shorts section container on home page
    "ytd-reel-shelf-renderer", // Shorts shelf in subscriptions/search
    'ytd-mini-guide-entry-renderer[aria-label="Shorts"]', // Shorts link in the side navigation
    'ytd-guide-entry-renderer[title="Shorts"]', // Shorts link in the expanded side navigation
    'ytd-guide-entry-renderer:has([title="Shorts"])', // Shorts link in the expanded side navigation
    'ytd-video-renderer a[href*="/shorts/"]', // Links to shorts videos
    'ytd-grid-video-renderer a[href*="/shorts/"]', // Grid view video links
    'ytd-rich-item-renderer:has(a[href*="/shorts/"])', // Shorts videos on the homepage feed
    'ytd-video-renderer:has(a[href*="/shorts/"])', // Shorts videos in search results/up next
  ];

  document.querySelectorAll(selectors.join(", ")).forEach((el) => {
    // We traverse up to find the main container to hide,
    // ensuring the whole video/section item is hidden.
    let container =
      el.closest("ytd-rich-item-renderer") ||
      el.closest("ytd-video-renderer") ||
      el.closest("ytd-grid-video-renderer") ||
      el.closest("ytd-reel-shelf-renderer") ||
      el.closest("ytd-rich-section-renderer") ||
      el.closest("ytd-mini-guide-entry-renderer") ||
      el.closest("ytd-guide-entry-renderer");

    if (container) {
      container.style.display = "none";
    } else {
      // For elements that don't have a larger container to hide
      el.style.display = "none";
    }
  });
}

// Function to check the enabled state and run the hiding logic
function runBlocker() {
  chrome.storage.sync.get({ isEnabled: true }, function (data) {
    if (data.isEnabled) {
      // Use a MutationObserver to handle dynamically loaded content
      const observer = new MutationObserver(hideShortsElements);
      observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
      });
      // Initial run on page load
      hideShortsElements();
    }
  });
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "toggleState") {
    // Reload the page to apply/remove the hiding logic
    window.location.reload();
  }
});

// Run the blocker when the script is first injected
runBlocker();
