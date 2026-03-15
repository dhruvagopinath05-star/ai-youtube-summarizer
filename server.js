import OpenAI from "openai";

export default async function handler(req, res) {

    if (req.method !== "POST") {
        return res.status(405).json({ message: "Only POST requests allowed" });
    }

    try {

        const { url } = req.body;

        if (!url) {
            return res.json({
                summary: "Please paste a valid YouTube video URL."
            });
        }


        /* API KEYS FROM ENV */

        const RAPID_API_KEY = process.env.RAPID_API_KEY;
        const OPENAI_KEY = process.env.OPENAI_KEY;
        const FIREBASE_API_KEY = process.env.FIREBASE_API_KEY;


        /* EXTRACT VIDEO ID */

        const videoId = url.split("v=")[1]?.split("&")[0];

        if (!videoId) {
            return res.json({
                summary: "Invalid YouTube link. Please paste a correct video URL."
            });
        }


        /* FETCH TRANSCRIPT */

        const transcriptResponse = await fetch(
            `https://youtubetranscript.p.rapidapi.com/?video_id=${videoId}`,
            {
                method: "GET",
                headers: {
                    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
                    "X-RapidAPI-Host": "youtubetranscript.p.rapidapi.com"
                }
            }
        );

        const transcriptData = await transcriptResponse.json();

        if (!Array.isArray(transcriptData)) {
            return res.json({
                summary: "Transcript not available for this video."
            });
        }

        const transcript = transcriptData
            .map(t => t.text)
            .join(" ");


        /* OPENAI SUMMARY */

        const openai = new OpenAI({
            apiKey: OPENAI_KEY
        });

        const completion = await openai.chat.completions.create({

            model: "gpt-4o-mini",

            messages: [
                {
                    role: "system",
                    content: "Summarize YouTube videos clearly and explain the important points."
                },
                {
                    role: "user",
                    content: transcript
                }
            ]

        });


        const summary = completion.choices[0].message.content;


        /* RETURN SUMMARY */

        return res.json({
            summary
        });

    } catch (error) {

        console.error(error);

        return res.json({
            summary: "Something went wrong while summarizing the video. Please try another video."
        });

    }

}