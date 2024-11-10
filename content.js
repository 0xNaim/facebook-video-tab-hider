// Toggle visibility of video tab and second list item
const toggleElements = () => {
	const isPaused = JSON.parse(localStorage.getItem("extensionPaused")) || false;
	const videoTab = document.querySelector('a[aria-label="Video"]');
	const listItems = document.querySelectorAll("li");

	if (videoTab) videoTab.style.display = isPaused ? "grid" : "none";
	if (listItems.length > 1) listItems[1].style.display = isPaused ? "" : "none";
};

// Redirect if on watch/reel pages and not paused
const checkAndRedirect = () => {
	const isPaused = JSON.parse(localStorage.getItem("extensionPaused")) || false;
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
	const isPaused = JSON.parse(localStorage.getItem("extensionPaused")) || false;
	localStorage.setItem("extensionPaused", JSON.stringify(!isPaused));
	toggleElements();
	checkAndRedirect();
};

// Listen for messages to toggle pause/resume
chrome.runtime.onMessage.addListener((message) => {
	if (message.action === "togglePauseResume") togglePauseResume();
});

// Initial checks for redirection and element visibility
const init = () => {
	checkAndRedirect();
	toggleElements();
	const observer = new MutationObserver(() => {
		checkAndRedirect();
		toggleElements();
	});
	observer.observe(document.body, { childList: true, subtree: true });
};

init();
