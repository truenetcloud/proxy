import express from "express";

const app = express();
app.use(express.json());

const TARGET = "https://payworker.truenetcomp.workers.dev";

// 🔥 ГЛОБАЛЬНЫЙ CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, x-api-key");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// =========================
// 🆕 CREATE ORDER
// =========================
app.post("/create", async (req, res) => {
  try {

    console.log("CREATE", req.body);

    const r = await fetch(`${TARGET}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": req.headers["x-forwarded-for"] || req.ip
      },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    res.send(text);

  } catch (e) {
    console.error("CREATE ERROR", e);
    res.status(500).send("error");
  }
});


// ===== GET =====
app.get("/", async (req, res) => {
  try {
    //const r = await fetch(`${TARGET}/?order=${req.query.order}`);
    const r = await fetch(`${TARGET}/?order=${req.query.order}`, {
      headers: {
        "CF-Connecting-IP": req.headers["x-forwarded-for"] || req.ip
      }
    });
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
      //headers: { "Content-Type": "application/json" },
      headers: {
        "Content-Type": "application/json",
        "CF-Connecting-IP": req.headers["x-forwarded-for"] || req.ip
      },
      body: JSON.stringify(req.body)
    });

    const text = await r.text();
    res.send(text);
  } catch (e) {
    res.status(500).send("error");
  }
});

app.listen(10000, () => console.log("proxy started"));
