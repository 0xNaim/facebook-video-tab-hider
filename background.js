// Listen for tab updates to monitor URL changes
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if (changeInfo.status === "complete" && tab.url) {
		checkAndRedirect(tab);
	}
});

const checkAndRedirect = (tab) => {
	const isPaused = JSON.parse(localStorage.getItem("extensionPaused")) || false;

	// If paused and on watch/reel pages, do nothing
	if (
		isPaused &&
		(tab.url.includes("https://www.facebook.com/watch") ||
			tab.url.includes("https://www.facebook.com/reel"))
	) {
		return;
	}

	// If not paused and on watch/reel pages, redirect to home
	if (
		!isPaused &&
		(tab.url.includes("facebook.com/watch") ||
			tab.url.includes("facebook.com/reel"))
	) {
		chrome.tabs.update(tab.id, { url: "https://www.facebook.com" });
	}
};

// Listen for messages from popup to toggle pause/resume
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "togglePause") {
		const isPaused =
			JSON.parse(localStorage.getItem("extensionPaused")) || false;
		const newPausedState = !isPaused;
		localStorage.setItem("extensionPaused", JSON.stringify(newPausedState));
		sendResponse({ paused: newPausedState });
	}
});

// Log installation success
chrome.runtime.onInstalled.addListener(() => {
	console.log("Facebook Video Tab Hider Extension Installed");
});
