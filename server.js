export default async function handler(req, res) {

    try {

        if (req.method !== "POST") {
            return res.status(405).json({ summary: "Method not allowed" });
        }

        const body = req.body || {};
        const url = body.url;

        if (!url) {
            return res.json({ summary: "Please paste a YouTube link." });
        }

        /* EXTRACT VIDEO ID */

        let videoId = "";

        if (url.indexOf("v=") !== -1) {
            videoId = url.split("v=")[1].split("&")[0];
        } else if (url.indexOf("youtu.be/") !== -1) {
            videoId = url.split("youtu.be/")[1];
        }

        if (!videoId) {
            return res.json({ summary: "Invalid YouTube URL." });
        }

        /* GET TRANSCRIPT FROM RAPIDAPI */

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

        /* SEND TRANSCRIPT TO GROQ */

        const groqResponse = await fetch(
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
                            content: "Summarize this YouTube video clearly and simply."
                        },
                        {
                            role: "user",
                            content: transcript
                        }
                    ]
                })
            }
        );

        const groqData = await groqResponse.json();

        const summary =
            groqData.choices &&
                groqData.choices[0] &&
                groqData.choices[0].message &&
                groqData.choices[0].message.content
                ? groqData.choices[0].message.content
                : "Could not generate summary.";

        /* RETURN RESULT */

        return res.json({ summary: summary });

    } catch (error) {

        console.error(error);

        return res.json({
            summary: "Something went wrong while summarizing."
        });

    }

}