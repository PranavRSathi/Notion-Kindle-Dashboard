import express from "express";
import fetch from "node-fetch";
import fs from "fs";
import "dotenv/config";

/* ================= CONFIG ================= */

const PORT = 3000;
const DATABASE_ID = "YOUR_DATABASE_ID_HERE";
const OUT_FILE = "new.html";

const SERVER_REFRESH_MS = 2 * 60 * 1000; // regenerate from Notion
const KINDLE_REFRESH_SEC = 120;          // browser auto-refresh

/* ================= SERVER ================= */

const app = express();
app.use(express.json());
app.use(express.static(".")); // serve new.html

/* ============ NOTION HELPERS ============ */

async function notionQuery() {
  const res = await fetch(
    `https://api.notion.com/v1/databases/${DATABASE_ID}/query`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
        "Notion-Version": "2022-06-28",
        "Content-Type": "application/json"
      }
    }
  );
  const data = await res.json();
  return data.results || [];
}

async function updateNotion(pageId, done) {
  await fetch(`https://api.notion.com/v1/pages/${pageId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      properties: {
        Done: { checkbox: done }
      }
    })
  });
}

/* ============ PROPERTY EXTRACTORS ============ */

function getTitle(p) {
  const t = Object.values(p.properties).find(x => x.type === "title");
  return t?.title?.map(x => x.plain_text).join("") || "";
}

function getDate(p) {
  const d = Object.values(p.properties).find(x => x.type === "date");
  return d?.date?.start || null;
}

function isDone(p) {
  const c = Object.values(p.properties).find(x => x.type === "checkbox");
  return c?.checkbox === true;
}

function weekday(d) {
  return new Date(d).toLocaleDateString("en-US", { weekday: "long" });
}

/* ============ HTML GENERATOR ============ */

async function generateHTML() {
  const pages = await notionQuery();
  const days = {};

  for (const p of pages) {
    const title = getTitle(p);
    const date = getDate(p);
    if (!title || !date) continue;

    const day = weekday(date);
    days[day] ??= [];
    days[day].push({
      id: p.id,
      title,
      done: isDone(p)
    });
  }

  let menu = "";
  let sections = "";

  for (const day of Object.keys(days)) {
    menu += `<h2 onclick="showDay('${day}')">${day}</h2>`;

    sections += `
<section class="day" data-day="${day}">
  <div class="back" onclick="back()">← Back</div>`;

    for (const t of days[day]) {
      sections += `
  <div class="todo ${t.done ? "done" : ""}"
       data-page="${t.id}"
       onclick="toggle(this)">
    <span class="box">${t.done ? "✔" : "☐"}</span> ${t.title}
  </div>`;
    }

    sections += `</section>`;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<meta http-equiv="refresh" content="${KINDLE_REFRESH_SEC}">
<title>Weekly To-Do</title>

<style>
body{font-family:serif;font-size:1.6em;padding:.8em}
h1{text-align:center;margin:.2em 0 .6em}
.menu h2{cursor:pointer;border-bottom:1px solid #000;padding:.4em 0}
.day{display:none}
.todo{cursor:pointer;margin:.4em 0}
.todo.done{text-decoration:line-through;opacity:.6}
.back{cursor:pointer;font-weight:bold;margin-bottom:.6em}
</style>

<script>
function showDay(day){
  document.querySelector(".menu").style.display="none";
  document.querySelectorAll(".day").forEach(d=>d.style.display="none");
  document.querySelector('[data-day="'+day+'"]').style.display="block";
}
function back(){
  document.querySelector(".menu").style.display="block";
  document.querySelectorAll(".day").forEach(d=>d.style.display="none");
}
function toggle(el){
  const done=el.classList.toggle("done");
  el.querySelector(".box").textContent=done?"✔":"☐";
  fetch("/toggle",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({pageId:el.dataset.page,done})
  });
}
window.onload=()=>{
  const today=new Date().toLocaleDateString("en-US",{weekday:"long"});
  const el=document.querySelector('[data-day="'+today+'"]');
  if(el) showDay(today);
};
</script>
</head>

<body>
<h1>Weekly To-Do</h1>
<div class="menu">${menu}</div>
${sections}
</body>
</html>`;

  fs.writeFileSync(OUT_FILE, html);
  console.log("✔ HTML regenerated");
}

/* ============ ROUTES ============ */

app.post("/toggle", async (req, res) => {
  const { pageId, done } = req.body;
  await updateNotion(pageId, done);
  await generateHTML();
  res.json({ ok: true });
});

/* ============ STARTUP ============ */

generateHTML();
setInterval(generateHTML, SERVER_REFRESH_MS);

app.listen(PORT, () => {
  console.log(`✔ Dashboard running at http://localhost:${PORT}/new.html`);
});
