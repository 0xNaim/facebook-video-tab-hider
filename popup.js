document.addEventListener("DOMContentLoaded", () => {
	const toggleButton = document.getElementById("toggleButton");

	// Initial state setup
	chrome.storage.local.get(["isPaused"], (result) => {
		const isPaused = result.isPaused || false;
		toggleButton.textContent = isPaused ? "Resume" : "Pause";
	});

	// Click event listener
	toggleButton.addEventListener("click", () => {
		chrome.storage.local.get(["isPaused"], (result) => {
			const isPaused = result.isPaused || false;
			const newIsPaused = !isPaused;

			// Update storage and then update button text and send message
			chrome.storage.local.set({ isPaused: newIsPaused }, () => {
				toggleButton.textContent = newIsPaused ? "Resume" : "Pause";

				// Send message to background script about the updated state
				chrome.runtime.sendMessage({
					action: "toggle",
					isPaused: newIsPaused
				});
			});
		});
	});
});
