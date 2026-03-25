module.exports = async (req, res) => {
  // Biar kita tahu ini kode baru
  console.log("Memproses request lewat Groq...");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan POST!" });
  }

  try {
    const { message } = req.body;
    // PASTIIN NAMA DI VERCEL SAMA DENGAN INI: GROQ_API_KEY
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(200).json({ reply: "API KEY GROQ TIDAK DITEMUKAN DI VERCEL!" });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Perhatikan teksnya: "GROQ ERROR", bukan "GOOGLE ERROR"
      return res.status(200).json({ 
        reply: "VERSI GROQ ERROR: " + (data.error?.message || "Cek Key") 
      });
    }

    return res.status(200).json({ 
      reply: data.choices[0].message.content 
    });

  } catch (err) {
    return res.status(200).json({ reply: "SERVER ERROR JALUR GROQ: " + err.message });
  }
};
