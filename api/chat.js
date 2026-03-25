export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message kosong" });
        }

        // 🔑 CEK API KEY
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ error: "API KEY tidak ditemukan" });
        }

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: message }]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();

        console.log("DEBUG:", JSON.stringify(data));

        // 🔥 ANTI ERROR (INI PENTING)
        if (!data.candidates || !data.candidates.length) {
            return res.status(200).json({
                reply: "AI tidak memberikan respon"
            });
        }

        const reply = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ reply });

    } catch (error) {
        console.error("ERROR:", error);
        return res.status(500).json({
            error: "Server error",
            detail: error.message
        });
    }
}
