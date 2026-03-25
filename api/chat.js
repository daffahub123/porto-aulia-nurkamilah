// Gunakan module.exports supaya lebih kompatibel dengan Vercel
module.exports = async (req, res) => {
  // Pastikan cuma nerima POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan method POST, jangan GET." });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Pakai model 1.5-flash (lebih kencang & stabil)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }]
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ 
        error: "Google API Error", 
        detail: data 
      });
    }

    return res.status(200).json({
      reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response"
    });

  } catch (err) {
    return res.status(500).json({ error: err.toString() });
  }
};
