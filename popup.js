const toggleButton = document.getElementById("toggleButton");

let isPaused = JSON.parse(localStorage.getItem("extensionPaused")) || false;

toggleButton.textContent = isPaused ? "Resume" : "Pause";

toggleButton.addEventListener("click", () => {
	isPaused = !isPaused;

	localStorage.setItem("extensionPaused", JSON.stringify(isPaused));

	toggleButton.textContent = isPaused ? "Resume" : "Pause";

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { action: "togglePauseResume" });
	});
});
