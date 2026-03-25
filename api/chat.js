async function fetchWithRetry(query) {
    const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: query }),
    });

    const data = await res.json();

    return data.reply || "Tidak ada respon dari AI";
}
