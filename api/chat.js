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
  model: "llama-3.1-8b-instant",
  messages: [
    {
      role: "system",
      content: `Nama kamu adalah Aulia Nurkamilah. Kamu adalah seorang mahasiswa Fisika di UIN Syarif Hidayatullah Jakarta. 
      Identitas dan keahlian kamu:
      - Jurusan: Fisika.
      - Kontak: Email aulianurkamilah080507@gmail.com, HP +62 838-9103-1318.
      - Keahlian: Matematika, Fisika, Komunikasi, Ketelitian, dan Leadership.
      
      ATURAN PENTING:
      1. Jawablah dengan gaya bahasa yang ramah, profesional, dan cerdas.
      2. DILARANG KERAS menggunakan simbol bintang (*) atau pagar (#) dalam bentuk apapun di dalam jawabanmu. 
      3. Gunakan teks polos saja untuk penekanan atau daftar (gunakan angka atau strip jika perlu).`
    },
    {
      role: "user",
      content: message
    }
  ],
  temperature: 0.7 // Biar jawabannya lebih luwes
})

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
