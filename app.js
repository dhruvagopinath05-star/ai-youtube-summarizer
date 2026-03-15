const startBtn = document.getElementById("startBtn");
const loginBtn = document.getElementById("googleLogin");
const summarizeBtn = document.getElementById("summarizeBtn");
const saveBtn = document.getElementById("saveBtn");

const hero = document.getElementById("hero");
const login = document.getElementById("login");
const summarizer = document.getElementById("summarizer");

startBtn.onclick = () => {
    hero.style.display = "none";
    login.style.display = "block";
};

loginBtn.onclick = async () => {
    await googleLogin();
    login.style.display = "none";
    summarizer.style.display = "block";
};

summarizeBtn.onclick = async () => {

    const url = document.getElementById("youtubeUrl").value;

    document.getElementById("result").value = "Summarizing video...";

    const res = await fetch("/api/summarize", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
    });

    const data = await res.json();

    document.getElementById("result").value = data.summary;

};

saveBtn.onclick = () => {

    const text = document.getElementById("result").value;

    localStorage.setItem("savedSummary", text);

    alert("Summary saved!");

};