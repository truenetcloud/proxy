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
// CHAT SEND
// =========================
app.post("/chat/send", async (req, res) => {
  try {
    const r = await fetch("https://chatbot.truenetcomp.workers.dev/send", {
      method:"POST",
      headers:{
        "Content-Type":"application/json",
        "x-forwarded-for": req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        "x-real-ip": req.headers["x-real-ip"] || req.socket.remoteAddress
      },
      body: JSON.stringify(req.body)
    });

    res.status(r.status);
    res.send(await r.text());

  } catch (e) {
    res.status(500).send("error");
  }
});

// =========================
// CHAT GET
// =========================
app.get("/chat", async (req, res) => {
  try {
    const r = await fetch(`https://chatbot.truenetcomp.workers.dev/?client=${req.query.client}`);

    res.status(r.status);
    res.send(await r.text());

  } catch (e) {
    res.status(500).send("error");
  }
});


// =========================
// 🆕 CREATE ORDER
// =========================
app.post("/create", async (req, res) => {
  try {

    //console.log("CREATE", req.body);
    console.log("x-forwarded-for: ", req.headers["x-forwarded-for"]);
    console.log("remoteAddress1: ", req.socket.remoteAddress);
    console.log("x-real-ip: ", req.headers["x-real-ip"]);
    console.log("remoteAddress2: ", req.socket.remoteAddress);

    const r = await fetch(`${TARGET}/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        "x-real-ip": req.headers["x-real-ip"] || req.socket.remoteAddress
      },
      body: JSON.stringify(req.body)
    });

    const contentType = r.headers.get("content-type") || "";

    res.status(r.status);

    if (contentType.includes("application/json")) {
      const data = await r.json();
      return res.json(data);
    } else {
      const text = await r.text();
      return res.send(text);
    }

  } catch (e) {
    console.error("CREATE ERROR", e);
    res.status(500).send("error");
  }
});


// ===== GET =====
app.get("/", async (req, res) => {
  try {
    const r = await fetch(`${TARGET}/?order=${req.query.order}`);

    const contentType = r.headers.get("content-type") || "";

    res.status(r.status);
    
    if (contentType.includes("application/json")) {
      const data = await r.json();
      return res.json(data);
    } else {
      const text = await r.text();
      return res.send(text);
    }
  } catch (e) {
    res.status(500).send("error");
  }
});

// ===== POST =====
app.post("/submit", async (req, res) => {
  try {
    const r = await fetch(`${TARGET}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": req.headers["x-forwarded-for"] || req.socket.remoteAddress,
        "x-real-ip": req.headers["x-real-ip"] || req.socket.remoteAddress
      },
      body: JSON.stringify(req.body)
    });

    const contentType = r.headers.get("content-type") || "";

    res.status(r.status);

    if (contentType.includes("application/json")) {
      const data = await r.json();
      return res.json(data);
    } else {
      const text = await r.text();
      return res.send(text);
    }
  } catch (e) {
    res.status(500).send("error");
  }
});

app.listen(10000, () => console.log("proxy started"));
