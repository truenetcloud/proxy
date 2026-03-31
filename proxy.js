import express from "express";

const app = express();
app.use(express.json());

const TARGET = "https://payworker.truenetcomp.workers.dev";

// 🔥 ГЛОБАЛЬНЫЙ CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ===== GET =====
app.get("/", async (req, res) => {
  try {
    const r = await fetch(`${TARGET}/?order=${req.query.order}`);
    const text = await r.text();
    res.send(text);
  } catch (e) {
    res.status(500).send("error");
  }
});

// ===== POST =====
app.post("/submit", async (req, res) => {
  try {
    const r = await fetch(`${TARGET}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    res.send(text);
  } catch (e) {
    res.status(500).send("error");
  }
});

app.listen(10000, () => console.log("proxy started"));
