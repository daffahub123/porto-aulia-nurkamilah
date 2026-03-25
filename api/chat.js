export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const API_KEY = process.env.GEMINI_API_KEY;

  try {
    // 🔥 FIX: parse body manual
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: body.contents,
          systemInstruction: body.systemInstruction
        }),
      }
    );

    const data = await response.json();
    res.status(200).json(data);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
