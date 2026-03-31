import express from "express";

const app = express();
app.use(express.json());

const TARGET = "https://payworker.truenetcomp.workers.dev";

app.get("/", async (req, res) => {
  try {
    const r = await fetch(`${TARGET}/?order=${req.query.order}`);
    const text = await r.text();

    res.set("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (e) {
    res.status(500).send("error");
  }
});

app.post("/submit", async (req, res) => {
  try {
    const r = await fetch(`${TARGET}/submit`, {
      method: "POST",
      headers: {"Content-Type":"application/json"},
      body: JSON.stringify(req.body)
    });

    const text = await r.text();

    res.set("Access-Control-Allow-Origin", "*");
    res.send(text);
  } catch (e) {
    res.status(500).send("error");
  }
});

app.listen(10000, () => console.log("proxy started"));
