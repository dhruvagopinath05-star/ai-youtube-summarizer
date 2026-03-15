/* APP.JS – COMPLETE FILE */

/* Get elements */

const urlInput = document.getElementById("youtubeUrl");
const summarizeBtn = document.getElementById("summarizeBtn");
const resultBox = document.getElementById("result");
const saveBtn = document.getElementById("saveBtn");

/* Summarize button */

summarizeBtn.addEventListener("click", async function () {

    const url = urlInput.value.trim();

    if (!url) {
        alert("Please paste a YouTube URL.");
        return;
    }

    resultBox.value = "Summarizing video...";

    /* Send request to backend */

    try {

        const response = await fetch("/api/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                url: url
            })
        });

        const data = await response.json();

        if (data.summary) {
            resultBox.value = data.summary;
        } else {
            resultBox.value = "Could not summarize the video.";
        }

    } catch (error) {

        console.error(error);

        resultBox.value = "Error connecting to summarizer.";

    }

});

/* Save summary button */

saveBtn.addEventListener("click", function () {

    const summary = resultBox.value;

    if (!summary || summary === "Summarizing video...") {
        alert("No summary to save.");
        return;
    }

    /* Save locally */

    localStorage.setItem("youtube_summary", summary);

    alert("Summary saved successfully.");

});

/* Load saved summary when page opens */

window.addEventListener("load", function () {

    const saved = localStorage.getItem("youtube_summary");

    if (saved) {
        resultBox.value = saved;
    }

});