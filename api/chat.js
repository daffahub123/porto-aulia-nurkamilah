export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message kosong" });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ reply: "API KEY belum kebaca" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );

    const data = await response.json();

    console.log("GEMINI:", data);

    if (!data.candidates) {
      return res.status(500).json({
        reply: "AI error",
        debug: data
      });
    }

    const reply =
      data.candidates[0]?.content?.parts?.[0]?.text ||
      "Tidak ada respon";

    return res.status(200).json({ reply });

  } catch (err) {
    return res.status(500).json({
      reply: "Server error",
      error: err.toString()
    });
  }
}
