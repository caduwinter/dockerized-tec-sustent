const socket = new WebSocket("ws://localhost:3000");
const messageElement = document.getElementById("message");
const wordCountElement = document.getElementById("wordCount");
const onlineElement = document.getElementById("online");
let wordCount = 0;

socket.onopen = function () {
  console.log("Conectado ao servidor WebSocket");
  socket.send(JSON.stringify({ type: "request_total" }));
};

function updateWordCount(count) {
  wordCountElement.textContent = `Contador: ${count}`;
}

messageElement.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    const message = messageElement.value.trim();
    const words = message.split(/\s+/).filter(Boolean);
    wordCount = words.length;
    updateWordCount(wordCount);

    messageElement.value = "";
    socket.send(JSON.stringify({ type: "update", text: message }));
  }
});

socket.onmessage = (event) => {
  data = JSON.parse(event.data);
  wordCountElement.textContent = `Contador: ${data.total}`;
  onlineElement.textContent = `Online: ${data.clients}`;
};
