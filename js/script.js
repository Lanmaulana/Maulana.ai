const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

// Ganti dengan API Key Gemini kamu
const GEMINI_API_KEY = "AIza.....";

chatForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const message = userInput.value.trim();
  if (message === '') return;

  appendMessage('user', message);
  userInput.value = '';

  // Tampilkan animasi mengetik
  const typingDiv = document.createElement('div');
  typingDiv.className = 'typing-indicator';
  typingDiv.innerHTML = '<span></span><span></span><span></span>';
  chatBox.appendChild(typingDiv);
  chatBox.scrollTop = chatBox.scrollHeight;

  const aiReply = await getAIResponse(message);

  // Hapus animasi dan tampilkan balasan AI dengan efek ngetik
  typingDiv.remove();
  await typeEffect(aiReply);
});

function appendMessage(sender, message) {
  const div = document.createElement('div');
  div.className = sender === 'user' ? 'user-message' : 'bot-message';
  div.textContent = message;
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function typeEffect(text) {
  const div = document.createElement('div');
  div.className = 'bot-message';
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;

  for (let i = 0; i < text.length; i++) {
    div.textContent += text.charAt(i);
    chatBox.scrollTop = chatBox.scrollHeight;
    await new Promise(resolve => setTimeout(resolve, 15));
  }
}

async function getAIResponse(userMessage) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: userMessage }],
          role: "user"
        }]
      })
    });

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada balasan dari AI.";
  } catch (error) {
    console.error("Error:", error);
    return "Terjadi kesalahan saat menghubungi Gemini API.";
  }
}
async function typeIntroMessage(text, elementId) {
  const element = document.getElementById(elementId);
  for (let i = 0; i < text.length; i++) {
    element.textContent += text.charAt(i);
    await new Promise(resolve => setTimeout(resolve, 40)); // kecepatan ngetik
  }
}

// Jalankan saat halaman selesai dimuat
window.onload = () => {
  typeIntroMessage("Halo! Saya Maulana AI, apa yang bisa saya bantu?", "intro-message");
};
window.addEventListener("load", () => {
  const music = document.getElementById("bg-music");
  music.volume = 0.2;
  music.play().catch(() => {
    alert("Klik di mana saja untuk memulai musik.");
    document.body.addEventListener("click", () => {
      music.play();
    }, { once: true });
  });
});
