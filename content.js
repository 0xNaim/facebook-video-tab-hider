// Toggle visibility of video tab and second list item based on pause state
const toggleElements = (isPaused) => {
	const videoTab = document.querySelector('a[aria-label="Video"]');
	const listItems = document.querySelectorAll("li");

	// Toggle visibility based on pause state
	if (videoTab) videoTab.style.display = isPaused ? "grid" : "none";
	if (listItems.length > 1) listItems[1].style.display = isPaused ? "" : "none";
};

// Redirect if on watch/reel pages and not paused
const checkAndRedirect = (isPaused) => {
	if (
		isPaused ||
		(!window.location.href.includes("facebook.com/watch") &&
			!window.location.href.includes("facebook.com/reel"))
	)
		return;

	window.location.href = "https://www.facebook.com";
};

// Toggle pause/resume and update state, elements, and redirect
const togglePauseResume = () => {
	chrome.storage.local.get(["isPaused"], (result) => {
		const isPaused = result.isPaused || false;
		const newPausedState = !isPaused;

		// Update storage with the new paused state
		chrome.storage.local.set({ isPaused: newPausedState }, () => {
			// Apply updated state to elements and redirection
			toggleElements(newPausedState);
			checkAndRedirect(newPausedState);
		});
	});
};

// Listen for messages to toggle pause/resume
chrome.runtime.onMessage.addListener((request, sender, response) => {
	if (request.action === "toggle") togglePauseResume();
});

// Initial checks for redirection and element visibility
const init = () => {
	// Retrieve the pause state on initialization
	chrome.storage.local.get(["isPaused"], (result) => {
		const isPaused = result.isPaused || false;

		checkAndRedirect(isPaused);
		toggleElements(isPaused);

		// Observe DOM changes to continuously apply checks with the latest isPaused state
		const observer = new MutationObserver(() => {
			chrome.storage.local.get(["isPaused"], (result) => {
				const currentPausedState = result.isPaused || false;
				checkAndRedirect(currentPausedState);
				toggleElements(currentPausedState);
			});
		});
		observer.observe(document.body, { childList: true, subtree: true });
	});
};

// Run initialization
init();
