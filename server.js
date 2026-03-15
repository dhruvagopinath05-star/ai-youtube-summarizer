import OpenAI from "openai"

export default async function handler(req, res) {

    const { url } = req.body

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_KEY
    })

    const prompt =
        "Summarize this youtube video: " + url


    const completion =
        await openai.chat.completions.create({

            model: "gpt-4o-mini",

            messages: [
                { role: "user", content: prompt }
            ]

        })

    res.json({
        summary: completion.choices[0].message.content
    })

}