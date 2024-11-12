// Listen for messages to toggle the extension's state
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
	if (request.action === "toggle") {
		// Toggle the pause state
		chrome.storage.local.get(["isPaused"], (result) => {
			const isPaused = result.isPaused !== undefined ? result.isPaused : false;
			const newPausedState = !isPaused;

			// Update the pause state in storage
			chrome.storage.local.set({ isPaused: newPausedState }, () => {
				// Notify content script of the new state
				chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
					if (tabs[0]) {
						chrome.tabs.sendMessage(tabs[0].id, {
							action: "toggle",
							isPaused: newPausedState
						});
					}
				});
			});
		});
	}
});

// Check and redirect function to monitor and redirect Facebook watch/reel pages
const checkAndRedirect = (tabId, url) => {
	chrome.storage.local.get(["isPaused"], (result) => {
		const isPaused = result.isPaused || false;

		// Redirect only if not paused and on a Facebook watch/reel page
		if (
			!isPaused &&
			(url.includes("facebook.com/watch") || url.includes("facebook.com/reel"))
		) {
			chrome.tabs.update(tabId, { url: "https://www.facebook.com" });
		}
	});
};

// Monitor active tab updates to apply redirection
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.url) {
		// Check and potentially redirect when URL changes
		checkAndRedirect(tabId, changeInfo.url);
	}
});

// Log installation success
chrome.runtime.onInstalled.addListener(() => {
	console.log("Facebook Video Tab Hider Extension Installed");
});
