module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ reply: "Error: GROQ_API_KEY belum dipasang di Vercel!" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192", // Model gratisan yang sangat pintar & cepat
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ 
        reply: "Groq Error: " + (data.error?.message || "Cek kuota/key") 
      });
    }

    const botReply = data.choices?.[0]?.message?.content;
    return res.status(200).json({ reply: botReply || "AI diam saja." });

  } catch (err) {
    return res.status(200).json({ reply: "Server Error: " + err.message });
  }
};
