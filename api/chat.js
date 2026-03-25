module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    // Pakai v1 (versi stabil) dan model gemini-1.5-flash
    const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user", // Tambahkan role agar Google tidak bingung
            parts: [
              {
                text: message
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      // Biar kamu bisa lihat error asli dari Google di chat
      return res.status(200).json({ 
        reply: `Google Error (${response.status}): ${data.error?.message || "Cek API Key/Quota"}` 
      });
    }

    const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    return res.status(200).json({ 
      reply: replyText || "Google kasih respon kosong." 
    });

  } catch (err) {
    return res.status(200).json({ reply: "Server Error: " + err.message });
  }
};
