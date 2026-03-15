// ===============================
// BUTTON REFERENCES
// ===============================

const startBtn = document.getElementById("startBtn");
const demoBtn = document.getElementById("demoBtn");
const summarizeBtn = document.getElementById("summarizeBtn");
const googleBtn = document.getElementById("googleLoginBtn");

const urlInput = document.getElementById("youtubeUrl");
const resultBox = document.getElementById("result");



// ===============================
// START SUMMARIZING BUTTON
// Scroll to summarizer section
// ===============================

startBtn.addEventListener("click", () => {
    document.getElementById("summarizer").scrollIntoView({
        behavior: "smooth"
    });
});



// ===============================
// VIEW DEMO BUTTON
// Loads a sample video
// ===============================

demoBtn.addEventListener("click", () => {

    urlInput.value =
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

    alert("Demo video loaded. Click Summarize.");
});



// ===============================
// SUMMARIZE BUTTON
// Calls backend API
// ===============================

summarizeBtn.addEventListener("click", async () => {

    const url = urlInput.value.trim();

    if (!url) {
        alert("Please paste a YouTube URL");
        return;
    }

    resultBox.value = "Summarizing video...";

    try {

        const response = await fetch("/api/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ url })
        });

        const data = await response.json();

        if (data.summary) {
            resultBox.value = data.summary;
        } else {
            resultBox.value = "Could not summarize video.";
        }

    } catch (error) {

        console.error(error);
        resultBox.value = "Error connecting to summarizer.";

    }

});



// ===============================
// GOOGLE LOGIN
// ===============================

googleBtn.addEventListener("click", () => {

    const provider = new firebase.auth.GoogleAuthProvider();

    firebase.auth().signInWithPopup(provider)
        .then((result) => {

            const user = result.user;

            alert("Welcome " + user.displayName);

        })
        .catch((error) => {

            console.error(error);
            alert("Google login failed.");

        });

});