document
    .getElementById("googleLogin")
    .onclick = () => googleLogin();


document
    .getElementById("summarizeBtn")
    .onclick = async () => {

        const url =
            document.getElementById("youtubeUrl").value

        const res = await fetch("/api/summarize", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url })
        })

        const data = await res.json()

        document
            .getElementById("result")
            .value = data.summary

    }


document
    .getElementById("saveBtn")
    .onclick = () => {

        const text =
            document.getElementById("result").value

        localStorage.setItem("summary", text)

        alert("Saved")

    }