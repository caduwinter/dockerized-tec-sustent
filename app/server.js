const WebSocket = require("ws");
const express = require("express");
const http = require("http");
const { Client } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const client = new Client({
  host: process.env.DATABASE_HOST || "db",
  port: process.env.DATABASE_PORT || 5432,
  user: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "example",
  database: process.env.DATABASE_NAME || "mydatabase",
});

client
  .connect()
  .then(() => {
    console.log("Conectado ao PostgreSQL.");

    return client.query(`
      CREATE TABLE IF NOT EXISTS word_count (
        id SERIAL PRIMARY KEY,
        total INTEGER NOT NULL
      );
    `);
  })
  .then(() => {
    return client.query(
      "INSERT INTO word_count (total) SELECT 0 WHERE NOT EXISTS (SELECT 1 FROM word_count LIMIT 1)"
    );
  })
  .catch((err) => {
    console.error("Erro ao conectar ao PostgreSQL ou criar tabela:", err);
  });

async function accessTable() {
  try {
    const res = await client.query("SELECT * FROM word_count");

    console.log("Dados da tabela word_count:", res.rows);

    return res.rows[0].total || 0;
  } catch (err) {
    console.error("Erro ao acessar a tabela:", err);
  }
}

function updateWordCount(count) {
  client.query("UPDATE word_count SET total = total + $1", [count], (err) => {
    if (err) {
      console.error("Erro ao atualizar o total de palavras:", err);
    } else {
      console.log(`Total de palavras atualizado: ${count}`);
    }
  });

  accessTable();
}

const clients = new Set();

wss.on("connection", (ws) => {
  console.log("Novo cliente conectado");

  clients.add(ws);

  ws.on("message", async (message) => {
    console.log(`Tipo de mensagem recebida: ${typeof message}`);
    console.log(`Mensagem recebida: ${message}`);

    if (Buffer.isBuffer(message)) {
      message = message.toString();
    }
    content = JSON.parse(message);

    if (content.type === "request_total") {
      broadcastUpdate({});
    } else if (content.type === "update") {
      const wordCount = content.text.trim().split(/\s+/).length;
      updateWordCount(wordCount);
      broadcastUpdate({});
    } else {
      console.error("Mensagem recebida não é uma string:", message);
      broadcastUpdate({ error: "Mensagem recebida não é uma string." });
    }
  });

  ws.on("close", () => {
    console.log("Cliente desconectado");
    clients.delete(ws);
    broadcastUpdate({});
  });

  ws.on("error", (error) => {
    console.error("Erro no WebSocket:", error);
  });
});

async function broadcastUpdate(update) {
  update.total = await accessTable();

  update.clients = clients.size;
  const message = JSON.stringify(update);
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

app.use(express.static("public"));

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
