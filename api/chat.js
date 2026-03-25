module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(200).json({ reply: "Sistem Error: Kamu pakai GET, harusnya POST!" });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ reply: "Error: API Key belum dipasang di Vercel Env!" });
    }

    const response = await fetch(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
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
      return res.status(200).json({ 
        reply: "Google API Ngambek: " + (data.error?.message || "Cek kuota/key") 
      });
    }

    const botReply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return res.status(200).json({ reply: botReply || "Google kasih respon kosong." });

  } catch (err) {
    return res.status(200).json({ reply: "Server Error: " + err.message });
  }
};
