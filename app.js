const hero = document.getElementById("hero")
const login = document.getElementById("login")
const summarizer = document.getElementById("summarizer")

const startBtn = document.getElementById("startBtn")
const demoBtn = document.getElementById("demoBtn")

const summarizeBtn = document.getElementById("summarizeBtn")
const saveBtn = document.getElementById("saveBtn")


/* STEP 1 */

startBtn.onclick = () => {

    hero.classList.remove("active")
    login.classList.add("active")

}


/* DEMO BUTTON */

demoBtn.onclick = () => {

    hero.classList.remove("active")
    summarizer.classList.add("active")

}


/* GOOGLE LOGIN */

document
    .getElementById("googleLogin")
    .onclick = async () => {

        await googleLogin()

        login.classList.remove("active")
        summarizer.classList.add("active")

    }


/* SUMMARIZE VIDEO */

summarizeBtn.onclick = async () => {

    const url =
        document.getElementById("youtubeUrl").value

    const res =
        await fetch("/api/summarize", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({ url })

        })

    const data = await res.json()

    document
        .getElementById("result")
        .value = data.summary

}


/* SAVE SUMMARY */

saveBtn.onclick = () => {

    const text =
        document.getElementById("result").value

    localStorage.setItem("summary", text)

    alert("Summary saved")

}