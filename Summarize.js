export default async function handler(req, res) {

    try {

        if (req.method !== "POST") {
            return res.status(405).json({ summary: "Method not allowed" });
        }

        const { url } = req.body;

        if (!url) {
            return res.json({ summary: "Please paste a YouTube link." });
        }

        /* Extract video ID */

        let videoId = "";

        if (url.includes("v=")) {
            videoId = url.split("v=")[1].split("&")[0];
        }
        else if (url.includes("youtu.be/")) {
            videoId = url.split("youtu.be/")[1];
        }

        if (!videoId) {
            return res.json({ summary: "Invalid YouTube URL." });
        }

        /* Get transcript */

        const transcriptResponse = await fetch(
            "https://youtubetranscript.p.rapidapi.com/?video_id=" + videoId,
            {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                    "X-RapidAPI-Host": "youtubetranscript.p.rapidapi.com"
                }
            }
        );

        const transcriptData = await transcriptResponse.json();

        let transcript = "";

        for (let i = 0; i < transcriptData.length; i++) {
            transcript += transcriptData[i].text + " ";
        }

        /* Send transcript to GROQ */

        const aiResponse = await fetch(
            "https://api.groq.com/openai/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + process.env.GROQ_API_KEY
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192",
                    messages: [
                        {
                            role: "system",
                            content: "Summarize this YouTube video clearly and explain what the video is about."
                        },
                        {
                            role: "user",
                            content: transcript
                        }
                    ]
                })
            }
        );

        const data = await aiResponse.json();

        const summary = data.choices[0].message.content;

        return res.json({ summary });

    }
    catch (error) {

        console.error(error);

        return res.json({
            summary: "Error while summarizing video."
        });

    }

}