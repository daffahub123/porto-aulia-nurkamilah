export default async function handler(req, res) {
    try {
        const { message } = req.body;

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
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

        console.log("FULL DATA:", JSON.stringify(data));

        // 🔥 HANDLE ERROR DARI GEMINI
        if (data.error) {
            return res.status(200).json({
                reply: "ERROR GEMINI: " + data.error.message
            });
        }

        // 🔥 HANDLE KOSONG
        if (!data.candidates || data.candidates.length === 0) {
            return res.status(200).json({
                reply: "Tidak ada respon dari AI (candidates kosong)"
            });
        }

        const reply = data.candidates[0].content.parts[0].text;

        res.status(200).json({ reply });

    } catch (err) {
        res.status(500).json({
            reply: "Server error: " + err.message
        });
    }
}
