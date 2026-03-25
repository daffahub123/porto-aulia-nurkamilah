export default async function handler(req, res) {
  // 1. Cek Method
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan method POST" });
  }

  try {
    // 2. Pastikan req.body diparse (Vercel kadang butuh ini)
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    const { message } = body;

    if (!message) {
      return res.status(400).json({ error: "Pesan tidak boleh kosong" });
    }

    // 3. Gunakan model terbaru (gemini-1.5-flash)
    const apiKey = process.env.GEMINI_API_KEY;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: message }] }]
      }),
    });

    const data = await response.json();

    // 4. Tangkap error spesifik dari Google (misal API Key salah/limit)
    if (!response.ok) {
      return res.status(response.status).json({
        reply: "Google API Error",
        error: data.error?.message || data
      });
    }

    // 5. Kirim respon sukses
    return res.status(200).json({
      reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "Gemini tidak memberikan jawaban.",
      debug: data // Untuk lihat struktur data aslinya
    });

  } catch (err) {
    return res.status(500).json({
      reply: "Server sedang bermasalah",
      error: err.toString()
    });
  }
}
