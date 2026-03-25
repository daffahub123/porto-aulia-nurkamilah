export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        const { message } = req.body;

        const systemPrompt = "Kamu adalah asisten AI untuk portofolio Aulia Nurkamilah. Aulia adalah mahasiswa Fisika UIN Syarif Hidayatullah Jakarta. Dia ahli di bidang analisis data fisika, eksperimen lab, dan simulasi komputasi. Jawablah dengan sopan, cerdas, dan profesional. Jika ditanya kontak, emailnya adalah aulianurkamilah080507@gmail.com dan nomor WhatsAppnya +6283891031318. hindari simbol #*";

        const response = await fetch(
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=" + process.env.GEMINI_API_KEY,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: systemPrompt + "\n\nUser: " + message }]
                        }
                    ]
                }),
            }
        );

        const data = await response.json();

        const text =
            data.candidates?.[0]?.content?.parts?.[0]?.text ||
            "AI tidak merespon";

        res.status(200).json({ reply: text });

    } catch (error) {
        res.status(500).json({ error: "Server error", detail: error.message });
    }
}
