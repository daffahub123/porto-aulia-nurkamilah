module.exports = async (req, res) => {
  // Log untuk debugging di Vercel Dashboard
  console.log("Memproses request lewat Groq dengan identitas Aulia...");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Gunakan method POST!" });
  }

  try {
    const { message } = req.body;
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
            2. DILARANG KERAS menggunakan simbol bintang (*) atau pagar (#) dalam bentuk apapun. Jangan gunakan markdown untuk menebalkan teks atau membuat judul.
            3. Jika ingin membuat daftar, gunakan angka (1, 2, 3) atau strip (-).
            4. Gunakan teks polos saja (plain text).`
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.6 // Sedikit diturunkan agar AI lebih patuh pada instruksi format
      })
    }); // <--- Tadi kurung tutup ini yang hilang

    const data = await response.json();

    if (!response.ok) {
      return res.status(200).json({ 
        reply: "VERSI GROQ ERROR: " + (data.error?.message || "Cek Key") 
      });
    }

    // Ambil jawaban dan bersihkan sisa-sisa simbol jika AI bandel
    let botReply = data.choices[0].message.content;
    botReply = botReply.replace(/[*#]/g, ''); 

    return res.status(200).json({ 
      reply: botReply 
    });

  } catch (err) {
    return res.status(200).json({ reply: "SERVER ERROR JALUR GROQ: " + err.message });
  }
};
